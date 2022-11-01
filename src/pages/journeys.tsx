import { NextPage } from 'next';
import { useTranslations } from 'next-intl';

import { JourneyList } from '@/components/journeys/JourneyList';
import { Wrapper } from '@/components/Wrapper';
import { getLocaleProps } from '@/utils/locales';

const Journeys: NextPage = () => {
  const t = useTranslations();

  return (
    <Wrapper title={t('navigation.journeys')}>
      <JourneyList />
    </Wrapper>
  );
};

export const getServerSideProps = getLocaleProps;

export default Journeys;
