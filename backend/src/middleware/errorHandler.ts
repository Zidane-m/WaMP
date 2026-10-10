import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  public statusCode: number;
  public details?: Array<{ field?: string; message: string }>;

  constructor(message: string, statusCode: number = 400, details?: Array<{ field?: string; message: string }>) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Handle Zod Validation Error (HTTP 400)
  if (err instanceof ZodError) {
    const details = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message
    }));

    res.status(400).json({
      error: {
        message: 'Validasi input gagal',
        details
      }
    });
    return;
  }

  // Handle Known Application Error
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        message: err.message,
        ...(err.details && { details: err.details })
      }
    });
    return;
  }

  // Handle Unexpected Server Error (HTTP 500)
  console.error('[Unhandled Server Error]:', err);
  res.status(500).json({
    error: {
      message: 'Terjadi kesalahan pada server'
    }
  });
}

export default errorHandler;
