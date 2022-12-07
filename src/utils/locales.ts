import type { Context } from '@/types/context';
import { getLocale } from '@/utils/getLocale';

export const getLocaleProps = async (ctx: Context) => {
  const locale = await getLocale(ctx);

  return {
    props: { messages: (await import(`../locales/${locale}.json`)).default, locale },
  };
};
