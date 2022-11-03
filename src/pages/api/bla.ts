import type { NextApiRequest, NextApiResponse } from 'next';

import { log } from '@/utils/logger';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const email = 'lalala@test.de';

      log({
        channel: 'signup',
        event: 'User signed up',
        description: `Email: ${email}`,
        icon: '🎉',
        tags: {
          email: email,
        },
        notify: true,
      });

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
