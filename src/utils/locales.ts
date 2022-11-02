import { GetServerSidePropsContext } from 'next/types';

import { getLocale } from '@/utils/getLocale';

export const getLocaleProps = async (ctx: GetServerSidePropsContext) => {
  const locale = await getLocale(ctx);

  return {
    props: { messages: (await import(`../locales/${locale}.json`)).default, locale },
  };
};
