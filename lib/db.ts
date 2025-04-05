import { PrismaClient } from '@prisma/client';

declare global {
    // eslint-disable-next-line no-var
   var prisma: PrismaClient | undefined;
}
// all this code iss to prevent recreating a new prisma client on every request and hot relooading in dev mode

const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;