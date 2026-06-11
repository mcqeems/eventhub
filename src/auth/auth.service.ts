import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signIn(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    return user;
  }
}
