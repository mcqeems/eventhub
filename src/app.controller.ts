import { Controller, Get, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { type Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  main(@Res() res: Response) {
    return res.render(this.appService.getHello(), { message: 'Hello World' });
  }
}
