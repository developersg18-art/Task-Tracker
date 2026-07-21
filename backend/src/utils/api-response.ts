import type { Response } from 'express';
import { HTTP_STATUS, type HttpStatusCode } from '../constants/http-status';

export interface SuccessResponse<T> {
  success: true;
  data: T;
}

export interface FailureResponse {
  success: false;
  message: string;
  code?: string;
  details?: unknown;
}

export function sendSuccess<T>(res: Response, data: T, status: HttpStatusCode = HTTP_STATUS.OK): Response {
  const body: SuccessResponse<T> = { success: true, data };
  return res.status(status).json(body);
}

export function sendFailure(
  res: Response,
  message: string,
  status: HttpStatusCode = HTTP_STATUS.BAD_REQUEST,
  code?: string,
  details?: unknown,
): Response {
  const body: FailureResponse = { success: false, message };
  if (code) body.code = code;
  if (details !== undefined) body.details = details;
  return res.status(status).json(body);
}
