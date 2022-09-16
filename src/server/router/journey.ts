import { TRPCError } from '@trpc/server';
import axios from 'axios';
import { isBefore } from 'date-fns';
import { z } from 'zod';

import { TRANSPORT_API_URL } from '@/constants';
import { createProtectedRouter } from '@/server/router/protected';
import { calculateJourneyDistance } from '@/utils/calculateDistance';
import { parseDurationString } from '@/utils/duration';
import { roundToOneDecimal } from '@/utils/rounding';
import type { Journey } from '@/types/opendata';
import type { Section } from '@prisma/client';

type ConnectionParams = {
  departureStation: string;
  arrivalStation: string;
  departureTime: string;
  platform: string;
};

type StationInformation = {
  name: string;
  time: Date;
};

const findConnection = async ({
  departureStation,
  arrivalStation,
  departureTime,
  platform,
}: ConnectionParams): Promise<Journey | undefined> => {
  const { data } = await axios.get<{ connections: Journey[] }>(
    `${TRANSPORT_API_URL}/connections?from=${departureStation}&to=${arrivalStation}&date=${
      departureTime.split('T')[0]
    }&time=${departureTime.split('T')[1]}`
  );

  // ensure we have the desired connection by comparing departure time and platform
  return data.connections.find(
    (connection) => connection.from.platform === platform && connection.from.departure === departureTime
  );
};

const getDepartureStation = (sections: Section[]): StationInformation => {
  // sort sections array by departureTime property that's on each element
  // the departure of a journey is the departure_station_name of the earliest section
  sections.sort((sectionA, sectionB) => {
    const dateA = sectionA.departureTime;
    const dateB = sectionB.departureTime;

    if (isBefore(dateA, dateB)) return -1;
    if (isBefore(dateB, dateA)) return 1;

    return 0;
  });

  return {
    name: sections[0]?.departureStation || '',
    time: sections[0]?.departureTime || new Date(),
  };
};

const getArrivalStation = (sections: Section[]): StationInformation => {
  sections.sort((sectionA, sectionB) => {
    const dateA = new Date(sectionA.departureTime);
    const dateB = new Date(sectionB.departureTime);

    if (isBefore(dateA, dateB)) return 1;
    if (isBefore(dateB, dateA)) return -1;

    return 0;
  });

  return {
    name: sections[0]?.arrivalStation || '',
    time: sections[0]?.arrivalTime || new Date(),
  };
};

export const journeyRouter = createProtectedRouter()
  .mutation('add', {
    // this information is enough to precicely find the precise connection again
    // that way we avoid passing the whole connection object from the client to the server
    input: z.object({
      departureStation: z.string(),
      arrivalStation: z.string(),
      departureTime: z.string(),
      platform: z.string(),
    }),
    async resolve({ input, ctx }) {
      const connection = await findConnection(input);

      if (!connection) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Connection not found' });
      }

      const sections = connection.sections.filter((section) => section.journey);

      // create structured data for connection to save it
      const sectionsData = sections.map((section) => {
        const passes = section.journey.passList.map((pass) => {
          return {
            arrivalTime: new Date(pass.arrival),
            departureTime: new Date(pass.departure),
            stationName: pass.station.name,
            stationCoordinateX: pass.station.coordinate.x,
            stationCoordinateY: pass.station.coordinate.y,
          };
        });

        return {
          departureTime: new Date(section.departure.departure),
          arrivalTime: new Date(section.arrival.arrival),
          departureStation: section.departure.station.name,
          departureStationCoordinateX: section.departure.station.coordinate.x,
          departureStationCoordinateY: section.departure.station.coordinate.y,
          arrivalStation: section.arrival.station.name,
          arrivalStationCoordinateX: section.arrival.station.coordinate.x,
          arrivalStationCoordinateY: section.arrival.station.coordinate.y,
          destination: section.journey.to,
          trainOperator: section.journey.operator,
          trainNumber: section.journey.number,
          trainCategory: section.journey.category,
          passes: {
            create: passes,
          },
        };
      });

      await ctx.prisma.connection.create({
        data: {
          duration: parseDurationString(connection.duration),
          userId: ctx.user.id,
          sections: {
            create: sectionsData,
          },
        },
      });

      return { success: true };
    },
  })
  .query('get', {
    input: z.optional(z.number()),
    async resolve({ input, ctx }) {
      const connections = await ctx.prisma.connection.findMany({
        // this limits the number of returned connections if provided
        // otherwise all will be returned
        take: input,
        where: {
          userId: ctx.user.id,
        },
        include: {
          sections: {
            include: {
              passes: true,
            },
          },
        },
      });

      // // enhance connection with more info
      return connections.map((connection) => {
        const departureStation = getDepartureStation(connection.sections);
        const arrivalStation = getArrivalStation(connection.sections);

        return {
          ...connection,
          departureStation: departureStation.name,
          arrivalStation: arrivalStation.name,
          departureTime: departureStation.time,
          arrivalTime: arrivalStation.time,
          stops: connection.sections.length - 1,
          distance: roundToOneDecimal(calculateJourneyDistance(connection.sections)),
        };
      });
    },
  })
  .query('stats', {
    async resolve({ ctx }) {
      const connections = await ctx.prisma.connection.findMany({
        where: {
          userId: ctx.user.id,
        },
        select: {
          sections: {
            select: {
              passes: {
                select: {
                  stationCoordinateX: true,
                  stationCoordinateY: true,
                  stationName: true,
                },
              },
            },
          },
        },
      });

      const distance = connections.reduce(
        (partial, connection) => partial + calculateJourneyDistance(connection.sections),
        0
      );

      const numberOfConnections = await ctx.prisma.connection.count({
        where: {
          userId: ctx.user.id,
        },
      });

      const durationResult = await ctx.prisma.$queryRaw<
        { sum: bigint }[]
      >`SELECT sum(duration) FROM "Connection" WHERE "userId" = ${ctx.user.id}`;

      const durationInMinutes = Number(durationResult[0]?.sum);

      return {
        distance: roundToOneDecimal(distance),
        count: numberOfConnections,
        coordinates: connections,
        duration: roundToOneDecimal(durationInMinutes / 60),
      };
    },
  })
  .mutation('delete', {
    input: z.number(),
    async resolve({ input, ctx }) {
      // check if connection exists and belongs to user
      const connection = await ctx.prisma.connection.findFirst({
        where: {
          id: input,
          userId: ctx.user.id,
        },
      });

      if (!connection) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Connection not found' });
      }

      // actually delete the connection
      await ctx.prisma.connection.delete({
        where: {
          id: input,
        },
      });

      return { success: true };
    },
  });
