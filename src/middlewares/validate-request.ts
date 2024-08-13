import { AnyZodObject } from "zod"
import { catchAsync } from "../utils/catch-async"
import { AppError } from "../errors/app-error"
import httpStatus from "http-status"

export const validateRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req, res, next) => {
    // Ensure the content type is JSON
    if (!req.is("application/json"))
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Invalid content type. Expected application/json."
      )

    // Validate request body using the provided schema
    await schema.parseAsync(req.body)
    next()
  })
}
