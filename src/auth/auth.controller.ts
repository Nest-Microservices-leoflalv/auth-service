import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';

@Controller()
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @MessagePattern('auth.register.user')
  registerUser() {
    return 'registerUser';
  }

  @MessagePattern('auth.login.user')
  loginUser() {
    return `loginUser`;
  }

  @MessagePattern('auth.verify.user')
  verifyToken() {
    return `verifyToken`;
  }
}
