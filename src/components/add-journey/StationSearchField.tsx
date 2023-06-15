import { useState } from 'react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import { Combobox } from '@headlessui/react';

import { classNames } from '@/utils/styling';
import { useStationSearch } from '@/hooks/useStationSearch';
import type { Station } from '@/types/opendata';

type Props = {
  label: string;
  selectedStation?: Station;
  setSelectedStation: (station: Station) => void;
  secondaryElement?: React.ReactNode;
  className?: string;
};

export const StationSearchField: React.FC<Props> = ({
  label,
  selectedStation,
  setSelectedStation,
  secondaryElement,
  className,
}) => {
  const [query, setQuery] = useState('');
  const stations = useStationSearch(query);

  return (
    <Combobox className={className} as="div" value={selectedStation} onChange={setSelectedStation}>
      <div className="flex justify-between">
        <Combobox.Label className="block text-sm font-medium text-gray-700">{label}</Combobox.Label>
        {secondaryElement}
      </div>
      <div className="relative mt-1">
        <Combobox.Input
          className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(station: Station | undefined) => (station ? station.name : '')}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>

        {stations.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {stations.map((station) => (
              <Combobox.Option
                key={station.id}
                value={station}
                className={({ active }) =>
                  classNames(
                    'relative cursor-default select-none py-2 pl-3 pr-9',
                    active ? 'bg-primary text-white' : 'text-gray-900'
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span className={classNames('block truncate', selected ? 'font-semibold' : '')}>
                      {station.name}
                    </span>

                    {selected && (
                      <span
                        className={classNames(
                          'absolute inset-y-0 right-0 flex items-center pr-4',
                          active ? 'text-white' : 'text-primary'
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
};
