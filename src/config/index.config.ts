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
  },
}
