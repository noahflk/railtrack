import type { NextApiRequest, NextApiResponse } from 'next';

import axios from 'axios';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const config = {
        headers: { Authorization: `Bearer 1320610c9f08fb2745bad077541f8717` },
      };

      axios.post(
        'https://api.logsnag.com/v1/log',
        {
          project: 'railtrack',
          channel: 'test',
          event: 'From blabla',
          icon: '📩',
          notify: true,
        },
        config
      );

      res.status(200).json({ success: true });
    } catch {
      res.status(500).json({ statusCode: 500, message: 'Failed to process user' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}

export default handler;
