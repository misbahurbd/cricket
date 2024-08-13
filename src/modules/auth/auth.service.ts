import httpStatus from "http-status"
import { parsePhoneNumber } from "libphonenumber-js"
import { Country } from "country-state-city"
import bcrypt from "bcrypt"

import { AppError } from "../../errors/app-error"
import { prisma } from "../../utils/prisma"
import {
  IChangePassword,
  IForgetPassword,
  IRegister,
  IResetPassword,
} from "./auth.interface"
import { config } from "../../config/index.config"
import {
  generateInitials,
  generateUsername,
  parseIdentifier,
} from "../../utils/user-utils"
import { sendResetPassMail, sendVerifyMail } from "../../mail/send-verify-mail"

// register new user
const registerUser = async (payload: IRegister) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  })
  if (isUserExist)
    throw new AppError(httpStatus.BAD_REQUEST, "User already exist!")

  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.hashRound)
  )

  const mobileNumber = parsePhoneNumber(payload.mobile)
  const country = Country.getCountryByCode(payload.country)
  if (!country)
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid country code")

  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email.trim().toLowerCase(),
      password: hashedPassword,
      profile: {
        create: {
          name: payload.name,
          email: payload.email.trim().toLowerCase(),
          username: await generateUsername(payload.name),
          mobile: mobileNumber?.number || null,
          initials: generateInitials(payload.name),
          country: {
            connectOrCreate: {
              where: {
                isoCode: country.isoCode,
              },
              create: {
                name: country.name,
                currency: country.currency,
                flag: country.flag,
                isoCode: country.isoCode,
                latitude: country.latitude,
                longitude: country.longitude,
                phonecode: country.phonecode,
                timeZones: {
                  createMany: {
                    data: country.timezones || [],
                  },
                },
              },
            },
          },
        },
      },
    },
    include: {
      profile: true,
    },
  })

  sendVerifyMail(user)

  return user.profile
}

// verify account
const verifyAccount = async (token: string) => {
  const user = await prisma.$transaction(async tx => {
    const existedToken = await prisma.verificationToken.findUnique({
      where: {
        token,
        tokenType: "Verify",
      },
    })

    if (!existedToken) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid token!")
    }

    const verifyToken = await tx.verificationToken.delete({
      where: {
        token,
        tokenType: "Verify",
        expires: {
          gt: new Date(),
        },
      },
    })

    const user = await tx.user.update({
      where: {
        id: verifyToken.identifier,
        NOT: {
          status: "Blocked",
        },
      },
      data: {
        emailVerified: new Date(),
      },
    })

    return user
  })

  return user
}

// send account verify token
const resendVerificationRequest = async (currentUser: Express.User) => {
  const user = await prisma.user.findUnique({
    where: {
      id: currentUser.id,
    },
  })

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!")
  }

  if (user.status == "Blocked") {
    throw new AppError(httpStatus.UNAUTHORIZED, "Your account is blocked!")
  }

  if (user.emailVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, "You account already verified")
  }

  await sendVerifyMail(user)

  return true
}

// change password
const changePassword = async (
  data: IChangePassword,
  currentUser: Express.User
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: currentUser.id,
    },
  })

  if (!user || !user.password) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!")
  }

  if (user.status === "Blocked") {
    throw new AppError(httpStatus.NOT_FOUND, "Your account is blocked!")
  }

  const isPassValid = await bcrypt.compare(data.currentPassword, user.password)
  if (!isPassValid) {
    throw new AppError(httpStatus.BAD_REQUEST, "Wrong password!")
  }

  if (data.newPassword !== data.confirmPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Confirm password does not match!"
    )
  }

  const hashedPassword = await bcrypt.hash(
    data.newPassword,
    Number(config.hashRound)
  )

  const updateUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
    },
  })

  return updateUser
}

// forget passwrod
const forgetPassword = async (payload: IForgetPassword) => {
  const identifier = parseIdentifier(payload.identifier)

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

  await sendResetPassMail(user)

  return {
    ...user,
    password: null,
  }
}

const resetPassword = async (token: string, payload: IResetPassword) => {
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token, tokenType: "Reset" },
  })

  if (!verificationToken) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid reset token")
  }

  if (verificationToken.expires.getTime() < new Date().getTime()) {
    throw new AppError(httpStatus.BAD_REQUEST, "Reset token expire")
  }

  if (payload.password !== payload.confirmPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Confirm password does not match!"
    )
  }

  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.hashRound)
  )

  const user = await prisma.user.update({
    where: {
      id: verificationToken.identifier,
      NOT: {
        password: null,
        status: "Blocked",
      },
    },
    data: {
      password: hashedPassword,
    },
  })

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!")
  }

  return user
}

export const authService = {
  registerUser,
  verifyAccount,
  resendVerificationRequest,
  changePassword,
  forgetPassword,
  resetPassword,
}
