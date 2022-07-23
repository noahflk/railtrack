import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDebounce } from 'react-relaxed';

import { TRANSPORT_API_URL } from '@/constants';
import type { Station } from '@/types/opendata';

type Response = {
  stations: Station[];
};

export const useStationSearch = (query: string): Station[] => {
  const [debouncedQuery] = useDebounce(query, 500);
  const [stations, setStations] = useState<Station[]>([]);

  useEffect(() => {
    const getStations = async () => {
      const { data } = await axios.get<Response>(TRANSPORT_API_URL + '/locations?query=' + debouncedQuery);

      setStations(data.stations.filter((station) => station.id));
    };

    getStations();
  }, [debouncedQuery]);

  return stations;
};
