import { Boom } from '@hapi/boom';

declare global {
  namespace Express {
    interface Response {
      boom: {
        badRequest(message?: string): Boom;
        unauthorized(message?: string): Boom;
        forbidden(message?: string): Boom;
        notFound(message?: string): Boom;
        badImplementation(message?: string): Boom;
      }
    }
  }
}

declare module 'express-boom' {
  import { RequestHandler } from 'express';
  const boom: () => RequestHandler;
  export default boom;
} 