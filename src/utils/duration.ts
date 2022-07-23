export const parseDurationString = (duration: string): number => {
  let days = 0;
  let hours = 0;
  let minutes = 0;

  const daysMatch = duration.match(/^(?:[0-9]){2}(?=d)/);
  if (daysMatch && daysMatch[0]) {
    days = parseInt(daysMatch[0]);
  }

  const hoursMatch = duration.match(/(?<=d)(?:[0-9]){2}/);
  if (hoursMatch && hoursMatch[0]) {
    hours = parseInt(hoursMatch[0]);
  }

  const minutesMatch = duration.match(/(?<=:)(?:[0-9]){2}(?=:)/);
  if (minutesMatch && minutesMatch[0]) {
    minutes = parseInt(minutesMatch[0]);
  }

  return days * 24 * 60 + hours * 60 + minutes;
};
