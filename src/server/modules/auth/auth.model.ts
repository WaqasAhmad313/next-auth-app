import { prisma } from "@/server/db/prisma";
import { logger } from "@/server/utils/logger";
import {
  CreateUserSchema,
  UpdateUserSchema,
  VerificationTokenSchema,
} from "@/server/utils/zodSchemas";
import {
  CreateUserInput,
  UpdateUserInput,
  VerificationTokenInput,
} from "@/server/utils/types";

export const AuthModel = {
  // --- USER OPERATIONS ---
  async createUser(data: CreateUserInput) {
    try {
      const validatedData = CreateUserSchema.parse(data);
      return await prisma.user.create({ data: validatedData });
    } catch (err) {
      logger.error("Error creating user:", err);
      throw new Error("Failed to create user");
    }
  },

  async findUserByEmail(email: string) {
    try {
      return await prisma.user.findUnique({ where: { email } });
    } catch (err) {
      logger.error("Error finding user by email:", err);
      throw new Error("Failed to find user by email");
    }
  },

  async findUserById(id: string) {
    try {
      return await prisma.user.findUnique({ where: { id } });
    } catch (err) {
      logger.error("Error finding user by ID:", err);
      throw new Error("Failed to find user by ID");
    }
  },

  async updateUserByEmail(email: string, data: UpdateUserInput) {
    try {
      const validatedData = UpdateUserSchema.parse(data);
      return await prisma.user.update({ where: { email }, data: validatedData });
    } catch (err) {
      logger.error("Error updating user by email:", err);
      throw new Error("Failed to update user by email");
    }
  },

  async updateUserById(id: string, data: UpdateUserInput) {
    try {
      const validatedData = UpdateUserSchema.parse(data);
      return await prisma.user.update({ where: { id }, data: validatedData });
    } catch (err) {
      logger.error("Error updating user by ID:", err);
      throw new Error("Failed to update user by ID");
    }
  },

  async markUserEmailVerified(email: string) {
    try {
      return await prisma.user.update({
        where: { email },
        data: { emailVerified: new Date() },
      });
    } catch (err) {
      logger.error("Error marking user email as verified:", err);
      throw new Error("Failed to verify user email");
    }
  },

  // --- VERIFICATION TOKEN (OTP) ---
  async upsertVerificationToken( data : VerificationTokenInput) {
    try {
      const { identifier, token, expires } = VerificationTokenSchema.parse(data);
      return await prisma.verificationToken.upsert({
        where: { identifier },
        update: { token, expires },
        create: { identifier, token, expires },
      });
    } catch (err) {
      logger.error("Error upserting verification token:", err);
      throw new Error("Failed to upsert verification token");
    }
  },

  async findVerificationToken(identifier: string) {
    try {
      return await prisma.verificationToken.findUnique({ where: { identifier } });
    } catch (err) {
      logger.error("Error finding verification token:", err);
      throw new Error("Failed to find verification token");
    }
  },

  async deleteVerificationToken(identifier: string) {
    try {
      return await prisma.verificationToken.delete({ where: { identifier } });
    } catch (err) {
      logger.error("Error deleting verification token:", err);
      throw new Error("Failed to delete verification token");
    }
  },

  async deleteExpiredVerificationTokens() {
    try {
      return await prisma.verificationToken.deleteMany({
        where: { expires: { lt: new Date() } },
      });
    } catch (err) {
      logger.error("Error deleting expired verification tokens:", err);
      throw new Error("Failed to delete expired verification tokens");
    }
  },
};
