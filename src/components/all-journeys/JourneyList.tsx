import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useBreakpoint } from 'react-breakout';

import useJourneys from '@/hooks/useJourneys';
import EmptyJourneyNotice from '@/components/EmptyJourneyNotice';
import DeleteConfirmModal from '@/components/all-journeys/DeleteConfirmModal';
import JourneyTable from '@/components/all-journeys/JourneyTable';
import JourneyCards from '@/components/all-journeys/JourneyCards';
import { supabase } from '@/utils/supabaseClient';

const JourneyList: React.FC = () => {
  const { data: journeys } = useJourneys();
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingJourneyDeleteId, setPendingJourneyDeleteId] = useState<number | null>();
  const queryClient = useQueryClient();
  const isDesktop = useBreakpoint('md');

  const mutation = useMutation(
    async () => {
      await supabase.from('journeys').delete().match({ id: pendingJourneyDeleteId });
      queryClient.invalidateQueries();
    },
    {
      onSettled: () => {
        setModalOpen(false);
        queryClient.invalidateQueries('all-journeys');
        queryClient.invalidateQueries('journey-stats');
        queryClient.invalidateQueries('recent-journeys');
      },
    }
  );

  if (!journeys) return <p>Loading...</p>;

  const handleDelete = (journeyId: number) => {
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
        <JourneyTable journeys={journeys} handleDelete={handleDelete} />
      ) : (
        <JourneyCards journeys={journeys} handleDelete={handleDelete} />
      )}
    </>
  );
};

export default JourneyList;
