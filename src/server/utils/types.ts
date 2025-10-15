import { z } from "zod";
import {
  SignupSchema,
  LoginSchema,
  VerifyOtpSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  CreateUserSchema,
  UpdateUserSchema,
  VerificationTokenSchema,
} from "./zodSchemas";

export type SignupInput = z.infer<typeof SignupSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type VerifyOtpInput = z.infer<typeof VerifyOtpSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type VerificationTokenInput = z.infer<typeof VerificationTokenSchema>;
