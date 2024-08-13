import dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.join(process.cwd(), ".env") })

export const config = {
  port: process.env.PORT || 4600,
  env: process.env.NODE_ENV || "development",
  hashRound: process.env.HASH_ROUND,
  secret: {
    cookieSecret: process.env.COOKIE_SECRET!,
    sessionSecret: process.env.SESSION_SECRET!,
    jwtSecret: process.env.JWT_SECRET!,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL!,
  },
  facebook: {
    clientId: process.env.FACEBOOK_CLIENT_ID!,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    callbackUrl: process.env.FACEBOOK_CALLBACK_URL!,
  },
  mailer: {
    host: process.env.MAILER_HOST!,
    port: Number(process.env.MAILER_PORT!),
    user: process.env.MAILER_USER!,
    pass: process.env.MAILER_PASS!,
  },
}
