import MapboxMap, { Layer, Source } from 'react-map-gl';

import type { Journey, Section } from '@/types/coordinates';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

type Props = {
  journeys: Journey[];
};

type Feature = {
  type: string;
  geometry: {
    type: string;
    coordinates: number[][];
  };
};

const getSectionCoordinates = (section: Section): number[][] => {
  return section.passes.map((pass) => [pass.station_coordinate_y, pass.station_coordinate_x]);
};

const getFeatures = (journeys: Journey[]): Feature[] => {
  const features: Feature[] = [];

  journeys.forEach((journey) => {
    journey.sections.forEach((section) => {
      features.push({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: getSectionCoordinates(section),
        },
      });
    });
  });

  return features;
};

const Map: React.FC<Props> = ({ journeys }) => {
  const dataOne = {
    type: 'FeatureCollection',
    features: getFeatures(journeys),
  };

  return (
    <MapboxMap
      initialViewState={{
        longitude: 8.224,
        latitude: 47,
        zoom: 6,
      }}
      cooperativeGestures
      style={{ width: '100%', height: 400, overflow: 'hidden' }}
      mapStyle="mapbox://styles/mapbox/light-v10"
      mapboxAccessToken={MAPBOX_TOKEN}
    >
      <Source id="polylineLayer" type="geojson" data={dataOne}>
        <Layer
          id="lineLayer"
          type="line"
          source="my-data"
          layout={{
            'line-join': 'round',
            'line-cap': 'round',
          }}
          paint={{
            'line-color': '#902D41',
            'line-width': 3,
          }}
        />
      </Source>
    </MapboxMap>
  );
};

export default Map;
