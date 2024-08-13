import express, { Router } from "express"
import { authRoutes } from "../modules/auth/auth.routes"

const router = express.Router()

const routers: { path: string; router: Router }[] = [
  {
    path: "/auth",
    router: authRoutes,
  },
]

routers.forEach(route => {
  router.use(route.path, route.router)
})

export const moduleRoutes = router
