import { CorsOptions } from "cors"

export const corsConfig: CorsOptions = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
}
