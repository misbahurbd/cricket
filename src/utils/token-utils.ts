import { TokenType } from "@prisma/client"
import { prisma } from "./prisma"

const generateOtp = () => {
  let otp = ""
  while (otp.length < 6) {
    otp += Math.floor(Math.random() * 10).toString()
  }
  return otp
}

export const generateVerificationToken = async (
  userId: string,
  type: TokenType
) => {
  const token = await prisma.$transaction(async tsx => {
    await tsx.verificationToken.deleteMany({
      where: {
        identifier: userId,
        tokenType: type,
      },
    })

    const verificationToken = await tsx.verificationToken.create({
      data: {
        identifier: userId,
        token: crypto.randomUUID().toString(),
        otpCode: generateOtp(),
        tokenType: type,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 2),
      },
    })

    return verificationToken
  })

  return token
}

export const generateResetToken = async (userId: string, type: TokenType) => {
  const token = await prisma.$transaction(async tsx => {
    await tsx.verificationToken.deleteMany({
      where: {
        identifier: userId,
        tokenType: type,
      },
    })

    const verificationToken = await tsx.verificationToken.create({
      data: {
        identifier: userId,
        token: crypto.randomUUID().toString(),
        tokenType: type,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 2),
      },
    })

    return verificationToken
  })

  return token
}
