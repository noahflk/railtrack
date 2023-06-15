export type JourneyIdentifier = {
  departureStation: string;
  arrivalStation: string;
  departureTime: string;
  viaStation?: string;
  platform: string | null;
};

export type Section = {
  passes: {
    stationCoordinateX: number;
    stationCoordinateY: number;
    stationName: string;
  }[];
};

export type Coordinates = {
  sections: Section[];
};
