import { Journey } from '@/types/journey';

export const sortJourneysLatestFirst = (journeys: Journey[]): Journey[] => {
  return journeys.sort((a, b) => new Date(b.departureTime).getTime() - new Date(a.departureTime).getTime());
};
