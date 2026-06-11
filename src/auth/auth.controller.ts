import {
  Controller,
  Body,
  Post,
  HttpCode,
  HttpStatus,
  Res,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { type Response } from 'express';
import { ZodPipe } from 'src/zod/zod.pipe';
import { type SignInDto, signInSchema } from './dto/sign-in.dto';
import { type SignUpDto, signUpSchema } from './dto/sign-up.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodPipe(signInSchema))
  @Post('sign-in')
  signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signIn(signInDto.username, signInDto.password, res);
  }

  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodPipe(signUpSchema))
  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(
      signUpDto.username,
      signUpDto.password,
      signUpDto.secretKey,
    );
  }
}
