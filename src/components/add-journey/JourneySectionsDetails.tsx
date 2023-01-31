import { Disclosure, Transition } from '@headlessui/react';
import { MinusSmIcon, PlusSmIcon, RefreshIcon } from '@heroicons/react/outline';
import { useTranslations } from 'next-intl';

import { type Pass, type Journey } from '@/types/opendata';
import { formatDateTime } from '@/utils/formatDateTime';
import { classNames } from '@/utils/styling';
import { type Dispatch, Fragment, type SetStateAction, useState } from 'react';
import md5 from 'md5';

type Props = {
  journey: Journey;
};

export const JourneySectionsDetails: React.FC<Props> = ({ journey }) => {
  const t = useTranslations('add');
  const nonNullJourneys = journey.sections.filter((section) => section.journey);

  return (
    <Transition
      enter="transition-[grid-template-rows] duration-200"
      enterFrom="grid-rows-[0fr]"
      enterTo="grid-rows-[1fr]"
      leave="transition-[grid-template-rows] duration-200"
      leaveFrom="grid-rows-[1fr]"
      leaveTo="grid-rows-[0fr]"
      className="grid min-h-0 overflow-hidden"
    >
      <Disclosure.Panel className="min-h-0">
        <div className="px-4 md:px-5">
          <hr className="mb-6 h-px w-full border-0 bg-gray-200" />
        </div>
        <div className="flex flex-col px-8 md:px-10 pb-6">
          {nonNullJourneys.map((section, index) => {
            const journeyId = md5(
              `${section.journey?.passList[0]?.departure}${section.journey?.passList[0]?.arrival}${section.journey?.passList[0]?.location.id}`
            );

            return (
              <Fragment key={index}>
                <div className="mb-8">
                  <p>
                    <span className="mr-2 inline-flex items-center rounded-full bg-primary px-2.5 py-1 text-sm font-medium text-white">
                      {journey.products[index]}
                    </span>
                    {t('direction')} {section.journey?.to}
                  </p>
                </div>
                <div
                  key={index}
                  className="flex min-h-[50px] flex-col  [&_div:first-child_.bullet]:mt-2 [&_div:last-child_.bullet]:border-l-0"
                >
                  <JourneySectionsPreview journeyId={journeyId} passList={section.journey?.passList} />
                </div>
                <>
                  {index !== nonNullJourneys.length - 1 && (
                    <div className="my-8 flex space-x-8 rounded bg-gray-100 py-3 px-6">
                      <RefreshIcon className="h-6 w-6 text-gray-600" />
                      <p className="text-sm text-gray-600">{t('trainChange')}</p>
                    </div>
                  )}
                </>
              </Fragment>
            );
          })}
        </div>
      </Disclosure.Panel>
    </Transition>
  );
};

type JourneySectionsPreviewProps = {
  journeyId: string;
  passList: Pass[] | undefined;
};

const JourneySectionsPreview = ({ passList, journeyId }: JourneySectionsPreviewProps) => {
  const [expandPasslist, setExpandPasslist] = useState('');
  const lastItemIndex = passList && passList.length - 1;

  return (
    <>
      {passList && passList?.length > 0 && expandPasslist
        ? passList?.map((pass, index) => {
            const firstOrLastItem = index === 0 || index === lastItemIndex;
            return (
              <JourneyPasslist
                key={index}
                pass={pass}
                journeyId={journeyId}
                extraProps={{ index, firstOrLastItem, lastItemIndex, passListLength: passList.length }}
                expandPasslist={{ state: expandPasslist, setState: setExpandPasslist }}
              />
            );
          })
        : [passList?.at(0), passList?.at(-1)].map((pass, index) => {
            const firstOrLastItem = index === 0 || index === 1;
            return (
              <JourneyPasslist
                key={index}
                pass={pass}
                journeyId={journeyId}
                extraProps={{ index, firstOrLastItem, lastItemIndex: 1, passListLength: passList?.length }}
                expandPasslist={{ state: expandPasslist, setState: setExpandPasslist }}
              />
            );
          })}
    </>
  );
};

type JourneyPasslistProps = {
  pass: Pass | undefined;
  journeyId: string;
  extraProps: {
    index: number;
    lastItemIndex: number | undefined;
    firstOrLastItem: boolean;
    passListLength: number | undefined;
  };
  expandPasslist: {
    state: string;
    setState: Dispatch<SetStateAction<string>>;
  };
};
const JourneyPasslist: React.FC<JourneyPasslistProps> = ({ pass, extraProps, expandPasslist, journeyId }) => {
  return (
    <div className="flex">
      <ul className="flex min-w-[40px] flex-[0_0_3.5em] [&_li]:mb-1 [&_p]:leading-none">
        <li className="flex  flex-grow flex-col space-y-2">
          {pass?.arrivalTimestamp && extraProps.index !== 0 && (
            <p
              className={classNames(
                extraProps.index === extraProps.lastItemIndex ? 'font-semibold' : '',
                !extraProps.firstOrLastItem ? 'text-gray-500' : ''
              )}
            >
              {formatDateTime(pass.arrivalTimestamp, 'HH:mm')}
            </p>
          )}
          {pass?.departureTimestamp && (
            <p className={classNames(extraProps.firstOrLastItem ? 'font-semibold' : '')}>
              {formatDateTime(pass.departureTimestamp, 'HH:mm')}
            </p>
          )}
        </li>
      </ul>
      <div
        className={classNames(
          'bullet relative z-[1] mx-14 after:absolute after:left-1/2 after:-ml-[.4em] after:h-3  after:w-3 after:rounded-full after:bg-primary',
          extraProps.index !== extraProps.lastItemIndex
            ? 'min-h-[90px] before:absolute before:top-1 before:left-1/2 before:-ml-[.1em] before:h-full before:w-[.13em] before:border-l-[.13em] before:border-solid before:border-primary before:bg-primary'
            : '',
          extraProps.index !== 0 ? 'after:top-[15%]' : ''
        )}
      >
        {/*TODO: add expand button for journey with a long pass list*/}
        {extraProps.passListLength! > 2 && extraProps.index === 0 && (
          <button
            className="absolute top-[47%] -ml-[.7em] rounded-[50%] border-[1px] border-black bg-white  hover:border-primary"
            onClick={() => {
              if (expandPasslist.state) {
                expandPasslist.setState('');
              } else {
                expandPasslist.setState(journeyId);
              }
            }}
          >
            {expandPasslist.state === journeyId ? (
              <MinusSmIcon className="h-5 w-5 text-black hover:text-primary" />
            ) : (
              <PlusSmIcon className="h-5 w-5 text-black hover:text-primary" />
            )}
          </button>
        )}
      </div>
      <ul>
        <li className="flex">
          <p className={classNames('mb-1 leading-none', extraProps.firstOrLastItem ? 'font-semibold' : 'font-normal')}>
            {pass?.station.name}
          </p>
        </li>
      </ul>
    </div>
  );
};
