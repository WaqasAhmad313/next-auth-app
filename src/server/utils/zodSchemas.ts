import { z } from "zod";

export const SignupSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(6),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const VerifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const ResetPasswordSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  newPassword: z.string().min(6),
});

export const UpdateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  image: z.string().url().optional(),
  password: z.string().min(6).optional(),
});


export const CreateUserSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  email: z.string().email(),
  password: z.string().min(6).optional(),
  image: z.string().url().optional(),
});

export const VerificationTokenSchema = z.object({
  identifier: z.string().email(),
  token: z.string().min(4),
  expires: z.date(),
});


