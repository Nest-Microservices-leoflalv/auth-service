import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { LoginUserDto, RegisterUserDto } from './dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  readonly #logger = new Logger('AuthService');

  onModuleInit() {
    this.$connect();
    this.#logger.log('MongoDB connected');
  }

  async registerUser(regsiterUserDto: RegisterUserDto) {
    const { email, name, password } = regsiterUserDto;

    try {
      const user = await this.user.findFirst({
        where: {
          email,
        },
      });

      if (user) {
        throw new RpcException({
          status: 400,
          message: 'User already exist',
        });
      }

      const newUser = await this.user.create({
        data: {
          email,
          password: bcrypt.hashSync(password, 10),
          name,
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _password, ...rest } = newUser;

      return {
        user: rest,
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async loginUser(regsiterUserDto: LoginUserDto) {
    const { email, password } = regsiterUserDto;

    try {
      const user = await this.user.findFirst({
        where: {
          email,
        },
      });

      if (!user) {
        throw new RpcException({
          status: 400,
          message: 'User/Password not valid.',
        });
      }

      const isValidPassword = bcrypt.compareSync(password, user.password);

      if (!isValidPassword) {
        throw new RpcException({
          status: 400,
          message: 'User/Password not valid.',
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _password, ...rest } = user;

      return {
        user: rest,
        token: 'ABC',
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }
}
