import { useState } from 'react';
import { useBreakpoint } from 'react-breakout';
import toast from 'react-hot-toast';

import { EmptyJourneyNotice } from '@/components/EmptyJourneyNotice';
import { DeleteConfirmModal } from '@/components/journeys/DeleteConfirmModal';
import { JourneyTable } from '@/components/journeys/JourneyTable';
import { JourneyCards } from '@/components/journeys/JourneyCards';
import { trpc } from '@/utils/trpc';

const Placeholder: React.FC = () => (
  <div className="col-span-1 bg-white divide-y divide-gray-200 rounded-lg shadow">
    <div className="w-full p-6 space-y-4 animate-pulse ">
      <div className="h-8 bg-gray-300 rounded-md "></div>
      <div className="h-8 bg-gray-300 rounded-md "></div>
      <div className="h-8 bg-gray-300 rounded-md "></div>
    </div>
  </div>
);

export const JourneyList: React.FC = () => {
  // const router = useRouter();

  const utils = trpc.useContext();

  // const page = router.query.page ? parseInt(router.query.page as string) : undefined;

  const { data: journeys } = trpc.useQuery(['journey.get']);

  const [modalOpen, setModalOpen] = useState(false);
  const [pendingJourneyDeleteId, setPendingJourneyDeleteId] = useState<number>();

  const isDesktop = useBreakpoint('md');

  const deleteJourneyMutation = trpc.useMutation(['journey.delete'], {
    onSettled: () => {
      setModalOpen(false);

      utils.invalidateQueries(['journey.get']);
      utils.invalidateQueries(['journey.stats']);
    },
    onError: () => {
      toast.error('Unable to delete journey');
    },
  });

  const handleDeleteIntent = (journeyId: number) => {
    setModalOpen(true);
    setPendingJourneyDeleteId(journeyId);
  };

  if (!journeys) return <Placeholder />;

  if (journeys.length === 0)
    return (
      <div className="pt-12">
        <EmptyJourneyNotice />
      </div>
    );

  const sortedJourneys = journeys.sort((a, b) => b.departureTime.getTime() - a.departureTime.getTime());

  return (
    <>
      <DeleteConfirmModal
        isOpen={modalOpen}
        onDismiss={() => setModalOpen(false)}
        onConfirm={() => pendingJourneyDeleteId && deleteJourneyMutation.mutate(pendingJourneyDeleteId)}
        isLoading={deleteJourneyMutation.isLoading}
      />
      {isDesktop ? (
        <JourneyTable journeys={sortedJourneys} handleDelete={handleDeleteIntent} />
      ) : (
        <JourneyCards journeys={journeys} handleDelete={handleDeleteIntent} />
      )}
    </>
  );
};
