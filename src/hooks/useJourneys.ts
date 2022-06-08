import { useQuery } from 'react-query';

import type { PaginatedJourneys } from '@/types/journey';

const getJourneys = async (page: number): Promise<PaginatedJourneys> => {
  const response = await fetch(`/api/journeys?page=${page}`);
  return response.json();
};

const useJourneys = (page?: number) => {
  return useQuery(['all-journeys', page], () => getJourneys(page ?? 1), { keepPreviousData: !!page });
};

export default useJourneys;
