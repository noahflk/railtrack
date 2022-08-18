import { format } from 'date-fns';

import { useJourneySearchStore } from '@/hooks/useJourneySearchStore';
import { classNames } from '@/utils/styling';
import { useTranslations } from 'next-intl';

export const DepartureTimeField: React.FC = () => {
  const departureTime = useJourneySearchStore((state) => state.departureTime);
  const setDepartureTime = useJourneySearchStore((state) => state.setDepartureTime);

  const t = useTranslations('add');

  const showNowButton = departureTime !== format(new Date(), "yyyy-MM-dd'T'HH:mm");

  return (
    <div className="w-full ">
      <div className="flex justify-between">
        <label htmlFor="time" className="block text-sm font-medium text-gray-700">
          {t('time')}
        </label>
        <button
          disabled={!showNowButton}
          onClick={() => setDepartureTime(format(new Date(), "yyyy-MM-dd'T'HH:mm"))}
          className={classNames(
            'text-sm font-medium',
            showNowButton ? 'text-primary hover:text-primary-light' : 'text-gray-500'
          )}
        >
          {t('currentTime')}
        </button>
      </div>
      <div className="mt-1">
        <input
          value={departureTime}
          onChange={(event) => setDepartureTime(event.target.value)}
          id="time"
          name="time"
          type="datetime-local"
          required
          className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
      </div>
    </div>
  );
};
