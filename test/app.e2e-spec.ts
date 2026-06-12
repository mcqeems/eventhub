import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'node:path';
import cookieParser from 'cookie-parser';
import hbs from 'hbs';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('AppController (e2e)', () => {
  let app: NestExpressApplication;
  let prisma: PrismaService;
  let authCookie: string;
  let createdEventId: number;
  let createdParticipantId: number;
  const TEST_PREFIX = 'E2E_TEST_';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestExpressApplication>();

    app.useStaticAssets(join(__dirname, '..', 'public'));
    app.setBaseViewsDir(join(__dirname, '..', 'views'));
    app.setViewEngine('hbs');
    hbs.registerPartials(join(__dirname, '..', 'views', 'layouts'));
    app.setLocal('layout', 'layouts/main');
    app.use(cookieParser());

    prisma = app.get(PrismaService);
    await app.init();

    await cleanup();
  });

  async function cleanup() {
    await prisma.participants.deleteMany({
      where: { name: { startsWith: TEST_PREFIX } },
    });
    await prisma.events.deleteMany({
      where: { name: { startsWith: TEST_PREFIX } },
    });
    await prisma.users.deleteMany({
      where: { username: `${TEST_PREFIX}admin` },
    });
  }

  afterAll(async () => {
    await cleanup();
    await app.close();
    await prisma.$disconnect();
  });

  describe('1. Public Views', () => {
    it('/ (GET) returns HTML', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Content-Type', /html/);
    });

    it('/events (GET) returns HTML', () => {
      return request(app.getHttpServer())
        .get('/events')
        .expect(200)
        .expect('Content-Type', /html/);
    });

    it('/sign-in (GET) returns HTML', () => {
      return request(app.getHttpServer())
        .get('/sign-in')
        .expect(200)
        .expect('Content-Type', /html/);
    });
  });

  describe('2. Authentication Flow', () => {
    it('registers a test user', () => {
      return request(app.getHttpServer())
        .post('/api/auth/sign-up')
        .send({
          username: `${TEST_PREFIX}admin`,
          password: 'password123',
          secretKey: process.env.SECRET_KEY,
        })
        .expect(201);
    });

    it('logs in and returns a cookie', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/sign-in')
        .send({ username: `${TEST_PREFIX}admin`, password: 'password123' })
        .expect(201);

      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      authCookie = cookies[0].split(';')[0]; // Store cookie
    });

    it('/panel (GET) redirects if no cookie', () => {
      return request(app.getHttpServer()).get('/panel').expect(302);
    });

    it('/panel (GET) succeeds with cookie', () => {
      return request(app.getHttpServer())
        .get('/panel')
        .set('Cookie', authCookie)
        .expect(200)
        .expect('Content-Type', /html/);
    });
  });

  describe('3. Events API', () => {
    it('creates an event', async () => {
      const payload = {
        name: `${TEST_PREFIX}Concert`,
        date: new Date().toISOString(),
        location: 'Jakarta',
        min: 10,
        max: 500,
      };

      const res = await request(app.getHttpServer())
        .post('/api/events')
        .set('Cookie', authCookie)
        .send(payload)
        .expect(201);

      expect(res.body.message).toBeDefined();
      expect(res.body.data.id).toBeDefined();
      createdEventId = res.body.data.id;
    });

    it('gets events list', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/events')
        .set('Cookie', authCookie)
        .expect(200);

      expect(Array.isArray(res.body.data)).toBe(true);
      const found = res.body.data.find((e) => e.id === createdEventId);
      expect(found).toBeDefined();
    });

    it('updates the event', async () => {
      const payload = { location: 'Bandung' };
      const res = await request(app.getHttpServer())
        .patch(`/api/events/${createdEventId}`)
        .set('Cookie', authCookie)
        .send(payload)
        .expect(200);

      expect(res.body.data.location).toBe('Bandung');
    });
  });

  describe('4. Participants API', () => {
    it('creates a participant', async () => {
      const payload = {
        name: `${TEST_PREFIX}John Doe`,
        email: 'john@example.com',
        institusi: 'Univ',
        jurusan: 'IT',
        semester: 3,
        event_id: createdEventId,
      };

      const res = await request(app.getHttpServer())
        .post('/api/participants')
        .set('Cookie', authCookie)
        .send(payload)
        .expect(201);

      expect(res.body.message).toBeDefined();
      expect(res.body.data.id).toBeDefined();
      createdParticipantId = res.body.data.id;
    });

    it('updates the participant', async () => {
      const payload = { semester: 4 };
      const res = await request(app.getHttpServer())
        .patch(`/api/participants/${createdParticipantId}`)
        .set('Cookie', authCookie)
        .send(payload)
        .expect(200);

      expect(res.body.data.semester).toBe(4);
    });

    it('deletes the participant', () => {
      return request(app.getHttpServer())
        .delete(`/api/participants/${createdParticipantId}`)
        .set('Cookie', authCookie)
        .expect(200);
    });

    it('deletes the event', () => {
      return request(app.getHttpServer())
        .delete(`/api/events/${createdEventId}`)
        .set('Cookie', authCookie)
        .expect(200);
    });
  });
});
