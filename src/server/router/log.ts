import { z } from 'zod';

import { createRouter } from '@/server/router/context';
import { log } from '@/utils/logger';

export const logRouter = createRouter().mutation('signup', {
  input: z.string().email(),
  async resolve({ input }) {
    log({
      channel: 'signup',
      event: 'User signed up',
      description: `Email: ${input}`,
      icon: '🎉',
      tags: {
        email: input,
      },
      notify: true,
    });
  },
});
