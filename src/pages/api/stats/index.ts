import { NextApiRequest, NextApiResponse } from 'next';

import { supabase } from '@/utils/supabaseClient';
import { Journey } from '@/types/coordinates';
import { calculateJourneyDistance } from '@/utils/calculateDistances';
import { roundToOneDecimal } from '@/utils/rounding';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // const { journeyId } = req.query;

  // TODO find a way to fix this workaround
  // Without it the user session can somehow not be accessed by the subsequent queryt
  const { token } = await supabase.auth.api.getUserByCookie(req);
  supabase.auth.setAuth(token ?? '');

  const { data: journeys } = await supabase.from<Journey>('journeys').select(`
    sections (
      passes (
        station_coordinate_x,
        station_coordinate_y,
        station_name
      )
    )
  `);

  const distance = (journeys ?? []).reduce((partial, journey) => partial + calculateJourneyDistance(journey), 0);

  const { count: numberOfJourneys } = await supabase.from('journeys').select('*', { count: 'exact' });

  const { data: totalDurationInMinutes } = await supabase.rpc<number>('total_journeys_duration').single();
  const durationInHours = (totalDurationInMinutes ?? 0) / 60;

  res.status(200).json({
    distance: roundToOneDecimal(distance),
    count: numberOfJourneys ?? 0,
    coordinates: journeys ?? [],
    duration: roundToOneDecimal(durationInHours),
  });
};

export default handler;
