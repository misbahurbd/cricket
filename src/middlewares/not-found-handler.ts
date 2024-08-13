import httpStatus from "http-status"
import { catchAsync } from "../utils/catch-async"
import { sendResponse } from "../utils/send-response"

export const notFoundHandler = catchAsync(async (req, res) => {
  sendResponse(res, {
    statusCode: httpStatus.NOT_FOUND,
    success: false,
    message: "API endpoint not found!",
    data: null,
  })
})
