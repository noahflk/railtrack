import { NextApiRequest, NextApiResponse } from 'next';

import { supabase } from '@/utils/supabaseClient';
import { Section } from '@/types/coordinates';
import { calculateJourneyDistance } from '@/utils/calculateDistances';
import { roundToOneDecimal } from '@/utils/rounding';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { journeyId } = req.query;

  // TODO find a way to fix this workaround
  // Without it the user session can somehow not be accessed by the subsequent queryt
  const { token } = await supabase.auth.api.getUserByCookie(req);
  supabase.auth.setAuth(token ?? '');

  // TODO: fix typing issue. It's currently impossible to call .eq when using <Section>
  const { data: sections } = await supabase
    .from<Section>('sections')
    .select(
      `
      passes (
        station_coordinate_x,
        station_coordinate_y,
        station_name
      )
      `
    )
    .eq('journey_id', journeyId);

  const distance = calculateJourneyDistance({ sections: sections ?? [] });

  const { data: departureStation } = await supabase
    .from('sections')
    .select('departure_station_name')
    .eq('journey_id', journeyId)
    .order('departure_time', { ascending: true })
    .limit(1)
    .single();

  const { data: arrivalStation } = await supabase
    .from('sections')
    .select('arrival_station_name')
    .eq('journey_id', journeyId)
    .order('departure_time', { ascending: false })
    .limit(1)
    .single();

  res.status(200).json({
    distance: roundToOneDecimal(distance),
    departureStation: departureStation?.departure_station_name,
    arrivalStation: arrivalStation?.arrival_station_name,
  });
};

export default handler;
