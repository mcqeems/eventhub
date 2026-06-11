import { Controller, Get, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { type Response } from 'express';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async main(@Res() res: Response) {
    const data = await this.usersService.findOne('mustaqim');
    return res.render(this.appService.getHello(), { message: data });
  }
}
