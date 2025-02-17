import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { LoginUserDto, RegisterUserDto } from './dto';

@Controller()
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @MessagePattern('auth.register.user')
  registerUser(@Payload() registerUserDto: RegisterUserDto) {
    return 'registerUser';
  }

  @MessagePattern('auth.login.user')
  loginUser(@Payload() loginUserDto: LoginUserDto) {
    return `loginUser`;
  }

  @MessagePattern('auth.verify.user')
  verifyToken() {
    return `verifyToken`;
  }
}
