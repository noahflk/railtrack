import create from 'zustand';
import { format } from 'date-fns';
import { Connection, Station } from '@/types/opendata';

type JourneySearchState = {
  departureStation?: Station;
  arrivalStation?: Station;
  departureTime: string;
  setDepartureTime: (date: string) => void;
  setDepartureStation: (station: Station) => void;
  setArrivalStation: (station: Station) => void;
  connections: Connection[];
  setConnections: (connections: Connection[]) => void;
};

const useJourneySearchStore = create<JourneySearchState>((set) => ({
  departureStation: undefined,
  arrivalStation: undefined,
  connections: [],
  departureTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  setDepartureTime: (date) => set(() => ({ departureTime: date })),
  setDepartureStation: (station) => set(() => ({ departureStation: station })),
  setArrivalStation: (station) => set(() => ({ arrivalStation: station })),
  setConnections: (connections) => set(() => ({ connections })),
}));

export default useJourneySearchStore;
