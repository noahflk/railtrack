import axios from 'axios';
import toast from 'react-hot-toast';
import { TRANSPORT_API_URL } from '@/constants';
import { useJourneySearchStore } from '@/hooks/useJourneySearchStore';
import type { Journey, Station } from '@/types/opendata';
import { useQuery } from '@tanstack/react-query';

const getJourneys = ({
  departureStation,
  arrivalStation,
  departureTime,
}: {
  readonly departureStation?: Station;
  readonly arrivalStation?: Station;
  readonly departureTime: string;
}) => {
  return axios.get<{ connections: Journey[] }>(
    `${TRANSPORT_API_URL}/connections?from=${departureStation?.name}&to=${arrivalStation?.name}&date=${
      departureTime.split('T')[0]
    }&time=${departureTime.split('T')[1]}`
  );
};

export const useGetJourneys = () => {
  const setJourneys = useJourneySearchStore((state) => state.setJourneys);
  const departureTime = useJourneySearchStore((state) => state.departureTime);
  const departureStation = useJourneySearchStore((state) => state.departureStation);
  const arrivalStation = useJourneySearchStore((state) => state.arrivalStation);

  return useQuery(
    ['transportApi', departureStation, arrivalStation, departureTime],
    () => {
      return getJourneys({ departureStation, arrivalStation, departureTime });
    },
    {
      onSuccess: (res) => {
        setJourneys(res.data.connections);
      },
      onError: () => {
        toast.error('Unable to load journeys');
      },
      enabled: !!departureTime && !!departureStation && !!arrivalStation,
    }
  );
};
