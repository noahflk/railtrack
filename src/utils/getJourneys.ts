import axios from 'axios';

import { TRANSPORT_API_URL } from '@/constants';
import type { Journey, Station } from '@/types/opendata';

export const DEFAULT_IS_ARRIVAL = false;

export type GetJourneyParams = {
  departureStation?: Station;
  arrivalStation?: Station;
  viaStation?: Station;
  departureTime: string;
  isArrival: boolean;
};

export const getJourneys = async ({
  departureStation,
  arrivalStation,
  departureTime,
  viaStation,
  isArrival,
}: GetJourneyParams) => {
  const { data } = await axios.get<{ connections: Journey[] }>(`${TRANSPORT_API_URL}/connections`, {
    params: {
      from: departureStation?.name,
      to: arrivalStation?.name,
      via: viaStation?.name,
      date: departureTime.split('T')[0],
      time: departureTime.split('T')[1],
      isArrivalTime: isArrival ? 1 : 0,
    },
  });

  return data.connections;
};
