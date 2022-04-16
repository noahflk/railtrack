import { NextApiRequest, NextApiResponse } from "next";

import { supabase } from "@/utils/supabaseClient";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  supabase.auth.api.setAuthCookie(req, res);
};

export default handler;
