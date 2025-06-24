// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // Avoid multiple instances of Prisma Client in development
  // @ts-ignore
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
