import { format } from 'date-fns';
import router from 'next/router';
import { useMutation, useQueryClient } from 'react-query';

import { parseDurationString } from '@/utils/duration';
import { supabase } from '@/utils/supabaseClient';
import type { Connection } from '@/types/opendata';

type Props = {
  connection: Connection;
};

const JourneySearchResult: React.FC<Props> = ({ connection }) => {
  const queryClient = useQueryClient();

  const user = supabase.auth.user();

  const mutation = useMutation(async (connection: Connection) => {
    const { data: newJourney } = await supabase
      .from('journeys')
      .insert([
        {
          duration: parseDurationString(connection.duration),
          user_id: user?.id,
        },
      ])
      .single();

    if (!newJourney) return console.log('ERROR');

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
        queryClient.invalidateQueries('journey-stats');
        queryClient.invalidateQueries('recent-journeys');
      });
  });

  return (
    <li className="py-2">
      <p className="flex justify-between space-x-2">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-primary text-white">
          {connection.products[0]}
        </span>
        <div className="flex items-center space-x-2">
          <span>{format(new Date(connection.from.departureTimestamp * 1000), 'HH:mm')}</span>
          <img src="/images/rod.svg" alt="rod" className="text-white" />
          <span>{format(new Date(connection.to.arrivalTimestamp * 1000), 'HH:mm')}</span>
        </div>
        <span>
          {connection.transfers} {connection.transfers === 1 ? 'change' : 'changes'}, {parseDurationString(connection.duration)} mins
        </span>
        <button onClick={() => mutation.mutate(connection)} className="font-medium text-small text-primary hover:text-primary-light">
          Add
        </button>
      </p>
    </li>
  );
};

export default JourneySearchResult;
