import type { Prisma, Section } from '@prisma/client';
import { isBefore } from 'date-fns';

import { calculateJourneyDistance } from '@/utils/calculateDistance';
import { roundToOneDecimal } from '@/utils/rounding';

type StationInformation = {
  name: string;
  time: Date;
};

type FullJourney = Prisma.JourneyGetPayload<{
  include: {
    sections: {
      include: {
        passes: true;
      };
    };
  };
}>;

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

// enhance journey with more info
export const populateJourney = (journey: FullJourney) => {
  const departureStation = getDepartureStation(journey.sections);
  const arrivalStation = getArrivalStation(journey.sections);

  return {
    ...journey,
    departureStation: departureStation.name,
    arrivalStation: arrivalStation.name,
    departureTime: departureStation.time,
    arrivalTime: arrivalStation.time,
    stops: journey.sections.length - 1,
    distance: roundToOneDecimal(calculateJourneyDistance(journey.sections)),
  };
};
