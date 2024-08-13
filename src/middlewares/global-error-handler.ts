import { ErrorRequestHandler } from "express"
import httpStatus from "http-status"
import { ZodError } from "zod"

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR
  let message = err.message || "Something went wrong"
  let errorDetails = err || null

  if (err instanceof ZodError) {
    statusCode = httpStatus.BAD_REQUEST
    message = err.issues
      .map(issue =>
        issue.message == "Required"
          ? `${issue.path[0]} is ${issue.message}`.toLowerCase()
          : issue.message
      )
      .join(", ")
    errorDetails = err.issues
  } else if (err.code && err.code === 11000) {
    statusCode = httpStatus.BAD_REQUEST
    message = "Duplicate Entry"
    if (err.keyValue) {
      message = `${Object.keys(err.keyValue)} is already exist`
    }
  } else if (err.code && err.code === "P2002") {
    statusCode = httpStatus.BAD_REQUEST
    message = "Duplicate Entry"
    if (err?.meta?.target) {
      message = `This ${err?.meta?.target[0]} already used!`
    }
  } else {
    errorDetails = null
  }

  res.status(statusCode).json({
    statusCode,
    success: false,
    message,
    errorDetails,
  })
  next()
}

export default globalErrorHandler
