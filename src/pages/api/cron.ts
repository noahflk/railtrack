import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/server/db/client';
import { log } from '@/utils/logger';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Get all unprocessed users
      const unprocessedUsers = await prisma.profiles.findMany({
        where: { processedAt: null },
      });

      console.log('Found the following unprocessed users: ', unprocessedUsers);

      unprocessedUsers.forEach(async (user) => {
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

        console.log('Sent notification to user: ', user.email);

        // set processedAt time
        await prisma.profiles.update({
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

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
