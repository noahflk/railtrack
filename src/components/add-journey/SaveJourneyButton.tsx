import { useTranslations } from 'next-intl';
import router from 'next/router';
import toast from 'react-hot-toast';

import { Button } from '@/components/Button';
import { DUPLICATE_JOURNEY } from '@/constants';
import { useJourneySearchStore } from '@/hooks/useJourneySearchStore';
import type { Journey } from '@/types/opendata';
import { trpc } from '@/utils/trpc';
import { LoadingSpinner } from '@/components/LoadingSpinner';

type Props = {
  journey: Journey;
  type?: 'primary' | 'secondary';
};

export const SaveJourneyButton: React.FC<Props> = ({ journey, type = 'secondary' }) => {
  const mutation = trpc.journey.add.useMutation({ retry: 1 });
  const utils = trpc.useContext();

  const clearSearchInfo = useJourneySearchStore((state) => state.clearSearchInfo);
  const viaStation = useJourneySearchStore((state) => state.viaStation);

  const t = useTranslations('add');

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // prevents toggle of detail view when saving
    e.stopPropagation();

    mutation.mutate(
      {
        departureStation: journey.from.station.name,
        arrivalStation: journey.to.station.name,
        viaStation: viaStation?.name,
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
      <Button type="text" onClick={handleClick} isLoading={mutation.isLoading}>
        {t('save')}
      </Button>
    );
  }

  return (
    <Button className="h-10 w-full justify-center" type="secondary" onClick={handleClick}>
      {mutation.isLoading ? <LoadingSpinner className="w-full" /> : <span>{t('saveJourney')}</span>}
    </Button>
  );
};
