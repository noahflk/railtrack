import axios from 'axios';
import toast from 'react-hot-toast';
import { TRANSPORT_API_URL } from '@/constants';
import type { Journey, Station } from '@/types/opendata';
import { useMutation } from '@tanstack/react-query';
// import { useJourneySearchStore } from './useJourneySearchStore';

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
  // const departureStation = useJourneySearchStore((state) => state.departureStation);
  // const arrivalStation = useJourneySearchStore((state) => state.arrivalStation);

  return useMutation({
    mutationFn: async ({
      departureStation,
      arrivalStation,
      departureTime,
    }: {
      readonly departureStation?: Station;
      readonly arrivalStation?: Station;
      readonly departureTime: string;
    }) => {
      return getJourneys({ departureStation, arrivalStation, departureTime }).then((res) => res.data.connections);
    },
    onError: () => {
      toast.error('Unable to load journeys');
    },
  });
};
