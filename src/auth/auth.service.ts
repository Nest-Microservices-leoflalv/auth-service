import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  registerUser(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  loginUser() {
    return `This action returns all auth`;
  }

  verifyToken() {
    return `This action returns a # auth`;
  }
}
