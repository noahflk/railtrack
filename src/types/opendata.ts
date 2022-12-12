export type Journey = {
  duration: string;
  products: string[];
  transfers: number;
  from: From;
  to: To;
  sections: Section[];
};

export type Station = {
  id: number;
  name: string;
  icon: string;
  coordinate: {
    x: number;
    y: number;
  };
};

export type Section = {
  departure: From;
  arrival: To;
  journey?: {
    category: string;
    name: string;
    number: string;
    operator: string;
    to: string;
    passList: Pass[];
  };
  walk?: {
    duration?: number;
  };
};

type Pass = From & To;

type From = {
  departure: string;
  departureTimestamp: number;
  location: Station;
  station: Station;
  platform: string;
};

type To = {
  arrival: string;
  arrivalTimestamp: number;
  location: Station;
  station: Station;
  platform: string;
};
