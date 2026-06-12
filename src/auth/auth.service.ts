import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { HashingService } from './hashing/hashing.service';
import { Response } from 'express';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { users } from '../generated/prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingService,
  ) {}

  async signIn(
    signInDto: SignInDto,
    response: Response,
  ): Promise<{
    status: number;
    message: string;
    data: { user: SignInDto; accessToken: string };
  }> {
    const user = await this.usersService.findOne(signInDto.username);

    if (!user) {
      throw new NotFoundException(
        `User with username ${signInDto.username} doesn't exist.`,
      );
    }

    const auth = await this.hashingService.comparePassword(
      signInDto.password,
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

  async signUp(signUpDto: SignUpDto): Promise<{
    status: number;
    message: string;
    data: { user: users };
  }> {
    if (signUpDto.secretKey !== process.env.SECRET_KEY) {
      throw new UnauthorizedException('Secret Key is incorrect.');
    }

    const hashPassword = await this.hashingService.hashPassword(
      signUpDto.password,
    );
    const user = await this.usersService.createOne(
      signUpDto.username,
      hashPassword,
    );

    if (!user || user === undefined) {
      throw new NotFoundException(
        "Database can't find the recent registered user.",
      );
    }

    return {
      status: 200,
      message: 'User successfully signed up.',
      data: {
        user,
      },
    };
  }

  async signOut(
    response: Response,
  ): Promise<{ status: number; message: string }> {
    response.clearCookie('access_token');

    return {
      status: 200,
      message: 'User successfully signed out.',
    };
  }
}
