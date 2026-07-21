import { HTTP_STATUS, type HttpStatusCode } from '../constants/http-status';

export class AppError extends Error {
  public readonly status: HttpStatusCode;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(status: HttpStatusCode, code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
    this.details = details;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', code = 'NOT_FOUND') {
    super(HTTP_STATUS.NOT_FOUND, code, message);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', details?: unknown) {
    super(HTTP_STATUS.BAD_REQUEST, 'VALIDATION_FAILED', message, details);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, code = 'CONFLICT') {
    super(HTTP_STATUS.CONFLICT, code, message);
  }
}
