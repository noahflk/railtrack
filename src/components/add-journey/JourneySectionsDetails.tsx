import { type Journey } from '@/types/opendata';
import { formatDateTime } from '@/utils/formatDateTime';
import { classNames } from '@/utils/styling';
import { Disclosure, Transition } from '@headlessui/react';
import { RefreshIcon } from '@heroicons/react/outline';

type Props = {
  journey: Journey;
};

export const JourneySectionsDetails: React.FC<Props> = ({ journey }) => {
  return (
    <Transition
      enter="transition duration-100 ease-out"
      enterFrom="transform -translate-y-1 opacity-0"
      enterTo="transform translate-y-0 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform translate-y-0 opacity-100"
      leaveTo="transform -translate-y-1 opacity-0"
    >
      <Disclosure.Panel>
        <div className="flex flex-col p-5 pt-0 transition">
          <span className="mb-6 block w-full border-t border-gray-200" />
          {!!journey.sections.length &&
            journey.sections.map((section, index) => (
              <>
                <div
                  key={index}
                  className="flex min-h-[50px] flex-col  [&_div:first-child_.bullet]:mt-2 [&_div:last-child_.bullet]:border-l-0"
                >
                  {section.journey?.passList.map((pass, index) => {
                    const lastItemIndex = section.journey && section.journey.passList.length - 1;
                    const firstOrLastItem = index === 0 || index === lastItemIndex;
                    return (
                      <div key={index} className="flex">
                        <ul className="min-w-[40px] [&_li]:mb-1 [&_p]:leading-none">
                          <li className="space-y-2">
                            {pass.arrivalTimestamp && index !== 0 && (
                              <p
                                className={classNames(
                                  index === lastItemIndex ? 'font-semibold' : '',
                                  !firstOrLastItem ? 'text-gray-500' : ''
                                )}
                              >
                                {formatDateTime(pass.arrivalTimestamp, 'HH:mm')}
                              </p>
                            )}
                            {pass.departureTimestamp && (
                              <p className={classNames(firstOrLastItem ? 'font-semibold' : '')}>
                                {formatDateTime(pass.departureTimestamp, 'HH:mm')}
                              </p>
                            )}
                          </li>
                        </ul>
                        <div
                          className={classNames(
                            'bullet relative z-[1] mx-14 after:absolute after:left-1/2 after:-ml-[.30rem] after:h-3  after:w-3 after:rounded-full after:bg-gray-800',
                            index !== lastItemIndex
                              ? 'min-h-[80px] before:absolute before:top-1 before:left-1/2 before:h-full before:w-[2px] before:border-[1px] before:border-gray-800 before:bg-gray-800'
                              : ''
                          )}
                        >
                          <div className="-left-[1rem] "></div>
                        </div>
                        <ul>
                          <li className="flex">
                            <p
                              className={classNames(
                                'mb-1 leading-none',
                                firstOrLastItem ? 'font-semibold' : 'font-normal'
                              )}
                            >
                              {pass.station.name}
                            </p>
                          </li>
                        </ul>
                      </div>
                    );
                  })}
                </div>
                <>
                  {index !== journey.sections.length - 1 && (
                    <div className="my-8 flex space-x-8 border-t-2 border-gray-200 bg-gray-100 py-3 px-6">
                      <RefreshIcon className="h-6 w-6 text-gray-600" />
                      <p className="text-sm text-gray-600">Train change</p>
                    </div>
                  )}
                </>
              </>
            ))}
        </div>
      </Disclosure.Panel>
    </Transition>
  );
};
