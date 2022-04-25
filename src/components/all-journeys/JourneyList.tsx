import { useState } from 'react';
import { useBreakpoint } from 'react-breakout';

import useJourneys from '@/hooks/useJourneys';
import EmptyJourneyNotice from '@/components/EmptyJourneyNotice';
import DeleteConfirmModal from '@/components/all-journeys/DeleteConfirmModal';
import JourneyTable from '@/components/all-journeys/JourneyTable';
import JourneyCards from '@/components/all-journeys/JourneyCards';
import useDeleteJourney from '@/hooks/useDeleteJourney';

const JourneyList: React.FC = () => {
  const { data: journeys } = useJourneys();
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingJourneyDeleteId, setPendingJourneyDeleteId] = useState<number>();
  const isDesktop = useBreakpoint('md');

  const mutation = useDeleteJourney(pendingJourneyDeleteId, () => setModalOpen(false));

  if (!journeys) return <p>Loading...</p>;

  const handleDeleteIntent = (journeyId: number) => {
    setModalOpen(true);
    setPendingJourneyDeleteId(journeyId);
  };

  if (journeys.length === 0)
    return (
      <div className="pt-12">
        <EmptyJourneyNotice />
      </div>
    );

  return (
    <>
      <DeleteConfirmModal isOpen={modalOpen} onDismiss={() => setModalOpen(false)} onConfirm={() => mutation.mutate()} />
      {isDesktop ? (
        <JourneyTable journeys={journeys} handleDelete={handleDeleteIntent} />
      ) : (
        <JourneyCards journeys={journeys} handleDelete={handleDeleteIntent} />
      )}
    </>
  );
};

export default JourneyList;
