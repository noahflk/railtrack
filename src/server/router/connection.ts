import { TRPCError } from '@trpc/server';
import axios from 'axios';
import { z } from 'zod';

import { createRouter } from '@/server/router/context';
import { parseDurationString } from '@/utils/duration';
import { supabase } from '@/utils/supabase';
import { TRANSPORT_API_URL } from '@/constants';
import type { Connection } from '@/types/opendata';

type ConnectionParams = {
  departureStation: string;
  arrivalStation: string;
  departureTime: string;
  platform: string;
};

const findConnection = async ({
  departureStation,
  arrivalStation,
  departureTime,
  platform,
}: ConnectionParams): Promise<Connection | undefined> => {
  const { data } = await axios.get<{ connections: Connection[] }>(
    `${TRANSPORT_API_URL}/connections?from=${departureStation}&to=${arrivalStation}&date=${
      departureTime.split('T')[0]
    }&time=${departureTime.split('T')[1]}`
  );

  // ensure we have the desired connection by comparing departure time and platform
  return data.connections.find(
    (connection) => connection.from.platform === platform && connection.from.departure === departureTime
  );
};

export const connectionRouter = createRouter().mutation('add', {
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

    const { user } = await supabase.auth.api.getUserByCookie(ctx.req);

    if (!connection) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Connection not found' });
    }

    if (!user) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Could not find authenticated user' });
    }

    const storedConnection = await ctx.prisma.connection.create({
      data: {
        duration: parseDurationString(connection.duration),
        userId: user.id,
      },
    });

    const sections = connection.sections.filter((section) => section.journey);

    sections.forEach(async (section) => {
      const storedSection = await ctx.prisma.section.create({
        data: {
          departureTime: section.departure.departure,
          arrivalTime: section.arrival.arrival,
          departureStation: section.departure.station.name,
          departureStationCoordinateX: section.departure.station.coordinate.x,
          departureStationCoordinateY: section.departure.station.coordinate.y,
          arrivalStation: section.arrival.station.name,
          arrivalStationCoordinateX: section.arrival.station.coordinate.x,
          arrivalStationCoordinateY: section.arrival.station.coordinate.y,
          connectionId: storedConnection.id,
          destination: section.journey.to,
          trainOperator: section.journey.operator,
          trainNumber: section.journey.number,
          trainCategory: section.journey.category,
        },
      });

      const passes = section.journey.passList.map((pass) => {
        return {
          sectionId: storedSection.id,
          arrivalTime: pass.arrival,
          departureTime: pass.departure,
          stationName: pass.station.name,
          stationCoordinateX: pass.station.coordinate.x,
          stationCoordinateY: pass.station.coordinate.y,
        };
      });

      await ctx.prisma.pass.createMany({ data: passes });
    });

    return { success: true };
  },
});
