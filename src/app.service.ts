import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    const random = Math.random() > 0.5;
    return random ? 'index' : 'index-heading';
  }
}
