import { z } from "zod"
import parseNumber from "libphonenumber-js"

const registerScheam = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  mobile: z
    .string()
    .min(1, "Mobile is required")
    .refine(value => {
      const phoneNumber = parseNumber(value)
      return phoneNumber?.isValid() && phoneNumber?.country
    }, "Invalid mobile number"),
  country: z.string().min(1, "Country is required"),
  password: z
    .string()
    .min(1, { message: "Password is required!" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^\s]{8,}$/gm, {
      message:
        "Password must be at least 8 characters long, with one uppercase letter, one lowercase letter, and one number.",
    }),
})

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
})

const forgetPasswordSchema = z.object({
  identifier: z.string().min(1, { message: "Email or Username is required" }),
})

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(1, { message: "Password is required!" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^\s]{8,}$/gm, {
      message:
        "Password must be at least 8 characters long, with one uppercase letter, one lowercase letter, and one number.",
    }),
  confirmPassword: z.string().min(1, "Confirm password is requred"),
})

export const authValidation = {
  registerScheam,
  loginSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
}
