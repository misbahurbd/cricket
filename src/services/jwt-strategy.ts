import passport from "passport"
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt"
import { config } from "../config/index.config"

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.secret.jwtSecret,
}

passport.use(
  new Strategy(opts, async (payload: any, done: VerifiedCallback) => {
    try {
      console.log({ payload })
      done(null, { id: payload.id, role: payload.role })
    } catch (error) {
      done(error)
    }
  })
)
export default passport
