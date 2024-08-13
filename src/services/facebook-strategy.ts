import passport from "passport"
import { Profile, Strategy, VerifyFunction } from "passport-facebook"
import { config } from "../config/index.config"

const verifyFunction: VerifyFunction = async (
  accessToken,
  refreshToken,
  profile,
  done
) => {
  console.log({ accessToken, refreshToken, profile })
}

passport.use(
  new Strategy(
    {
      clientID: config.facebook.clientId,
      clientSecret: config.facebook.clientSecret,
      callbackURL: config.facebook.callbackUrl,
      scope: ["public_profile", "email"],
    },
    verifyFunction
  )
)

export default passport
