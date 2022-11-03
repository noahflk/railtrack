import type { NextApiRequest, NextApiResponse } from 'next';
import { verifySignature } from '@upstash/qstash/nextjs';
import { subMinutes } from 'date-fns';

import { prisma } from '@/server/db/client';
import { log } from '@/utils/logger';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // create date from 15 minutes ago with date-fns
      const fifteenMinutesAgo = subMinutes(new Date(), 15);

      // Get unprocessed users of the last 15 minutes
      const unprocessedUsers = await prisma.profiles.findMany({
        where: { createdAt: { gt: fifteenMinutesAgo }, processedAt: null },
      });

      unprocessedUsers.forEach((user) => {
        // send notification to user
        log({
          channel: 'signup',
          event: 'User signed up',
          description: `Email: ${user.email}`,
          icon: '🎉',
          tags: {
            email: user.email,
          },
          notify: true,
        });

        // set processedAt time
        prisma.profiles.update({
          where: { userId: user.userId },
          data: { processedAt: new Date() },
        });
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

export default verifySignature(handler);

export const config = {
  api: {
    bodyParser: false,
  },
};
