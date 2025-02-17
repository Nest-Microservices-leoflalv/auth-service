import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  readonly #logger = new Logger('AuthService');

  onModuleInit() {
    this.$connect();
    this.#logger.log('MongoDB connected');
  }
}
