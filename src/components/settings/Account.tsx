import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { setCookie } from 'cookies-next';
import toast from 'react-hot-toast';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { LANG_COOKIE_KEY } from '@/constants';
import { trpc } from '@/utils/trpc';

export const Account: React.FC = () => {
  const t = useTranslations('settings');
  const locale = useLocale();

  const { data: settings } = trpc.settings.get.useQuery();
  const mutation = trpc.settings.setLanguage.useMutation();

  const [selectedLang, setSelectedLang] = useState<string>();

  useEffect(() => {
    // if we have a language set, sync it to cookie
    if (settings?.language) {
      setCookie(LANG_COOKIE_KEY, settings.language, { sameSite: 'lax' });
    }
  }, [settings?.language]);

  useEffect(() => {
    // if we have a language, make it the selected choice
    if (settings?.language) {
      setSelectedLang(settings.language);
    }
    // if we don't have one set, use current locale as lang
    else {
      setSelectedLang(locale);
    }
  }, [settings?.language, locale]);

  const saveLocale = () => {
    if (!selectedLang) return;
    if (selectedLang !== 'en' && selectedLang !== 'de') return;

    mutation.mutate(selectedLang, {
      onSuccess: () => {
        setCookie(LANG_COOKIE_KEY, selectedLang, { sameSite: 'lax' });

        // this is a somewhat inelegant way to show the new translations
        window.location.reload();
      },
      onError: () => {
        toast.error(t('updateFail'));
      },
    });
  };

  return (
    <section aria-labelledby="account-heading">
      <div className="max-w-3xl mx-auto shadow sm:rounded-md sm:overflow-hidden">
        <div className="px-4 py-6 space-y-4 bg-white sm:p-6">
          <div>
            <h2 id="account-heading" className="text-lg font-medium leading-6 text-gray-900">
              {t('account')}
            </h2>
          </div>

          <div className="space-y-4">
            <div className="col-span-4 sm:col-span-2">
              <label htmlFor="locale" className="block text-sm font-medium text-gray-700">
                {t('language')}
              </label>
              <select
                id="locale"
                name="locale"
                value={selectedLang ?? locale}
                onChange={(e) => setSelectedLang(e.target.value)}
                defaultValue="default"
                autoComplete="country-name"
                className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
                <option value="en">English</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 text-right bg-white sm:px-6">
          <button
            type="submit"
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            onClick={saveLocale}
            disabled={mutation.isLoading}
          >
            {/* invisible means text remains hidden in the background to preserve the button width */}
            <span className={mutation.isLoading ? 'invisible' : undefined}>{t('save')}</span>
            {mutation.isLoading && <LoadingSpinner className="absolute" />}
          </button>
        </div>
      </div>
    </section>
  );
};
