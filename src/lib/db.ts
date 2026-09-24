import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// SQLite database URL fallback for serverless environments (e.g. Vercel)
if (process.env.VERCEL && !process.env.DATABASE_URL?.includes('/tmp')) {
  process.env.DATABASE_URL = 'file:/tmp/dev.db';
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
