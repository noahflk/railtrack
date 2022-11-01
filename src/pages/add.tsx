import type { NextPage } from 'next';
import { useTranslations } from 'next-intl';

import { JourneySearchForm } from '@/components/add-journey/JourneySearchForm';
import { JourneySearchResults } from '@/components/add-journey/JourneySearchResults';
import { Wrapper } from '@/components/Wrapper';
import { getLocaleProps } from '@/utils/locales';

const Add: NextPage = () => {
  const t = useTranslations();

  return (
    <Wrapper title={t('navigation.addJourney')}>
      <ul role="list" className="grid grid-cols-1 gap-6">
        <JourneySearchForm />
        <JourneySearchResults />
      </ul>
    </Wrapper>
  );
};

export const getServerSideProps = getLocaleProps;

export default Add;
