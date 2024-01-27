import { create } from 'zustand';
import { format } from 'date-fns';

import type { Journey, Station } from '@/types/opendata';
import { DEFAULT_IS_ARRIVAL } from '@/utils/getJourneys';

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
  isArrival: boolean;
  setIsArrival: (isArrival: boolean) => void;
};

export const useJourneySearchStore = create<JourneySearchState>((set) => ({
  journeys: undefined,
  isArrival: false,
  departureTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  setDepartureTime: (date) => set(() => ({ departureTime: date })),
  setDepartureStation: (station) => set(() => ({ departureStation: station })),
  setArrivalStation: (station) => set(() => ({ arrivalStation: station })),
  setViaStation: (station) => set(() => ({ viaStation: station })),
  setJourneys: (journeys) => set(() => ({ journeys })),
  setIsArrival: (isArrival) => set(() => ({ isArrival })),
  clearSearchInfo: () =>
    set(() => ({
      departureStation: undefined,
      arrivalStation: undefined,
      viaStation: undefined,
      departureTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      journeys: undefined,
      isArrival: DEFAULT_IS_ARRIVAL,
    })),
}));
