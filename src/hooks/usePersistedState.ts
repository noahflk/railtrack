import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';

type PersistedState<T> = [T, Dispatch<SetStateAction<T>>];

export const usePersistedState = <T extends string>(defaultValue: T, key: string): PersistedState<T> => {
  const [value, setValue] = useState<T>(() => {
    // initialize state from local storage or default to 'week'
    if (typeof window !== 'undefined') {
      const storedPeriod = window.localStorage.getItem(key);
      return storedPeriod ? (storedPeriod as T) : defaultValue;
    }

    return defaultValue;
  });

  useEffect(() => {
    // update local storage whenever period state changes
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, value);
    }
  }, [key, value]);

  return [value, setValue];
};
