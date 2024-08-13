import httpStatus from "http-status"

export class AppError extends Error {
  private readonly statusCode: number
  constructor(statusCode: number, message: string, stack?: "") {
    super(message)
    this.statusCode = statusCode || httpStatus.INTERNAL_SERVER_ERROR
    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}
