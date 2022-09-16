import { Fragment } from 'react';
import { format } from 'date-fns';

import type { Journey, Section } from '@/types/opendata';
import { classNames } from '@/utils/styling';

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

  const journeyDurationInSeconds = journey.sections.reduce((acc, section) => getSectionDuration(section) + acc, 0);

  // returns the closest numerator for the denominator 12
  const closestTwelfethForSectionDuration = journey.sections.map((section) => {
    const proportionOfWholeJourney = getSectionDuration(section) / journeyDurationInSeconds;

    // get the closest twelfeth for the proportion of the whole journey
    // return Math.round(proportionOfWholeJourney * 12);
    return Math.round(proportionOfWholeJourney * 100);
  });

  return (
    <div className={classNames('flex items-center justify-between space-x-4', className)}>
      <span>{format(new Date(journey.from.departureTimestamp * 1000), 'HH:mm')}</span>

      <ol className="flex items-center w-full px-1">
        {closestTwelfethForSectionDuration.map((numerator, index) => {
          // const width = numerator === 12 ? 'w-full' : `w-${numerator}/12`;

          return (
            <Fragment key={index}>
              <li className="relative w-4 h-4 -mx-1 rounded-full bg-primary"></li>
              <li style={{ width: numerator + '%' }} className={`h-1 rounded-full bg-primary`}></li>
            </Fragment>
          );
        })}
        <li className="relative w-4 h-4 -mx-1 rounded-full bg-primary"></li>
      </ol>
      <span>{format(new Date(journey.to.arrivalTimestamp * 1000), 'HH:mm')}</span>
    </div>
  );
};
