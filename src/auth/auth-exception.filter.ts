import { ExceptionFilter, Catch, ArgumentsHost, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(UnauthorizedException)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    // If the request is for an API, return JSON.
    if (request.url.startsWith('/api/')) {
      response.status(401).json({
        statusCode: 401,
        message: 'Unauthorized',
      });
    } else {
      // If it's a view route (like /panel), redirect to sign in
      response.redirect('/sign-in');
    }
  }
}
