import { UserRole } from "@prisma/client"
import { catchAsync } from "../utils/catch-async"
import { AppError } from "../errors/app-error"
import httpStatus from "http-status"
import { prisma } from "../utils/prisma"

export const verifyAuth = (...role: UserRole[]) => {
  return catchAsync(async (req, res, next) => {
    const isAuthenticated = req.isAuthenticated()
    if (!isAuthenticated) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!")
    }

    const currentUser = req.user
    if (!currentUser) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!")
    }

    const user = await prisma.user.findUnique({
      where: {
        id: currentUser.id,
      },
    })
    if (!user) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!")
    }
    if (
      role.length > 0 &&
      (!role.includes(currentUser.role) || currentUser.role !== user.role)
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!")
    }

    next()
  })
}
