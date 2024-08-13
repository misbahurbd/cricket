import nodemailer from "nodemailer"
import { config } from "../config/index.config"
import { AppError } from "../errors/app-error"
import httpStatus from "http-status"

const transporter: nodemailer.Transporter = nodemailer.createTransport({
  host: config.mailer.host,
  port: config.env === "production" ? 465 : 587,
  secure: config.env === "production",
  auth: {
    user: config.mailer.user,
    pass: config.mailer.pass,
  },
})

export const sendMail = async (
  email: string,
  subject: string,
  mailHtml: string
) => {
  try {
    const mailStatus = await transporter.sendMail({
      from: config.mailer.user,
      to: email,
      subject,
      html: mailHtml,
    })

    console.log("Message sent: %s", mailStatus.messageId)
  } catch (error: any) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error?.message || "Internal server error"
    )
  }
}
