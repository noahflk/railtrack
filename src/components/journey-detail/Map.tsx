import bbox from '@turf/bbox';
import { useRef } from 'react';
import MapboxMap, { Layer, Source, type MapRef } from 'react-map-gl';

import type { Coordinates } from '@/types/journey';
import { trpc } from '@/utils/trpc';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

type Coordinate = number[];

type Feature = {
  type: string;
  geometry: {
    type: string;
    coordinates: Coordinate[];
  };
};

const getDeduplicatedFeatures = (journeys: Coordinates[]): Feature[] => {
  const features: Feature[] = [];

  journeys.forEach((journey) => {
    journey.sections.forEach((section) => {
      // Create a set to store the unique coordinates
      const uniqueCoordinates = new Set<string>();

      // Loop through the passes in the section
      section.passes.forEach((pass) => {
        // Convert the coordinates to a string
        const coordinatesStr = JSON.stringify([pass.stationCoordinateY, pass.stationCoordinateX]);

        // Add the coordinates to the set if they are not already present
        if (!uniqueCoordinates.has(coordinatesStr)) {
          uniqueCoordinates.add(coordinatesStr);
        }
      });

      // Create a Feature object for the section
      features.push({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [...uniqueCoordinates].map((coordinatesStr) => JSON.parse(coordinatesStr)),
        },
      });
    });
  });

  return features;
};

const getGeoData = (journeys: Coordinates[]) => ({
  type: 'FeatureCollection',
  features: getDeduplicatedFeatures(journeys),
});

export const Map: React.FC<{ id: string }> = ({ id }) => {
  const mapRef = useRef<MapRef>(null);

  const { data: stats } = trpc.journey.singleJourneyStats.useQuery(id, {
    onSuccess: (stats) => {
      const journeys = stats?.coordinates ?? [];

      if (journeys.length === 0) return;

      const geoData = getGeoData(journeys);

      const [minLng, minLat, maxLng, maxLat] = bbox(geoData);

      mapRef?.current?.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        { padding: 60, duration: 0 }
      );
    },
  });

  const journeys = stats?.coordinates ?? [];
  const geoData = getGeoData(journeys);

  return (
    <MapboxMap
      ref={mapRef}
      cooperativeGestures
      style={{ width: '100%', height: '100%', minHeight: 450, overflow: 'hidden' }}
      initialViewState={{
        latitude: 50.3769,
        longitude: 8.5417,
        zoom: 3,
      }}
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
