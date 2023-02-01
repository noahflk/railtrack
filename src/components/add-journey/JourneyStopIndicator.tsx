import { Fragment } from 'react';
import { formatInTimeZone } from 'date-fns-tz';

import type { Journey, Section } from '@/types/opendata';
import { classNames } from '@/utils/styling';
import { APP_TIMEZONE } from '@/constants';

type Props = {
  journey: Journey;
  className?: string;
};

export const JourneyStopIndicator: React.FC<Props> = ({ journey, className = '' }) => {
  const getSectionDuration = (section: Section): number => {
    const { departureTimestamp } = section.departure;
    const { arrivalTimestamp } = section.arrival;

    return arrivalTimestamp - departureTimestamp;
  };

  // remove walks and so on
  const filteredSections = journey.sections.filter((section) => section.journey);

  const journeyDurationInSeconds = filteredSections.reduce((acc, section) => getSectionDuration(section) + acc, 0);

  // returns the closest numerator for the denominator 12
  const closestTwelfethForSectionDuration = filteredSections.map((section) => {
    const proportionOfWholeJourney = getSectionDuration(section) / journeyDurationInSeconds;

    // get the closest twelfeth for the proportion of the whole journey
    // return Math.round(proportionOfWholeJourney * 12);
    return Math.round(proportionOfWholeJourney * 100);
  });

  return (
    <div className={classNames('flex items-center justify-between space-x-4', className)}>
      <span>{formatInTimeZone(new Date(journey.from.departureTimestamp * 1000), APP_TIMEZONE, 'HH:mm')}</span>

      <ol className="flex w-full items-center px-1">
        {closestTwelfethForSectionDuration.map((numerator, index) => (
          // const width = numerator === 12 ? 'w-full' : `w-${numerator}/12`;

          <Fragment key={index}>
            <li className="relative -mx-1 h-4 w-4 rounded-full bg-primary"></li>
            <li style={{ width: numerator + '%' }} className={`h-1 rounded-full bg-primary`}></li>
          </Fragment>
        ))}
        <li className="relative -mx-1 h-4 w-4 rounded-full bg-primary"></li>
      </ol>
      <span>{formatInTimeZone(new Date(journey.to.arrivalTimestamp * 1000), APP_TIMEZONE, 'HH:mm')}</span>
    </div>
  );
};
