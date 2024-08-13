import httpStatus from "http-status"
import { catchAsync } from "../../utils/catch-async"
import { sendResponse } from "../../utils/send-response"
import { authService } from "./auth.service"
import { AppError } from "../../errors/app-error"

// register new user
const registerUser = catchAsync(async (req, res) => {
  const result = await authService.registerUser(req.body)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Registration success!",
    data: result,
  })
})

// login user
const loginUser = catchAsync(async (req, res) => {
  sendResponse(res, {
    message: "Login success",
    data: null,
  })
})

// logout user
const logoutUser = catchAsync(async (req, res, next) => {
  req.logOut(err => {
    if (err) next(err)

    sendResponse(res, {
      message: "Logout success!",
      data: null,
    })
  })
})

// verify account
const verifyAccount = catchAsync(async (req, res) => {
  const result = await authService.verifyAccount(req.params.token)

  sendResponse(res, {
    message: "Account verify successfully!",
    data: null,
  })
})

// send new verification link
const resendVerificationRequest = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authrozied")
  }

  await authService.resendVerificationRequest(req.user)

  sendResponse(res, {
    message: "Email send successfully!",
    data: null,
  })
})

// change password
const changePassword = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!")
  }

  await authService.changePassword(req.body, req.user)

  sendResponse(res, {
    message: "Your password changed successfully!",
    data: null,
  })
})

// forget password
const forgetPassword = catchAsync(async (req, res) => {
  const result = await authService.forgetPassword(req.body)

  sendResponse(res, {
    message: "Reset password link send to your email",
    data: result,
  })
})

// reset password
const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.params.token, req.body)

  sendResponse(res, {
    message: "Password reset successfully!",
    data: null,
  })
})

export const authController = {
  registerUser,
  loginUser,
  logoutUser,
  verifyAccount,
  resendVerificationRequest,
  changePassword,
  forgetPassword,
  resetPassword,
}
