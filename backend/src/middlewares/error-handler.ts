import type { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { AppError } from '../utils/api-error';
import { sendFailure } from '../utils/api-response';
import { HTTP_STATUS } from '../constants/http-status';
import { ERROR_MESSAGES } from '../constants/error-messages';
import { logger } from '../lib/logger';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    if (err.status >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
      logger.error({ err, path: req.path }, 'Application error');
    } else {
      logger.warn({ code: err.code, message: err.message, path: req.path }, 'Handled error');
    }
    return sendFailure(res, err.message, err.status, err.code, err.details);
  }

  if (err instanceof ZodError) {
    return sendFailure(
      res,
      ERROR_MESSAGES.VALIDATION_FAILED,
      HTTP_STATUS.BAD_REQUEST,
      'VALIDATION_FAILED',
      err.flatten().fieldErrors,
    );
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaError(err, res);
  }

  logger.error({ err, path: req.path }, 'Unhandled error');
  sendFailure(res, ERROR_MESSAGES.INTERNAL_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'INTERNAL_ERROR');
}

function handlePrismaError(
  err: Prisma.PrismaClientKnownRequestError,
  res: Response,
): void {
  switch (err.code) {
    case 'P2002':
      return sendFailure(
        res,
        'Unique constraint violation',
        HTTP_STATUS.CONFLICT,
        'UNIQUE_CONSTRAINT',
        { target: err.meta?.target },
      );
    case 'P2025':
      return sendFailure(
        res,
        ERROR_MESSAGES.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'NOT_FOUND',
      );
    default:
      logger.error({ err }, 'Prisma error');
      return sendFailure(
        res,
        ERROR_MESSAGES.INTERNAL_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        'DATABASE_ERROR',
      );
  }
}
