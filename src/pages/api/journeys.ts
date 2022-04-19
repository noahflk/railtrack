// get journeys and fetch their info (from, to, distance and so on)

import { NextApiRequest, NextApiResponse } from 'next';
import { isBefore } from 'date-fns';

import { supabase } from '@/utils/supabaseClient';
import { calculateJourneyDistance } from '@/utils/calculateDistances';
import { roundToOneDecimal } from '@/utils/rounding';

const getDepartureStation = ({ sections }): string => {
  // sort sections array by departure_time property that's on each element
  // the departure of a journey is the departure_station_name of the earliest section
  sections.sort((sectionA, sectionB) => {
    const dateA = new Date(sectionA.departure_time);
    const dateB = new Date(sectionB.departure_time);

    if (isBefore(dateA, dateB)) return -1;
    if (isBefore(dateB, dateA)) return 1;
    return 0;
  });

  return sections[0].departure_station_name;
};

const getArrivalStation = ({ sections }): string => {
  sections.sort((sectionA, sectionB) => {
    const dateA = new Date(sectionA.departure_time);
    const dateB = new Date(sectionB.departure_time);

    if (isBefore(dateA, dateB)) return 1;
    if (isBefore(dateB, dateA)) return -1;
    return 0;
  });

  return sections[0].arrival_station_name;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // TODO find a way to fix this workaround
  // Without it the user session can somehow not be accessed by the subsequent queryt
  const { token } = await supabase.auth.api.getUserByCookie(req);
  supabase.auth.setAuth(token ?? '');

  // TODO this needs typing
  const { data: journeys } = await supabase.from('journeys').select(`
  id,
  duration,
  sections (
    departure_time,
    arrival_time,
    departure_station_name,
    arrival_station_name,
    passes (
      station_coordinate_x,
      station_coordinate_y,
      station_name
    )
  )
`);

  const enhancedJourneys = (journeys ?? []).map((journey) => ({
    id: journey.id,
    duration: journey.duration,
    stops: journey.sections.length - 1,
    departureStation: getDepartureStation(journey),
    arrivalStation: getArrivalStation(journey),
    distance: roundToOneDecimal(calculateJourneyDistance(journey)),
  }));

  res.status(200).json({
    journeys: enhancedJourneys,
  });
};

export default handler;
