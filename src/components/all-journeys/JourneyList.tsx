import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import DeleteConfirmModal from '@/components/all-journeys/DeleteConfirmModal';
import useJourneys from '@/hooks/useJourneys';
import { supabase } from '@/utils/supabaseClient';
import JourneyRow from '@/components/all-journeys/JourneyRow';

const JourneyList: React.FC = () => {
  const { data: journeys } = useJourneys();
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingJourneyDeleteId, setPendingJourneyDeleteId] = useState<number | null>();
  const queryClient = useQueryClient();

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

  return (
    <>
      <DeleteConfirmModal isOpen={modalOpen} onDismiss={() => setModalOpen(false)} onConfirm={() => mutation.mutate()} />
      <div className="flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Departure
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Destination
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Distance
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Duration
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Stops
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {journeys.map((journey) => (
                    <JourneyRow journey={journey} key={journey.id} onDelete={handleDelete} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JourneyList;
