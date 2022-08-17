import { createI18n } from 'noahflk-pub-test';

import type Locale from './en';

export const { useI18n, I18nProvider, getLocaleStaticProps } = createI18n<typeof Locale>({
  en: () => import('./en'),
  de: () => import('./de'),
});
