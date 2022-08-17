import create from 'zustand';
import { format } from 'date-fns';

import type { Connection, Station } from '@/types/opendata';

type JourneySearchState = {
  departureStation?: Station;
  arrivalStation?: Station;
  departureTime: string;
  setDepartureTime: (date: string) => void;
  clearSearchInfo: () => void;
  setDepartureStation: (station: Station) => void;
  setArrivalStation: (station: Station) => void;
  connections?: Connection[];
  setConnections: (connections: Connection[]) => void;
};

export const useJourneySearchStore = create<JourneySearchState>((set) => ({
  connections: undefined,
  departureTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  setDepartureTime: (date) => set(() => ({ departureTime: date })),
  setDepartureStation: (station) => set(() => ({ departureStation: station })),
  setArrivalStation: (station) => set(() => ({ arrivalStation: station })),
  setConnections: (connections) => set(() => ({ connections })),
  clearSearchInfo: () =>
    set(() => ({
      departureStation: undefined,
      arrivalStation: undefined,
      departureTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    })),
}));
