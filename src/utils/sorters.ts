import { Connection } from 'types/opendata';

export const sortJourneysLatestFirst = (journeys: Journey[]): Journey[] => {
  return journeys.sort((a, b) => new Date(b.departureTime).getTime() - new Date(a.departureTime).getTime());
};
