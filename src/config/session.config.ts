import { config } from "./index.config"
import { SessionOptions } from "express-session"
import { PrismaSessionStore } from "@quixo3/prisma-session-store"
import { prisma } from "./../utils/prisma"

export const sessionConfig: SessionOptions = {
  secret: config.secret.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: config.env === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
  store: new PrismaSessionStore(prisma, {
    checkPeriod: 2 * 60 * 1000,
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  }),
  name: "session",
}
