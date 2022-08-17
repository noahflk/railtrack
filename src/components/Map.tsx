import MapboxMap, { Layer, Source } from 'react-map-gl';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

type Section = {
  passes: {
    stationCoordinateX: number;
    stationCoordinateY: number;
    stationName: string;
  }[];
};

type Coordinates = {
  sections: Section[];
};

type Coordinate = number[];

type Feature = {
  type: string;
  geometry: {
    type: string;
    coordinates: Coordinate[];
  };
};

const getSectionCoordinates = (section: Section): Coordinate[] => {
  return section.passes.map((pass) => [pass.stationCoordinateY, pass.stationCoordinateX]);
};

const getFeatures = (journeys: Coordinates[]): Feature[] => {
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

export const Map: React.FC<{ journeys: Coordinates[] }> = ({ journeys }) => {
  const geoData = {
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
      {/* @ts-expect-error TODO: fix the type error with the data  property */}
      <Source id="polylineLayer" type="geojson" data={geoData}>
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
