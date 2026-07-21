import type { NextFunction, Request, Response } from 'express';
import { sendFailure } from '../utils/api-response';
import { HTTP_STATUS } from '../constants/http-status';
import { ERROR_MESSAGES } from '../constants/error-messages';

export function notFoundHandler(req: Request, res: Response, _next: NextFunction): void {
  sendFailure(
    res,
    `${ERROR_MESSAGES.NOT_FOUND}: ${req.method} ${req.originalUrl}`,
    HTTP_STATUS.NOT_FOUND,
    'ROUTE_NOT_FOUND',
  );
}
