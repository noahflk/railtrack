import { useQuery } from "react-query";

type Result = {
  distance: number;
  departureStation: string;
  arrivalStation: string;
};

const getJourneyStats = async (journeyId: number): Promise<Result> => {
  const response = await fetch(`/api/stats/${journeyId}`);
  const data = await response.json();
  return data;
};

const useJourneyStats = (journeyId: number) => {
  return useQuery(["journey-stats", journeyId], () => getJourneyStats(journeyId));
};

export default useJourneyStats;
