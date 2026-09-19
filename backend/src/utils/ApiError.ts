export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors: any[];

  constructor(
    statusCode: number,
    message: string,
    errors: any[] = []
  ) {
    super(message);

    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;

    Object.setPrototypeOf(this, ApiError.prototype);

    Error.captureStackTrace(this, ApiError);
  }
}