import { formatDuration, intervalToDuration } from 'date-fns';

export const parseDurationString = (duration: string): number => {
  let days = 0;
  let hours = 0;
  let minutes = 0;

  const splitDuration = duration.split(':');

  if (splitDuration[0]) {
    const [daysString, hoursString] = splitDuration[0].split('d');

    if (daysString) {
      days = parseInt(daysString);
    }

    if (hoursString) {
      hours = parseInt(hoursString);
    }
  }

  if (splitDuration[1]) {
    minutes = parseInt(splitDuration[1]);
  }

  return days * 24 * 60 + hours * 60 + minutes;
};

export const formatMinuteDuration = (minutes: number) => {
  const duration = intervalToDuration({ start: 0, end: minutes * 1000 * 60 });

  return formatDuration(duration)
    .replace('minutes', 'min')
    .replace('minute', 'min')
    .replace('hours', 'h')
    .replace('hour', 'h');
};
