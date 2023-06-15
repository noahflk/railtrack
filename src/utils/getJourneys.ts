import axios from 'axios';

import { TRANSPORT_API_URL } from '@/constants';
import type { Journey, Station } from '@/types/opendata';

export type GetJourneyParams = {
  departureStation?: Station;
  arrivalStation?: Station;
  viaStation?: Station;
  departureTime: string;
};

export const getJourneys = async ({
  departureStation,
  arrivalStation,
  departureTime,
  viaStation,
}: GetJourneyParams) => {
  const { data } = await axios.get<{ connections: Journey[] }>(`${TRANSPORT_API_URL}/connections`, {
    params: {
      from: departureStation?.name,
      to: arrivalStation?.name,
      via: viaStation?.name,
      date: departureTime.split('T')[0],
      time: departureTime.split('T')[1],
    },
  });

  return data.connections;
};
