import { useTranslations } from 'next-intl';
import router from 'next/router';
import toast from 'react-hot-toast';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { DUPLICATE_JOURNEY } from '@/constants';
import { useJourneySearchStore } from '@/hooks/useJourneySearchStore';
import { trpc } from '@/utils/trpc';
import type { Journey } from '@/types/opendata';
import { Button } from '@/components/Button';

type Props = {
  journey: Journey;
  type?: 'primary' | 'secondary';
};

export const SaveJourneyButton: React.FC<Props> = ({ journey, type = 'secondary' }) => {
  const mutation = trpc.journey.add.useMutation({ retry: 1 });
  const utils = trpc.useContext();

  const clearSearchInfo = useJourneySearchStore((state) => state.clearSearchInfo);

  const t = useTranslations('add');

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // prevents toggle of detail view when saving
    e.stopPropagation();

    mutation.mutate(
      {
        departureStation: journey.from.station.name,
        arrivalStation: journey.to.station.name,
        departureTime: journey.from.departure,
        platform: journey.from.platform,
      },
      {
        onSuccess: () => {
          toast.success(t('journeyAdded'));

          // Redirect away after creating new journey
          router.push('/dashboard');
          clearSearchInfo();

          utils.invalidate();
        },
        onError: (error) => {
          if (error.message === DUPLICATE_JOURNEY) {
            toast.error(t('journeyAlreadyExists'));
            return;
          }
          toast.error(t('journeyAddFailed'));
        },
      }
    );
  };

  if (type === 'secondary') {
    return (
      <button
        onClick={handleClick}
        className="text-small justify-left inline-flex font-medium text-primary hover:text-primary-light"
      >
        {/* invisible means text remains hidden in the background to preserve the button width */}
        <span className={mutation.isLoading ? 'invisible' : undefined}>{t('save')}</span>
        {mutation.isLoading && <LoadingSpinner className="absolute" />}
      </button>
    );
  }

  return (
    <Button className="h-10 w-full justify-center" type="secondary" onClick={handleClick}>
      {mutation.isLoading ? <LoadingSpinner className="w-full" /> : <span>{t('saveJourney')}</span>}
    </Button>
  );
};
