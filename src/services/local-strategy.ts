import passport from "passport"
import { Strategy } from "passport-local"

passport.use(new Strategy(async (username, password, done) => {}))
