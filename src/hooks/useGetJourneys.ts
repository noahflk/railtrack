import axios from 'axios';
import toast from 'react-hot-toast';
import { TRANSPORT_API_URL } from '@/constants';
import type { Journey, Station } from '@/types/opendata';
import { useMutation } from '@tanstack/react-query';

type Arguments = {
  departureStation?: Station;
  arrivalStation?: Station;
  departureTime: string;
};

const getJourneys = ({ departureStation, arrivalStation, departureTime }: Arguments) =>
  axios.get<{ connections: Journey[] }>(
    `${TRANSPORT_API_URL}/connections?from=${departureStation?.name}&to=${arrivalStation?.name}&date=${
      departureTime.split('T')[0]
    }&time=${departureTime.split('T')[1]}`
  );

export const useGetJourneys = () =>
  useMutation({
    mutationFn: async ({ departureStation, arrivalStation, departureTime }: Arguments) =>
      getJourneys({ departureStation, arrivalStation, departureTime }).then((res) => res.data.connections),
    onError: () => {
      toast.error('Unable to load journeys');
    },
  });
