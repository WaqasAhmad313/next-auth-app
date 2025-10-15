import { AuthModel } from "./auth.model";
import { logger } from "@/server/utils/logger";
import { successResponse, errorResponse } from "@/server/utils/response";
import bcrypt from "bcryptjs";
import { jwtUtils } from "@/server/utils/jwt";
import { sendEmail } from "../../../app/api/auth/mailer";
import { randomInt } from "crypto";
import { addMinutes, isAfter } from "date-fns";

/**
 * AuthService: business logic layer for authentication and user management
 */
export const AuthService = {
  // -----------------------------
  // 🔹 Signup User
  // -----------------------------
  async signupUser({
    name,
    email,
    password,
  }: {
    name?: string;
    email: string;
    password: string;
  }) {
    try {
      const existingUser = await AuthModel.findUserByEmail(email);
      if (existingUser) {
        return errorResponse("User already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await AuthModel.createUser({
        name,
        email,
        password: hashedPassword,
      });

      // Send OTP for email verification
      const otp = AuthService.generateOtp();
      const expires = addMinutes(new Date(), 10);

      await AuthModel.upsertVerificationToken({
        identifier: email,
        token: otp,
        expires,
      });

      await sendEmail({
        to: email,
        subject: "Verify Your Email",
        html: `<p>Your verification code is:</p>
               <h2 style="font-size: 22px; letter-spacing: 3px;">${otp}</h2>
               <p>This code will expire in 10 minutes.</p>`,
      });

      return successResponse("User registered. OTP sent to email.", {
        userId: user.id,
      });
    } catch (err) {
      logger.error("Signup error:", err);
      return errorResponse("Failed to sign up user", err);
    }
  },

  // -----------------------------
  // 🔹 Verify OTP
  // -----------------------------
  async verifyOtp(email: string, otp: string) {
    try {
      const record = await AuthModel.findVerificationToken(email);
      if (!record) return errorResponse("No OTP found for this email");

      if (record.token !== otp) return errorResponse("Invalid OTP");
      if (isAfter(new Date(), record.expires))
        return errorResponse("OTP expired");

      // OTP verified — mark user as verified
      await AuthModel.markUserEmailVerified(email);
      await AuthModel.deleteVerificationToken(email);

      return successResponse("Email verified successfully");
    } catch (err) {
      logger.error("OTP verification error:", err);
      return errorResponse("Failed to verify OTP", err);
    }
  },

  // -----------------------------
  // 🔹 Login User
  // -----------------------------
  async loginUser(email: string, password: string) {
    try {
      const user = await AuthModel.findUserByEmail(email);
      if (!user) return errorResponse("User not found");

      if (!user.password) return errorResponse("Password not set (OAuth user)");
      console.log("Credentials:", { email, password });
      console.log("DB user:", { email: user.email, password: user.password });
      console.log(
        "Password === hash compare result:",
        await bcrypt.compare(password, user.password)
      );

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return errorResponse("Invalid credentials");

      // Generate access and refresh tokens
      const tokens = jwtUtils.generateTokens({
        userId: user.id,
        email: user.email,
      });

      return successResponse("Login successful", {
        user: { id: user.id, email: user.email, name: user.name },
        ...tokens,
      });
    } catch (err) {
      logger.error("Login error:", err);
      return errorResponse("Failed to log in user", err);
    }
  },

  // -----------------------------
  // 🔹 Forgot Password (Send Reset OTP)
  // -----------------------------
  async forgotPassword(email: string) {
    try {
      const user = await AuthModel.findUserByEmail(email);
      if (!user) return errorResponse("User not found");

      const otp = AuthService.generateOtp();
      const expires = addMinutes(new Date(), 10);

      await AuthModel.upsertVerificationToken({
        identifier: email,
        token: otp,
        expires,
      });

      await sendEmail({
        to: email,
        subject: "Password Reset Code",
        html: `<p>Your password reset code:</p>
               <h2 style="font-size: 22px;">${otp}</h2>
               <p>This code will expire in 10 minutes.</p>`,
      });

      return successResponse("Password reset code sent");
    } catch (err) {
      logger.error("Forgot password error:", err);
      return errorResponse("Failed to send password reset email", err);
    }
  },

  // -----------------------------
  // 🔹 Reset Password
  // -----------------------------
  async resetPassword(email: string, otp: string, newPassword: string) {
    try {
      const record = await AuthModel.findVerificationToken(email);
      if (!record) return errorResponse("No OTP found for this email");

      if (record.token !== otp) return errorResponse("Invalid OTP");
      if (isAfter(new Date(), record.expires))
        return errorResponse("OTP expired");

      const hashed = await bcrypt.hash(newPassword, 10);
      await AuthModel.updateUserByEmail(email, { password: hashed });
      await AuthModel.deleteVerificationToken(email);

      return successResponse("Password reset successful");
    } catch (err) {
      logger.error("Password reset error:", err);
      return errorResponse("Failed to reset password", err);
    }
  },

  // -----------------------------
  // 🔹 Get User by ID (Profile)
  // -----------------------------
  async getUserById(id: string) {
    try {
      const user = await AuthModel.findUserById(id);
      if (!user) return errorResponse("User not found");

      return successResponse("User fetched successfully", user);
    } catch (err) {
      logger.error("Get user by ID error:", err);
      return errorResponse("Failed to fetch user data", err);
    }
  },

  // -----------------------------
  // 🔹 Update User by ID
  // -----------------------------
  async updateUserById(id: string, data: Record<string, unknown>) {
    try {
      const updatedUser = await AuthModel.updateUserById(id, data);
      return successResponse("User updated successfully", updatedUser);
    } catch (err) {
      logger.error("Update user by ID error:", err);
      return errorResponse("Failed to update user", err);
    }
  },

  // -----------------------------
  // 🔹 Cleanup Expired Tokens
  // -----------------------------
  async cleanupExpiredOtps() {
    try {
      const result = await AuthModel.deleteExpiredVerificationTokens();
      return successResponse("Expired OTPs cleaned", result);
    } catch (err) {
      logger.error("Cleanup expired OTPs error:", err);
      return errorResponse("Failed to cleanup expired OTPs", err);
    }
  },

  // -----------------------------
  // 🧩 Utility: Generate OTP
  // -----------------------------
  generateOtp(length = 6) {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return String(randomInt(min, max));
  },
};
