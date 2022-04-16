import { Journey, Section } from '@/types/coordinates';

const distance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  if (lat1 == lat2 && lon1 == lon2) return 0;

  const radlat1 = (Math.PI * lat1) / 180;
  const radlat2 = (Math.PI * lat2) / 180;
  const theta = lon1 - lon2;
  const radtheta = (Math.PI * theta) / 180;

  let distance = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

  if (distance > 1) {
    distance = 1;
  }

  distance = Math.acos(distance);
  distance = (distance * 180) / Math.PI;
  distance = distance * 60 * 1.1515;
  distance = distance * 1.609344;

  return distance;
};

export const calculateSectionDistance = ({ passes }: Section) => {
  if (!passes) return 0;
  let totalDistance = 0;
  let previousPoint;

  passes.forEach((pass) => {
    // don't do anything yet if there is no previous point
    if (previousPoint) {
      totalDistance += distance(previousPoint.x, previousPoint.y, pass.station_coordinate_x, pass.station_coordinate_y);
    }

    previousPoint = {
      x: pass.station_coordinate_x,
      y: pass.station_coordinate_y,
    };
  });

  return totalDistance;
};

export const calculateJourneyDistance = ({ sections }: Journey) => {
  if (sections.length === 0) return 0;

  return sections.reduce((partial, section) => {
    return partial + calculateSectionDistance(section);
  }, 0);
};
