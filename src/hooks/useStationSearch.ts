import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDebounce } from 'react-relaxed';

type Station = {
  id: string;
  name: string;
};

const useStationSearch = (query: string): Station[] => {
  const [debouncedQuery] = useDebounce(query, 500);
  const [stations, setStations] = useState([]);

  useEffect(() => {
    const getStations = async () => {
      const { data } = await axios.get('https://transport.opendata.ch/v1/locations?query=' + debouncedQuery);
      setStations(data.stations.filter((station) => station.id));
    };

    getStations();
  }, [debouncedQuery]);

  return stations;
};

export default useStationSearch;
