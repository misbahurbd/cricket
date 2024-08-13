import { Router } from "express"
import passport from "../../config/passport.config"
import { validateRequest } from "../../middlewares/validate-request"
import { authValidation } from "./auth.validation"
import { authController } from "./auth.controller"
import { verifyAuth } from "../../middlewares/verify-auth"

const router = Router()

router.post(
  "/register",
  validateRequest(authValidation.registerScheam),
  authController.registerUser
)
router.post(
  "/login",
  validateRequest(authValidation.loginSchema),
  passport.authenticate("local"),
  authController.loginUser
)
router.post("/logout", authController.logoutUser)

// google oauth2
router.get("/google", passport.authenticate("google"))
router.get(
  "/google/callback",
  passport.authenticate("google"),
  authController.loginUser
)
// facebook oauth2
router.get("/facebook", passport.authenticate("facebook"))
router.get(
  "/facebook/callback",
  passport.authenticate("facebook"),
  authController.loginUser
)

// namange auth
router.post("/verify-account/:token", authController.verifyAccount)
router.post(
  "/resend-verification-request",
  verifyAuth(),
  authController.resendVerificationRequest
)
router.post("/change-password", verifyAuth(), authController.changePassword)
router.post(
  "/forget-password",
  validateRequest(authValidation.forgetPasswordSchema),
  authController.forgetPassword
)
router.post(
  "/reset-password/:token",
  validateRequest(authValidation.resetPasswordSchema),
  authController.resetPassword
)

export const authRoutes = router
