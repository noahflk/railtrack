import { verifySignature } from '@upstash/qstash/nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/server/db/client';
import { insight, log } from '@/utils/logger';

// we only send on request at a time because Vercel lambda functions had trouble
// processing multiple requests at the same thime

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const userCount = await prisma.profiles.count();

      await insight({
        title: 'Registered users',
        value: userCount,
        icon: '👤',
      });

      console.log('Updated insight for total registered users to: ' + userCount);

      const journeyCount = await prisma.journey.count();

      await insight({
        title: 'Total journeys',
        value: journeyCount,
        icon: '🚉',
      });

      console.log('Updated insight for total journeys to: ' + journeyCount);

      // Get the first unprocessed user
      const user = await prisma.profiles.findFirst({
        where: { processedAt: null },
      });

      if (!user) {
        return res.status(204).json({ success: true, message: 'No new users' });
      }

      console.log('Found the following unprocessed user: ', user);

      await log({
        channel: 'signup',
        event: 'User signed up',
        icon: '🎉',
        description: user.email,
        tags: {
          email: user.email,
        },
        notify: true,
      });

      console.log('Sent signup notification for user: ' + user.email);

      // set processedAt time
      await prisma.profiles.update({
        where: { userId: user.userId },
        data: { processedAt: new Date() },
      });

      console.log('Set processedAt time for user: ' + user.email);

      res.status(200).json({ success: true });
    } catch {
      res.status(500).json({ statusCode: 500, message: 'Failed to process user' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}

export default verifySignature(handler);

export const config = {
  api: {
    bodyParser: false,
  },
};
