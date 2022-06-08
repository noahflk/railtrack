export type Journey = {
  id: number;
  duration: number;
  stops: number;
  departureStation: string;
  arrivalStation: string;
  distance: number;
  departureTime: string;
  arrivalTime: string;
};

export type PaginatedJourneys = {
  journeys: Journey[];
  count: number;
  page: number;
};
