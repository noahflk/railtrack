import { useState } from 'react';
import { useBreakpoint } from 'react-breakout';

import useJourneys from '@/hooks/useJourneys';
import EmptyJourneyNotice from '@/components/EmptyJourneyNotice';
import DeleteConfirmModal from '@/components/all-journeys/DeleteConfirmModal';
import JourneyTable from '@/components/all-journeys/JourneyTable';
import JourneyCards from '@/components/all-journeys/JourneyCards';
import useDeleteJourney from '@/hooks/useDeleteJourney';
import { sortJourneysLatestFirst } from '@/utils/sorters';
import { useRouter } from 'next/router';

const Placeholder: React.FC = () => (
  <div className="col-span-1 bg-white divide-y divide-gray-200 rounded-lg shadow">
    <div className="w-full p-6 space-y-4 animate-pulse ">
      <div className="h-8 bg-gray-300 rounded-md "></div>
      <div className="h-8 bg-gray-300 rounded-md "></div>
      <div className="h-8 bg-gray-300 rounded-md "></div>
    </div>
  </div>
);

const JourneyList: React.FC = () => {
  const router = useRouter();

  const page = parseInt(router.query.page as string) || 0;

  const { data: paginatedJourneys } = useJourneys(page);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingJourneyDeleteId, setPendingJourneyDeleteId] = useState<number>();
  const isDesktop = useBreakpoint('md');

  const deleteJourneyMutation = useDeleteJourney(pendingJourneyDeleteId, () => setModalOpen(false));

  const handleDeleteIntent = (journeyId: number) => {
    setModalOpen(true);
    setPendingJourneyDeleteId(journeyId);
  };

  if (!paginatedJourneys) return <Placeholder />;

  if (paginatedJourneys.journeys.length === 0)
    return (
      <div className="pt-12">
        <EmptyJourneyNotice />
      </div>
    );

  const sortedJourneys = sortJourneysLatestFirst(paginatedJourneys.journeys);

  return (
    <>
      <DeleteConfirmModal
        isOpen={modalOpen}
        onDismiss={() => setModalOpen(false)}
        onConfirm={() => deleteJourneyMutation.mutate()}
        isLoading={deleteJourneyMutation.isLoading}
      />
      {isDesktop ? (
        <JourneyTable journeys={{ ...paginatedJourneys, journeys: sortedJourneys }} handleDelete={handleDeleteIntent} />
      ) : (
        <JourneyCards journeys={sortedJourneys} handleDelete={handleDeleteIntent} />
      )}
    </>
  );
};

export default JourneyList;
