import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { JwtService } from '@nestjs/jwt';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: JwtService,
          useValue: { verifyAsync: jest.fn() },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('routing', () => {
    it('should return view models', () => {
      const mockReq = { cookies: {} } as any;
      expect(appController.home(mockReq)).toEqual({ title: 'Home Page' });
      expect(appController.signIn()).toEqual({ layout: 'layouts/auth', title: 'Sign In' });
      expect(appController.signUp()).toEqual({ layout: 'layouts/auth', title: 'Sign Up' });
      expect(appController.publicEvents(mockReq)).toEqual({ title: 'Upcoming Events' });
      expect(appController.eventDetail(mockReq)).toEqual({ title: 'Event Details' });
      expect(appController.panel()).toEqual({ layout: 'layouts/panel', title: 'Admin Dashboard' });
      expect(appController.panelEvents()).toEqual({ layout: 'layouts/panel', title: 'Manage Events' });
      expect(appController.panelEventsCreate()).toEqual({ layout: 'layouts/panel', title: 'Create Event', isEdit: false });
      expect(appController.panelEventsEdit()).toEqual({ layout: 'layouts/panel', title: 'Edit Event', isEdit: true });
      expect(appController.panelEventsDetail()).toEqual({ layout: 'layouts/panel', title: 'Event Details' });
      expect(appController.panelParticipants()).toEqual({ layout: 'layouts/panel', title: 'Manage Participants' });
      expect(appController.panelParticipantsCreate()).toEqual({ layout: 'layouts/panel', title: 'Register Participant', isEdit: false });
      expect(appController.panelParticipantsEdit()).toEqual({ layout: 'layouts/panel', title: 'Edit Participant', isEdit: true });
      expect(appController.panelParticipantsDetail()).toEqual({ layout: 'layouts/panel', title: 'Participant Details' });
    });
  });
});
