import express, { Application } from "express"
import cookieParser from "cookie-parser"
import session from "express-session"
import cors from "cors"
import csrf from "csrf"
import { config } from "./config/index.config"
import { sessionConfig } from "./config/session.config"
import { corsConfig } from "./config/cors.config"
import passport from "./config/passport.config"
import { moduleRoutes } from "./routes/module.routes"
import { notFoundHandler } from "./middlewares/not-found-handler"
import globalErrorHandler from "./middlewares/global-error-handler"

// initialize express application
const app: Application = express()

// initilize parsers
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors(corsConfig))
app.use(cookieParser(config.secret.cookieSecret))
app.use(session(sessionConfig))
app.use(passport.initialize())
app.use(passport.session())

// initialize module routes
app.use("/api/v1", moduleRoutes)

app.get("/api/v1", (req, res) => {
  console.log(req.user)
  res.json(req.session)
})

// not found handler
app.use(notFoundHandler)

// global error handler
app.use(globalErrorHandler)

export default app
