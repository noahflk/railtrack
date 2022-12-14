import { useState } from 'react';
import { useBreakpoint } from 'react-breakout';
import toast from 'react-hot-toast';
import { DeleteConfirmModal } from '@/components/journeys/DeleteConfirmModal';
import { JourneyTable } from '@/components/journeys/JourneyTable';
import { JourneyCards } from '@/components/journeys/JourneyCards';
import { trpc } from '@/utils/trpc';

export const JourneyList: React.FC = () => {
  const utils = trpc.useContext();

  const [modalOpen, setModalOpen] = useState(false);
  const [pendingJourneyDeleteId, setPendingJourneyDeleteId] = useState<number>();

  const isDesktop = useBreakpoint('md');

  const deleteJourneyMutation = trpc.journey.delete.useMutation({
    onSettled: () => {
      setModalOpen(false);

      utils.journey.get.invalidate();
      utils.journey.stats.invalidate();
    },
    onError: () => {
      toast.error('Unable to delete journey');
    },
  });

  const handleDeleteIntent = (journeyId: number) => {
    setModalOpen(true);
    setPendingJourneyDeleteId(journeyId);
  };


  return (
    <>
      <DeleteConfirmModal
        isOpen={modalOpen}
        onDismiss={() => setModalOpen(false)}
        onConfirm={() => pendingJourneyDeleteId && deleteJourneyMutation.mutate(pendingJourneyDeleteId)}
        isLoading={deleteJourneyMutation.isLoading}
      />
      {isDesktop ? (
        <JourneyTable handleDelete={handleDeleteIntent} />
      ) : (
        <JourneyCards handleDelete={handleDeleteIntent} />
      )}
    </>
  );
};
