import { create } from 'zustand';
import { format } from 'date-fns';

import type { Journey, Station } from '@/types/opendata';

type JourneySearchState = {
  departureStation?: Station;
  arrivalStation?: Station;
  viaStation?: Station;
  departureTime: string;
  setDepartureTime: (date: string) => void;
  clearSearchInfo: () => void;
  setDepartureStation: (station: Station) => void;
  setArrivalStation: (station: Station) => void;
  setViaStation: (station: Station) => void;
  journeys?: Journey[];
  setJourneys: (journeys: Journey[]) => void;
};

export const useJourneySearchStore = create<JourneySearchState>((set) => ({
  journeys: undefined,
  departureTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  setDepartureTime: (date) => set(() => ({ departureTime: date })),
  setDepartureStation: (station) => set(() => ({ departureStation: station })),
  setArrivalStation: (station) => set(() => ({ arrivalStation: station })),
  setViaStation: (station) => set(() => ({ viaStation: station })),
  setJourneys: (journeys) => set(() => ({ journeys })),
  clearSearchInfo: () =>
    set(() => ({
      departureStation: undefined,
      arrivalStation: undefined,
      viaStation: undefined,
      departureTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      journeys: undefined,
    })),
}));
