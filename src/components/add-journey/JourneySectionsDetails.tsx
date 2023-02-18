import { Disclosure, Transition } from '@headlessui/react';
import { MinusSmIcon, PlusSmIcon, RefreshIcon } from '@heroicons/react/outline';
import { useTranslations } from 'next-intl';
import { Fragment, useState, type Dispatch, type SetStateAction } from 'react';

import { SaveJourneyButton } from '@/components/add-journey/SaveJourneyButton';
import { type Journey, type Pass } from '@/types/opendata';
import { formatDateTime } from '@/utils/formatDateTime';
import { classNames } from '@/utils/styling';

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
        <div className="flex flex-col px-8 pb-6 md:px-10">
          {nonNullJourneys.map((section, index) => (
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
                <JourneySectionsPreview passList={section.journey?.passList} />
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
          ))}
          <div className="w-full pt-4">
            <SaveJourneyButton type="primary" journey={journey} />
          </div>
        </div>
      </Disclosure.Panel>
    </Transition>
  );
};

type JourneySectionsPreviewProps = {
  passList: Pass[] | undefined;
};

const JourneySectionsPreview: React.FC<JourneySectionsPreviewProps> = ({ passList }) => {
  const [expandPasslist, setExpandPasslist] = useState(false);

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
                passListLength={passList.length}
                index={index}
                lastItemIndex={lastItemIndex}
                firstOrLastItem={firstOrLastItem}
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
                passListLength={passList?.length ?? 0}
                index={index}
                lastItemIndex={1}
                firstOrLastItem={firstOrLastItem}
                expandPasslist={{ state: expandPasslist, setState: setExpandPasslist }}
              />
            );
          })}
    </>
  );
};

type JourneyPasslistProps = {
  pass: Pass | undefined;
  passListLength: number;
  index: number;
  lastItemIndex: number | undefined;
  firstOrLastItem: boolean;
  expandPasslist: {
    state: boolean;
    setState: Dispatch<SetStateAction<boolean>>;
  };
};

const JourneyPasslist: React.FC<JourneyPasslistProps> = ({
  pass,
  index,
  expandPasslist,
  passListLength,
  lastItemIndex,
  firstOrLastItem,
}) => (
  <div className="flex">
    <ul className="flex min-w-[40px] flex-[0_0_3.5em] [&_li]:mb-1 [&_p]:leading-none">
      <li className="flex  flex-grow flex-col space-y-2">
        {pass?.arrivalTimestamp && index !== 0 && (
          <p
            className={classNames(
              index === lastItemIndex ? 'font-semibold' : '',
              !firstOrLastItem ? 'text-gray-500' : ''
            )}
          >
            {formatDateTime(pass.arrivalTimestamp, 'HH:mm')}
          </p>
        )}
        {pass?.departureTimestamp && (
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
          ? 'min-h-[90px] before:absolute before:top-1 before:left-1/2 before:-ml-[.1em] before:h-full before:w-[.13em] before:border-l-[.13em] before:border-solid before:border-primary before:bg-primary'
          : '',
        index !== 0 ? 'after:top-[15%]' : ''
      )}
    >
      {passListLength > 2 && index === 0 && (
        <button
          className="absolute top-[47%] -ml-[.75em] rounded-full border border-primary bg-white  hover:border-primary-light"
          onClick={() => expandPasslist.setState((state) => !state)}
        >
          {expandPasslist.state ? (
            <MinusSmIcon className="h-5 w-5 text-primary hover:text-primary-light" />
          ) : (
            <PlusSmIcon className="h-5 w-5 text-primary hover:text-primary-light" />
          )}
        </button>
      )}
    </div>
    <ul>
      <li className="flex">
        <p className={classNames('mb-1 leading-none', firstOrLastItem ? 'font-semibold' : 'font-normal')}>
          {pass?.station.name}
        </p>
      </li>
    </ul>
  </div>
);
