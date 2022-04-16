import { definitions } from '@/types/supabase';
import { supabase } from '@/utils/supabaseClient';
import { useQuery } from 'react-query';

const getRecentJourneys = async () => {
  const { data } = await supabase
    .from<definitions['journeys']>('journeys')
    .select('*')
    .order('created_at', { ascending: false })
    .range(0, 7);

  return data ?? [];
};

const useRecentJourneys = () => {
  return useQuery('recent-journeys', getRecentJourneys);
};

export default useRecentJourneys;
