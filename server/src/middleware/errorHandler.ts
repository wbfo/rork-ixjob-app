// import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  error: AppError,
  req: any,
  res: any,
  next: any
) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  
  // Log error with context
  console.error('🚨 Error occurred:');
  console.error(`   Method: ${req.method}`);
  console.error(`   URL: ${req.originalUrl}`);
  console.error(`   Status: ${statusCode}`);
  console.error(`   Message: ${message}`);
  
  if (env.NODE_ENV === 'development') {
    console.error(`   Stack: ${error.stack}`);
  }
  
  // Don't leak error details in production
  const response = {
    success: false,
    message: env.NODE_ENV === 'production' && statusCode === 500 
      ? 'Internal Server Error' 
      : message,
    ...(env.NODE_ENV === 'development' && {
      stack: error.stack,
      error: error
    })
  };
  
  res.status(statusCode).json(response);
};

// Async error wrapper
export const asyncHandler = (
  fn: (req: any, res: any, next: any) => Promise<any>
) => {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Create custom error
export const createError = (message: string, statusCode: number = 500): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};