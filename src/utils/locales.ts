import { GetServerSidePropsContext } from 'next/types';

import { getCookieLocale } from '@/utils/getLocale';

export const getLocaleProps = async (ctx: GetServerSidePropsContext) => {
  const locale = await getCookieLocale(ctx);

  return {
    props: { messages: (await import(`../locales/${locale}.json`)).default, locale },
  };
};
