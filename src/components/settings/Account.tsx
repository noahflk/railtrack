import { useTranslation } from 'next-i18next';

export const Account: React.FC = () => {
  const { t } = useTranslation('settings');

  return (
    <section aria-labelledby="payment-details-heading">
      <form action="#" method="POST">
        <div className="max-w-3xl mx-auto shadow sm:rounded-md sm:overflow-hidden">
          <div className="px-4 py-6 space-y-4 bg-white sm:p-6">
            <div>
              <h2 id="payment-details-heading" className="text-lg font-medium leading-6 text-gray-900">
                {t('account')}
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  {t('email')}
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>

              <div className="col-span-4 sm:col-span-2">
                <label htmlFor="locale" className="block text-sm font-medium text-gray-700">
                  {t('language')}
                </label>
                <select
                  id="locale"
                  name="locale"
                  autoComplete="country-name"
                  className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                >
                  <option>English</option>
                  <option>Deutsch</option>
                </select>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 text-right bg-gray-50 sm:px-6">
            <button
              type="submit"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {t('save')}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};
