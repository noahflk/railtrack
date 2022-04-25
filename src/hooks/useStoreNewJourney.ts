import router from 'next/router';
import { useMutation, useQueryClient } from 'react-query';

import useJourneySearchStore from '@/hooks/useJourneySearchStore';
import { parseDurationString } from '@/utils/duration';
import { supabase } from '@/utils/supabaseClient';
import type { Connection } from '@/types/opendata';

const useStoreNewJourney = () => {
  const queryClient = useQueryClient();

  const clearSearchInfo = useJourneySearchStore((state) => state.clearSearchInfo);

  const user = supabase.auth.user();

  return useMutation(async (connection: Connection) => {
    const { data: newJourney } = await supabase
      .from('journeys')
      .insert([
        {
          duration: parseDurationString(connection.duration),
          user_id: user?.id,
        },
      ])
      .single();

    if (!newJourney) return console.log('Unable to create a new journey');

    // We only want rides, the rest should be ignored
    connection.sections
      .filter((section) => section.journey)
      .forEach(async (section) => {
        const { data: sectionData } = await supabase.from('sections').insert([
          {
            departure_time: section.departure.departure,
            arrival_time: section.arrival.arrival,
            departure_station_name: section.departure.station.name,
            departure_station_coordinate_x: section.departure.station.coordinate.x,
            departure_station_coordinate_y: section.departure.station.coordinate.y,
            arrival_station_name: section.arrival.station.name,
            arrival_station_coordinate_x: section.arrival.station.coordinate.x,
            arrival_station_coordinate_y: section.arrival.station.coordinate.y,
            journey_id: newJourney.id,
            train_destination: section.journey.to,
            train_operator: section.journey.operator,
            train_number: section.journey.number,
            train_category: section.journey.category,
          },
        ]);

        const passes = section.journey.passList.map((pass) => {
          return {
            section_id: sectionData ? sectionData[0].id : null,
            arrival_time: pass.arrival,
            departure_time: pass.departure,
            station_name: pass.station.name,
            station_coordinate_x: pass.station.coordinate.x,
            station_coordinate_y: pass.station.coordinate.y,
          };
        });

        await supabase.from('passes').insert(passes);

        // Redirect away after creating new journey
        router.push('/dashboard');
        clearSearchInfo();
        queryClient.invalidateQueries('journey-stats');
        queryClient.invalidateQueries('recent-journeys');
      });
  });
};

export default useStoreNewJourney;
