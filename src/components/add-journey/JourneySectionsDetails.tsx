import { Disclosure, Transition } from '@headlessui/react';
import { RefreshIcon } from '@heroicons/react/outline';
import { useTranslations } from 'next-intl';

import { type Journey } from '@/types/opendata';
import { formatDateTime } from '@/utils/formatDateTime';
import { classNames } from '@/utils/styling';

type Props = {
  journey: Journey;
};

export const JourneySectionsDetails: React.FC<Props> = ({ journey }) => {
  const t = useTranslations('add');
  //journey = journey.sections.filter((section) => section.walk?.duration !== null);
  //console.log('journey1', journey1);
  console.log('journey', journey);
  return (
    <Transition
      enter="transition duration-100 ease-out"
      enterFrom="translate-y-[-10px] opacity-0"
      enterTo="translate-y-0 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="translate-y-0 opacity-100"
      leaveTo="translate-y-[-10px] opacity-0"
    >
      <Disclosure.Panel>
        <div className="flex flex-col p-5 pt-0 transition">
          <span className="mb-6 block w-full border-t border-gray-200" />
          {!!journey.sections.length &&
            journey.sections.map(
              (section, index) =>
                section.journey && (
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
                            <ul className="flex min-w-[40px] flex-[0_0_3.5em] [&_li]:mb-1 [&_p]:leading-none">
                              <li className="flex  flex-grow flex-col space-y-2">
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
                                'bullet relative z-[1] mx-14 after:absolute after:left-1/2 after:-ml-[.4em] after:h-3  after:w-3 after:rounded-full after:bg-primary',
                                index !== lastItemIndex
                                  ? 'min-h-[80px] before:absolute before:top-1 before:left-1/2 before:-ml-[.1em] before:h-full before:w-[.13em] before:border-l-[.13em] before:border-solid before:border-primary before:bg-primary'
                                  : '',
                                index !== 0 ? 'after:top-[15%]' : ''
                              )}
                            >
                              {/*TODO: add expand button for journey with a long pass list*/}
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
                        <div className="my-8 flex space-x-8 rounded bg-gray-100 py-3 px-6">
                          <RefreshIcon className="h-6 w-6 text-gray-600" />
                          <p className="text-sm text-gray-600">{t('trainChange')}</p>
                        </div>
                      )}
                    </>
                  </>
                )
            )}
        </div>
      </Disclosure.Panel>
    </Transition>
  );
};
