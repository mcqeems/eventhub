import {
  Controller,
  Get,
  Render,
  Req,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { type Request } from 'express';
import { AuthGuard } from './auth/auth.guard';
import { AuthExceptionFilter } from './auth/auth-exception.filter';

@Controller()
@UseFilters(AuthExceptionFilter)
export class AppController {
  @Get()
  @Render('index')
  home(@Req() req: Request) {
    return {
      title: 'Home Page',
    };
  }

  @Get('sign-in')
  @Render('login')
  signIn() {
    return {
      layout: 'layouts/auth',
      title: 'Sign In',
    };
  }

  @Get('sign-up')
  @Render('register')
  signUp() {
    return {
      layout: 'layouts/auth',
      title: 'Sign Up',
    };
  }

  @Get('events')
  @Render('public-events')
  publicEvents(@Req() req: Request) {
    return {
      title: 'Upcoming Events',
    };
  }

  @Get('events/:id')
  @Render('event-detail')
  eventDetail(@Req() req: Request) {
    return {
      title: 'Event Details',
    };
  }

  @UseGuards(AuthGuard)
  @Get('panel')
  @Render('dashboard')
  panel() {
    return {
      layout: 'layouts/panel',
      title: 'Admin Dashboard',
    };
  }

  @UseGuards(AuthGuard)
  @Get('panel/events')
  @Render('events')
  panelEvents() {
    return {
      layout: 'layouts/panel',
      title: 'Manage Events',
    };
  }

  @UseGuards(AuthGuard)
  @Get('panel/events/create')
  @Render('events-form')
  panelEventsCreate() {
    return {
      layout: 'layouts/panel',
      title: 'Create Event',
      isEdit: false,
    };
  }

  @UseGuards(AuthGuard)
  @Get('panel/events/edit/:id')
  @Render('events-form')
  panelEventsEdit() {
    return {
      layout: 'layouts/panel',
      title: 'Edit Event',
      isEdit: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('panel/events/:id')
  @Render('events-detail-panel')
  panelEventsDetail() {
    return {
      layout: 'layouts/panel',
      title: 'Event Details',
    };
  }

  @UseGuards(AuthGuard)
  @Get('panel/participants')
  @Render('participants')
  panelParticipants() {
    return {
      layout: 'layouts/panel',
      title: 'Manage Participants',
    };
  }

  @UseGuards(AuthGuard)
  @Get('panel/participants/create')
  @Render('participants-form')
  panelParticipantsCreate() {
    return {
      layout: 'layouts/panel',
      title: 'Register Participant',
      isEdit: false,
    };
  }

  @UseGuards(AuthGuard)
  @Get('panel/participants/edit/:id')
  @Render('participants-form')
  panelParticipantsEdit() {
    return {
      layout: 'layouts/panel',
      title: 'Edit Participant',
      isEdit: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('panel/participants/:id')
  @Render('participants-detail-panel')
  panelParticipantsDetail() {
    return {
      layout: 'layouts/panel',
      title: 'Participant Details',
    };
  }
}
