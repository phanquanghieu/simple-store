import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    'info',
    'warn',
    'error',
  ],
})

prisma.$on('query', async (query) => {
  console.info(query)
})
