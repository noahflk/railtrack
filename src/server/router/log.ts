import { z } from 'zod';

import { createRouter } from '@/server/router/context';
import { log } from '@/utils/logger';
import { differenceInSeconds } from 'date-fns';

const logSignup = (email: string) =>
  log({
    channel: 'signup',
    event: 'User signed up',
    description: `Email: ${email}`,
    icon: '🎉',
    tags: {
      email,
    },
    notify: true,
  });

export const logRouter = createRouter()
  .mutation('signup', {
    input: z.string().email(),
    async resolve({ input }) {
      logSignup(input);
    },
  })
  .mutation('potential-google-signup', {
    async resolve({ ctx }) {
      const { user } = ctx;

      if (!user || !user.email) return;

      const createdAtDate = new Date(user.created_at);

      // check if createdAtDate in the last 60 seconds
      if (differenceInSeconds(createdAtDate, new Date()) < 60) {
        logSignup(user.email);
      }
    },
  });
