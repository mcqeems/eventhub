import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { HashingService } from './hashing/hashing.service';
import { users } from '../generated/prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingService,
  ) {}

  async signIn(
    username: string,
    password: string,
  ): Promise<{ user: users; accessToken: string }> {
    const user = await this.usersService.findOne(username);

    if (!user) {
      throw new UnauthorizedException();
    }

    const auth = await this.hashingService.comparePassword(
      password,
      user.password,
    );

    if (!auth) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.username };
    return {
      user,
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(
    username: string,
    password: string,
    secretKey: string,
  ): Promise<{ user: users; accessToken: string }> {
    if (secretKey !== process.env.SECRET_KEY) {
      throw new UnauthorizedException();
    }

    const hashPassword = await this.hashingService.hashPassword(password);
    const user = await this.usersService.createOne(username, hashPassword);

    if (!user || user === undefined) {
      throw new InternalServerErrorException();
    }

    const autoSignIn = await this.signIn(username, password);
    return autoSignIn;
  }
}
