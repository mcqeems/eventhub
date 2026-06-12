import {
  Controller,
  Body,
  Post,
  Res,
  UsePipes,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { type Response } from 'express';
import { ZodPipe } from 'src/zod/zod.pipe';
import { type SignInDto, signInSchema } from './dto/sign-in.dto';
import { type SignUpDto, signUpSchema } from './dto/sign-up.dto';
import { AuthGuard } from './auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  signIn(
    @Body(new ZodPipe(signInSchema)) signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signIn(signInDto, res);
  }

  @Post('sign-up')
  signUp(@Body(new ZodPipe(signUpSchema)) signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @UseGuards(AuthGuard)
  @Get('sign-out')
  signOut(@Res({ passthrough: true }) res: Response) {
    return this.authService.signOut(res);
  }
}
