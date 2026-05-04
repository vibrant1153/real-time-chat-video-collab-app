// backend/src/middleware/logger.ts
import morgan from 'morgan';
import type { Request, Response, NextFunction } from 'express';

export const requestLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  {
    skip: (req:Request) => process.env.NODE_ENV === 'test'
  }
);