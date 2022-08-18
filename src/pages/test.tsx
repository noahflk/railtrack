import { GetServerSideProps, NextPage } from 'next';

import { protectedRouteWithLocales } from '@/utils/protectedLocales';
import { useTranslations } from 'next-intl';

const Test: NextPage = () => {
  const t = useTranslations();

  return <h1>Just testing {t('hi')}</h1>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return protectedRouteWithLocales(ctx);
};

export default Test;
