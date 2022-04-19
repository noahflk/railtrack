import { useQuery } from 'react-query';

const getJourneys = async () => {
  const response = await fetch('/api/journeys');
  const data = await response.json();
  return data ? data.journeys : [];
};

const useJourneys = () => {
  return useQuery('all-journeys', getJourneys);
};

export default useJourneys;
