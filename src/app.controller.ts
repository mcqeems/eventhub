import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  home() {
    return {
      title: 'Home Page',
      user: 'John Doe',
    };
  }

  @Get('sign-in')
  @Render('index')
  signIn() {
    return {
      layout: 'layouts/auth',
      title: 'Standalone Page',
      user: 'Guest',
    };
  }

  @Get('sign-up')
  @Render('index')
  signUp() {
    return {
      layout: 'layouts/auth',
      title: 'Standalone Page',
      user: 'Guest',
    };
  }

  @Get('panel')
  @Render('index')
  panel() {
    return {
      layout: 'layouts/panel',
      title: 'Standalone Page',
      user: 'Guest',
    };
  }
}
