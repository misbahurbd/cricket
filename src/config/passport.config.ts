import passport from "passport"
import { prisma } from "../utils/prisma"

// auth strategy
import "../services/jwt-strategy"
import "../services/local-strategy"
import "../services/google-strategy"
import "../services/facebook-strategy"

passport.serializeUser((user: any, done) => {
  done(null, {
    id: user.id,
    role: user.role,
  })
})

passport.deserializeUser((user: any, done) => {
  prisma.user
    .findUnique({
      where: { id: user.id },
    })
    .then(user => done(null, user))
    .catch(err => done(err))
})

export default passport
