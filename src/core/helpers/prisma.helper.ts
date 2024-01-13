import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaHelper extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      errorFormat: 'pretty',
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('success');
    } catch (error) {
      console.log(error);
    }
  }
}
