import express, { Application } from "express"
import cookieParser from "cookie-parser"
import session from "express-session"
import cors from "cors"
import { config } from "./config/index.config"
import { sessionConfig } from "./config/session.config"
import { corsConfig } from "./config/cors.config"

// initialize express application
const app: Application = express()

// initilize parsers
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors(corsConfig))
app.use(cookieParser(config.secret.cookieSecret))
app.use(session(sessionConfig))

export default app
