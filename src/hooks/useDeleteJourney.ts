import { useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';

import { supabase } from '@/utils/supabaseClient';

const useDeleteJourney = (id?: number, onDelete?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      const { error } = await supabase.from('journeys').delete().match({ id: 77 });
      if (error) throw error;

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
      onError: () => {
        toast.error('Unable to delete journey');
      },
    }
  );
};

export default useDeleteJourney;
