import { useQuery } from 'react-query';

import type { Journey } from '@/types/coordinates';

type Result = {
  distance: number;
  duration: number;
  count: number;
  coordinates: Journey[];
};

const getStats = async (): Promise<Result> => {
  const response = await fetch('/api/stats');
  const data = await response.json();
  return data;
};

const useStats = () => {
  return useQuery('journey-stats', getStats);
};

export default useStats;
