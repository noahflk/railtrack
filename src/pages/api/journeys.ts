import { NextApiRequest, NextApiResponse } from 'next';
import { isBefore } from 'date-fns';

import { supabase } from '@/utils/supabaseClient';
import { calculateJourneyDistance } from '@/utils/calculateDistances';
import { roundToOneDecimal } from '@/utils/rounding';

type StationInformation = {
  name: string;
  time: string;
};

const getDepartureStation = ({ sections }): StationInformation => {
  // sort sections array by departure_time property that's on each element
  // the departure of a journey is the departure_station_name of the earliest section
  sections.sort((sectionA, sectionB) => {
    const dateA = new Date(sectionA.departure_time);
    const dateB = new Date(sectionB.departure_time);

    if (isBefore(dateA, dateB)) return -1;
    if (isBefore(dateB, dateA)) return 1;
    return 0;
  });

  return {
    name: sections[0].departure_station_name,
    time: sections[0].departure_time,
  };
};

const getArrivalStation = ({ sections }): StationInformation => {
  sections.sort((sectionA, sectionB) => {
    const dateA = new Date(sectionA.departure_time);
    const dateB = new Date(sectionB.departure_time);

    if (isBefore(dateA, dateB)) return 1;
    if (isBefore(dateB, dateA)) return -1;
    return 0;
  });

  return {
    name: sections[0].arrival_station_name,
    time: sections[0].arrival_time,
  };
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // TODO find a way to fix this workaround
  // Without it the user session can somehow not be accessed by the subsequent queryt
  const { token } = await supabase.auth.api.getUserByCookie(req);
  supabase.auth.setAuth(token ?? '');

  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;

  let journeys;

  // TODO: fix ordering of records (especially important for limit)

  if (limit) {
    const { data } = await supabase
      .from('journeys')
      .select(
        `
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
    `
      )
      .range(0, limit - 1);

    journeys = data;
  } else {
    const { data } = await supabase.from('journeys').select(`
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
    journeys = data;
  }

  // TODO this needs typing

  const enhancedJourneys = (journeys ?? []).map((journey) => {
    const departureStation = getDepartureStation(journey);
    const arrivalStation = getArrivalStation(journey);

    return {
      id: journey.id,
      duration: journey.duration,
      stops: journey.sections.length - 1,
      departureStation: departureStation.name,
      arrivalStation: arrivalStation.name,
      departureTime: departureStation.time,
      arrivalTime: arrivalStation.time,
      distance: roundToOneDecimal(calculateJourneyDistance(journey)),
    };
  });

  res.status(200).json({
    journeys: enhancedJourneys,
  });
};

export default handler;
