import { useQuery } from 'react-query';

import type { Journey } from '@/types/journey';

const getRecentJourneys = async (): Promise<Journey[]> => {
  const response = await fetch('/api/journeys?limit=7');
  const data = await response.json();
  return data ? data.journeys : [];
};

const useRecentJourneys = () => {
  return useQuery('recent-journeys', getRecentJourneys);
};

export default useRecentJourneys;
