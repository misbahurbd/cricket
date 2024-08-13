import bcrypt from "bcrypt"
import passport from "passport"
import { Strategy } from "passport-local"
import { prisma } from "../utils/prisma"
import { AppError } from "../errors/app-error"
import httpStatus from "http-status"
import { parseIdentifier } from "../utils/user-utils"

passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const identifier = parseIdentifier(username)
      let user

      if (!identifier.field) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Invalid username or email address!"
        )
      }

      if (identifier.field == "email") {
        user = await prisma.user.findUnique({
          where: {
            email: identifier.value,
          },
        })
      }
      if (identifier.field == "username") {
        user = await prisma.user.findFirst({
          where: {
            profile: {
              username: identifier.value,
            },
          },
        })
      }

      if (!user || !user.password) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid credentials")
      }

      if (user.status === "Blocked") {
        throw new AppError(httpStatus.UNAUTHORIZED, "Your account is blocked")
      }

      const isPassMatch = bcrypt.compare(password, user.password)
      if (!isPassMatch) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid credentials")
      }

      return done(null, user)
    } catch (error) {
      return done(error)
    }
  })
)

export default passport
