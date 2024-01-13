import { Global, Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaRepository } from './prisma/prisma.repository';
import { PrismaHelper } from '@/core/helpers/prisma.helper';

@Global()
@Module({
  imports: [],
  providers: [
    PrismaClient,
    PrismaHelper,
    {
      provide: 'Order',
      useFactory: (prisma: PrismaClient) => {
        return new PrismaRepository(prisma, 'Order');
      },
      inject: [PrismaClient],
    },
    {
      provide: 'Item',
      useFactory: (prisma: PrismaClient) => {
        return new PrismaRepository(prisma, 'Item');
      },
      inject: [PrismaClient],
    },
  ],
  exports: [
    PrismaClient,
    PrismaHelper,
    {
      provide: 'Order',
      useFactory: (prisma: PrismaClient) => {
        return new PrismaRepository(prisma, 'order');
      },
      inject: [PrismaClient],
    },
    {
      provide: 'Item',
      useFactory: (prisma: PrismaClient) => {
        return new PrismaRepository(prisma, 'item');
      },
      inject: [PrismaClient],
    },
  ],
})
export class RepositoryModule {}
