import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined; // eslint-disable-line no-var
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['info', 'warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
