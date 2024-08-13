import passport from "passport"
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20"
import { config } from "../config/index.config"
import { prisma } from "../utils/prisma"
import { AppError } from "../errors/app-error"
import { generateInitials, generateUsername } from "../utils/user-utils"
import httpStatus from "http-status"
import { Request } from "express"

passport.use(
  new Strategy(
    {
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackUrl,
      scope: ["profile", "email"],
      passReqToCallback: true,
    },
    async (
      request: Request,
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const account = await prisma.account.findUnique({
          where: {
            provider_providerId: {
              provider: "google",
              providerId: profile.id,
            },
          },
          include: {
            user: true,
          },
        })

        if (account && account.user) {
          if (account.user.status === "Blocked") {
            throw new AppError(
              httpStatus.UNAUTHORIZED,
              "Your account is blocked"
            )
          }

          return done(null, account.user)
        }

        const isEmailUsed = await prisma.user.findUnique({
          where: {
            email: profile._json?.email,
          },
        })

        if (isEmailUsed) {
          throw new AppError(httpStatus.BAD_REQUEST, "Email already used!")
        }
        const newAccount = await prisma.account.create({
          data: {
            provider: "google",
            providerId: profile.id,
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: {
              create: {
                email: profile._json.email?.toLowerCase().trim()!,
                emailVerified: profile._json.email_verified ? new Date() : null,
                name: profile._json?.name!,
                profile: {
                  create: {
                    email: profile._json.email?.toLowerCase().trim()!,
                    name: profile._json?.name!,
                    username: await generateUsername(profile._json?.name!),
                    initials: generateInitials(profile._json?.name!),
                    profilePhoto: profile._json?.picture,
                  },
                },
              },
            },
          },
          include: {
            user: true,
          },
        })

        if (!newAccount) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            "Unable to create account!"
          )
        }

        return done(null, newAccount.user)
      } catch (error) {
        return done(error)
      }
    }
  )
)

export default passport
