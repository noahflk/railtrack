export type Connection = {
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
  coordinate: {
    x: number;
    y: number;
  };
};

type Section = {
  departure: From;
  arrival: To;
  journey: {
    category: string;
    name: string;
    number: string;
    operator: string;
    to: string;
    passList: Pass[];
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
