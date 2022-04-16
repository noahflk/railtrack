import MapboxMap, { Layer, Source } from "react-map-gl";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const Map = ({ journeys }) => {
  const getSectionCoordinates = (section) => {
    return section.passes.map((pass) => [pass.station_coordinate_y, pass.station_coordinate_x]);
  };

  const getFeatures = () => {
    const features = [];

    journeys.forEach((journey) => {
      journey.sections.forEach((section) => {
        features.push({
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: getSectionCoordinates(section),
          },
        });
      });
    });

    return features;
  };

  const dataOne = {
    type: "FeatureCollection",
    features: getFeatures(),
  };

  return (
    <MapboxMap
      initialViewState={{
        longitude: 8.224,
        latitude: 47,
        zoom: 6,
      }}
      cooperativeGestures
      style={{ width: "100%", height: 400, overflow: "hidden" }}
      mapStyle="mapbox://styles/mapbox/light-v10"
      mapboxAccessToken={MAPBOX_TOKEN}
    >
      <Source id="polylineLayer" type="geojson" data={dataOne}>
        <Layer
          id="lineLayer"
          type="line"
          source="my-data"
          layout={{
            "line-join": "round",
            "line-cap": "round",
          }}
          paint={{
            "line-color": "#902D41",
            "line-width": 3,
          }}
        />
      </Source>
    </MapboxMap>
  );
};

export default Map;
