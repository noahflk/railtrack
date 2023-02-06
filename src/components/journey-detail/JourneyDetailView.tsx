import { ArrowNarrowLeftIcon } from '@heroicons/react/solid';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { useState } from 'react';

import { Button } from '@/components/Button';
import { Link } from '@/components/Link';
import { StatsDisplay } from '@/components/StatsDisplay';
import { trpc } from '@/utils/trpc';
import { DeleteConfirmModal } from '@/components/journeys/DeleteConfirmModal';

export const JourneyDetailView: React.FC = () => {
  const router = useRouter();
  const utils = trpc.useContext();

  const [modalOpen, setModalOpen] = useState(false);
  const [pendingJourneyDeleteId, setPendingJourneyDeleteId] = useState<string>();

  const t = useTranslations();

  const journeyId = typeof router.query.journey === 'string' ? router.query.journey : undefined;

  const { data: journey } = trpc.journey.getOne.useQuery(journeyId ?? '');
  const { data: stats } = trpc.journey.singleJourneyStats.useQuery(journeyId ?? '');

  const handleDeleteIntent = () => {
    // we only go forward with the delete if we have a valid journeyId
    if (!journeyId) {
      toast.error(t('journeys.deleteJourneyError'));
      return;
    }

    setModalOpen(true);
    setPendingJourneyDeleteId(journeyId);
  };

  const deleteJourneyMutation = trpc.journey.delete.useMutation({
    onSettled: () => {
      setModalOpen(false);
      router.push('/dashboard');

      utils.invalidate();
    },
    onError: () => {
      toast.error(t('journeys.deleteJourneyError'));
    },
  });

  return (
    <>
      <DeleteConfirmModal
        isOpen={modalOpen}
        onDismiss={() => setModalOpen(false)}
        onConfirm={() => pendingJourneyDeleteId && journey && deleteJourneyMutation.mutate(journey.id)}
        isLoading={deleteJourneyMutation.isLoading}
      />
      <div className="flex w-full items-center justify-between">
        <div>
          <Link href="/journeys" className="flex gap-1">
            <ArrowNarrowLeftIcon className="w-5" />
            {t('dashboard.seeAll')}
          </Link>
          <h2 className="mb-6 mt-2 text-xl font-medium text-gray-900">
            {journey ? `${journey.departureStation} - ${journey.arrivalStation}` : '...'}
          </h2>
        </div>
        <Button onClick={handleDeleteIntent} type="secondary">
          {t('journeys.delete')}
        </Button>
      </div>
      <StatsDisplay type="journeyDetail" stats={stats} />
    </>
  );
};
