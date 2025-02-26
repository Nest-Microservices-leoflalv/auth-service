import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { LoginUserDto, RegisterUserDto } from './dto';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces';
import { envs } from 'src/config';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  readonly #logger = new Logger('AuthService');

  constructor(private readonly jwtService: JwtService) {
    super();
  }

  onModuleInit() {
    this.$connect();
    this.#logger.log('MongoDB connected');
  }

  async #signJWT(payload: JwtPayload) {
    return this.jwtService.sign(payload);
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
        token: await this.#signJWT(rest),
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
        token: await this.#signJWT(rest),
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async verifyToken(token: string) {
    try {
      const {
        sub: _sub,
        iat: _iat,
        exp: _exp,
        ...user
      } = this.jwtService.verify(token, {
        secret: envs.JWT_SECRET,
      });

      return {
        user,
        token: await this.#signJWT(user),
      };
    } catch (error) {
      this.#logger.error(error);
      throw new RpcException({
        status: 401,
        message: 'Invalid Token',
      });
    }
  }
}
