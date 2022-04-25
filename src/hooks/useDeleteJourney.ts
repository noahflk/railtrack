import { useMutation, useQueryClient } from 'react-query';

import { supabase } from '@/utils/supabaseClient';

const useDeleteJourney = (id?: number, onDelete?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      await supabase.from('journeys').delete().match({ id });
      queryClient.invalidateQueries();
    },
    {
      onSettled: () => {
        if (onDelete) {
          onDelete();
        }
        queryClient.invalidateQueries('all-journeys');
        queryClient.invalidateQueries('journey-stats');
        queryClient.invalidateQueries('recent-journeys');
      },
    }
  );
};

export default useDeleteJourney;
