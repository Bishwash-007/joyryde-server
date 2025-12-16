export class AppError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const errorCatalog = {
  unauthorized: new AppError(401, 'Unauthorized'),
  forbidden: new AppError(403, 'Forbidden'),
  notFound: new AppError(404, 'Resource not found')
};
