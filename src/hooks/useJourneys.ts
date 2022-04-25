import { useQuery } from 'react-query';

import type { Journey } from '@/types/journey';

const getJourneys = async (): Promise<Journey[]> => {
  const response = await fetch('/api/journeys');
  const data = await response.json();
  return data ? data.journeys : [];
};

const useJourneys = () => {
  return useQuery('all-journeys', getJourneys);
};

export default useJourneys;
