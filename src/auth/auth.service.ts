import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { HashingService } from './hashing/hashing.service';
import { users } from '../generated/prisma/client';
import { Response } from 'express';

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
    response: Response,
  ): Promise<{
    status: number;
    message: string;
    data: { user: users; accessToken: string };
  }> {
    const user = await this.usersService.findOne(username);

    if (!user) {
      throw new NotFoundException(
        `User with username ${username} doesn't exist.`,
      );
    }

    const auth = await this.hashingService.comparePassword(
      password,
      user.password,
    );

    if (!auth) {
      throw new UnauthorizedException(`Failed to authenticate.`);
    }

    const payload = { sub: user.id, username: user.username };
    const accessToken = await this.jwtService.signAsync(payload);

    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.MODE === 'production',
      sameSite: 'strict',
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    return {
      status: 200,
      message: 'User successfully signed in.',
      data: {
        user,
        accessToken,
      },
    };
  }

  async signUp(
    username: string,
    password: string,
    secretKey: string,
  ): Promise<{
    status: number;
    message: string;
    data: { user: users };
  }> {
    if (secretKey !== process.env.SECRET_KEY) {
      throw new UnauthorizedException();
    }

    const hashPassword = await this.hashingService.hashPassword(password);
    const user = await this.usersService.createOne(username, hashPassword);

    if (!user || user === undefined) {
      throw new InternalServerErrorException();
    }

    return {
      status: 200,
      message: 'User successfully signed up.',
      data: {
        user,
      },
    };
  }
}
