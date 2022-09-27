import create from 'zustand';
import { format } from 'date-fns';

import type { Journey, Station } from '@/types/opendata';

type JourneySearchState = {
  departureStation?: Station;
  arrivalStation?: Station;
  departureTime: string;
  setDepartureTime: (date: string) => void;
  clearSearchInfo: () => void;
  setDepartureStation: (station: Station) => void;
  setArrivalStation: (station: Station) => void;
  journeys?: Journey[];
  setJourneys: (journeys: Journey[]) => void;
};

export const useJourneySearchStore = create<JourneySearchState>((set) => ({
  journeys: undefined,
  departureTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  setDepartureTime: (date) => set(() => ({ departureTime: date })),
  setDepartureStation: (station) => set(() => ({ departureStation: station })),
  setArrivalStation: (station) => set(() => ({ arrivalStation: station })),
  setJourneys: (journeys) => set(() => ({ journeys })),
  clearSearchInfo: () =>
    set(() => ({
      departureStation: undefined,
      arrivalStation: undefined,
      departureTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      journeys: undefined,
    })),
}));
