import { NextRequest } from "next/server";
import { AuthService } from "./auth.service";
import { logger } from "@/server/utils/logger";
import { errorResponse } from "@/server/utils/response";
import {
  SignupSchema,
  LoginSchema,
  VerifyOtpSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  UpdateUserSchema,
} from "@/server/utils/zodSchemas";
import {
  SignupInput,
  LoginInput,
  VerifyOtpInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  UpdateUserInput,
} from "@/server/utils/types";


export const AuthController = {
  async signupUser(req: NextRequest) {
    try {
      const body = (await req.json()) as SignupInput;
      const parsed = SignupSchema.safeParse(body);
      if (!parsed.success)
        return errorResponse("Invalid signup data", parsed.error.format());

      const result = await AuthService.signupUser(parsed.data);
      return result;
    } catch (err) {
      logger.error("Controller: Signup error", err);
      return errorResponse("Failed to sign up user", 500);
    }
  },

  async verifyOtp(req: NextRequest) {
    try {
      const body = (await req.json()) as VerifyOtpInput;
      const parsed = VerifyOtpSchema.safeParse(body);
      if (!parsed.success)
        return errorResponse("Invalid OTP data", parsed.error.format());
      const { email, otp } = parsed.data;
      const result = await AuthService.verifyOtp(email, otp);
      return result;
    } catch (err) {
      logger.error("Controller: Verify OTP error", err);
      return errorResponse("Failed to verify OTP", 500);
    }
  },

  async loginUser(req: NextRequest) {
    try {
      const body = (await req.json()) as LoginInput;
      console.log("Login body:", body);
      const parsed = LoginSchema.safeParse(body);
      if (!parsed.success)
        return errorResponse("Invalid login data", parsed.error.format());
      const { email, password } = parsed.data;
      const result = await AuthService.loginUser(email, password);
      return result;
    } catch (err) {
      logger.error("Controller: Login error", err);
      return errorResponse("Failed to log in user", 500);
    }
  },

  async forgotPassword(req: NextRequest) {
    try {
      const body = (await req.json()) as ForgotPasswordInput;
      const parsed = ForgotPasswordSchema.safeParse(body);
      if (!parsed.success)
        return errorResponse(
          "Invalid forgot password data",
          parsed.error.format()
        );
      const { email } = parsed.data;

      if (!email) return errorResponse("Email is required", 400);

      const result = await AuthService.forgotPassword(email);
      return result;
    } catch (err) {
      logger.error("Controller: Forgot password error", err);
      return errorResponse("Failed to send reset code", 500);
    }
  },

  async resetPassword(req: NextRequest) {
    try {
      const body = (await req.json()) as ResetPasswordInput;
      const parsed = ResetPasswordSchema.safeParse(body);
      if (!parsed.success)
        return errorResponse(
          "Invalid reset password data",
          parsed.error.format()
        );
      const { email, otp, newPassword } = parsed.data;

      if (!email || !otp || !newPassword)
        return errorResponse("Email, OTP, and new password are required", 400);

      const result = await AuthService.resetPassword(email, otp, newPassword);
      return result;
    } catch (err) {
      logger.error("Controller: Reset password error", err);
      return errorResponse("Failed to reset password", 500);
    }
  },

  async getUserById(_req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const { id } = params;
      const result = await AuthService.getUserById(id);
      return result;
    } catch (err) {
      logger.error("Controller: Get user by ID error", err);
      return errorResponse("Failed to fetch user", 500);
    }
  },

  async updateUserById(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const { id } = params;
      const data = (await req.json()) as UpdateUserInput;
      const parsed = UpdateUserSchema.safeParse(data);
      if (!parsed.success)
        return errorResponse("Invalid update data", parsed.error.format()); 

      const result = await AuthService.updateUserById(id, parsed.data);
      return result;
    } catch (err) {
      logger.error("Controller: Update user by ID error", err);
      return errorResponse("Failed to update user", 500);
    }
  },

  async cleanupExpiredOtps() {
    try {
      const result = await AuthService.cleanupExpiredOtps();
      return result;
    } catch (err) {
      logger.error("Controller: Cleanup expired OTPs error", err);
      return errorResponse("Failed to cleanup expired OTPs", 500);
    }
  },
};
