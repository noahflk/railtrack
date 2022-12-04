import md5 from 'md5';

import type { JourneyIdentifier } from '@/types/journey';

export const hashJourneyIdentifier = ({
  departureStation,
  arrivalStation,
  departureTime,
  platform,
}: JourneyIdentifier) => {
  const identifier = `${departureStation}${arrivalStation}${departureTime}${platform}`;

  return md5(identifier);
};
