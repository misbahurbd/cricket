import { User } from "@prisma/client"
import {
  generateResetToken,
  generateVerificationToken,
} from "../utils/token-utils"
import { sendMail } from "./mailer"

export const sendVerifyMail = async (user: User) => {
  const token = await generateVerificationToken(user.id, "Verify")

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Verification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: 40px auto;
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header {
                background-color: #4CAF50;
                color: #ffffff;
                padding: 20px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
            }
            .content {
                padding: 20px;
            }
            .content p {
                line-height: 1.6;
            }
            .otp-code {
                font-size: 18px;
                font-weight: bold;
                color: #4CAF50;
                text-align: center;
                margin: 20px 0;
            }
            .button-container {
                text-align: center;
                margin: 20px 0;
            }
            .verify-button {
                background-color: #4CAF50;
                color: #ffffff;
                text-decoration: none;
                padding: 10px 20px;
                border-radius: 5px;
                display: inline-block;
                font-size: 16px;
                transition: background-color 0.3s ease;
            }
            .verify-button:hover {
                background-color: #45a049;
            }
            .footer {
                background-color: #f4f4f4;
                color: #777;
                padding: 10px 20px;
                text-align: center;
                font-size: 12px;
            }
            .footer p {
                margin: 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Welcome to Our Service!</h1>
            </div>
            <div class="content">
                <p>Hi ${user.name},</p>
                <p>Thank you for signing up for our service. To complete your registration, please verify your email address by using the OTP code below or by clicking the verification button:</p>
                <div class="otp-code">
                    OTP Code: <span>${token.otpCode}</span>
                </div>
                <div class="button-container">
                    <a href="${
                      "https://localhost:3000/auth/verify-account?token=" +
                      token.token
                    }" class="verify-button">Verify Email</a>
                </div>
                <p>If you did not create an account, no further action is required.</p>
                <p>Thanks,<br>The CrickBroCrickBro Team</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 CrickBro. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>

  `

  sendMail(user.email, "Verify your account", html)
}

export const sendResetPassMail = async (user: User) => {
  const token = await generateResetToken(user.id, "Reset")

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: 40px auto;
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header {
                background-color: #4CAF50;
                color: #ffffff;
                padding: 20px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
            }
            .content {
                padding: 20px;
            }
            .content p {
                line-height: 1.6;
            }
            .button-container {
                text-align: center;
                margin: 20px 0;
            }
            .reset-button {
                background-color: #4CAF50;
                color: #ffffff;
                text-decoration: none;
                padding: 10px 20px;
                border-radius: 5px;
                display: inline-block;
                font-size: 16px;
                transition: background-color 0.3s ease;
            }
            .reset-button:hover {
                background-color: #45a049;
            }
            .footer {
                background-color: #f4f4f4;
                color: #777;
                padding: 10px 20px;
                text-align: center;
                font-size: 12px;
            }
            .footer p {
                margin: 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Password Reset Request</h1>
            </div>
            <div class="content">
                <p>Hi ${user.name},</p>
                <p>We received a request to reset the password for your account. You can reset your password by clicking the button below:</p>
                <div class="button-container">
                    <a href="${
                      "https://localhost:3000/auth/reset-password?token=" +
                      token.token
                    }" class="reset-button">Reset Password</a>
                </div>
                <p>If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
                <p>Thanks,<br>The CrickBro Team</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 CrickBro. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `

  sendMail(user.email, "Reset your password", html)
}
