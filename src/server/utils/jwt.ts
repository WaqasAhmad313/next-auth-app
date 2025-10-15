import jwt from "jsonwebtoken";
import { ENV } from "@/server/env";
import { logger } from "./logger";

const ACCESS_TOKEN_EXPIRY = "15m"; // short-lived
const REFRESH_TOKEN_EXPIRY = "7d"; // long-lived

export const jwtUtils = {
  generateTokens(payload: { userId: string; email: string }) {
    try {
      const accessToken = jwt.sign(payload, ENV.JWT_ACCESS_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRY,
      });

      const refreshToken = jwt.sign(payload, ENV.JWT_REFRESH_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRY,
      });

      return { accessToken, refreshToken };
    } catch (err) {
      logger.error("Error generating tokens", err);
      throw new Error("Token generation failed");
    }
  },

  verifyAccessToken(token: string) {
    try {
      return jwt.verify(token, ENV.JWT_ACCESS_SECRET) as jwt.JwtPayload;
    } catch {
      return null;
    }
  },

  verifyRefreshToken(token: string) {
    try {
      return jwt.verify(token, ENV.JWT_REFRESH_SECRET) as jwt.JwtPayload;
    } catch {
      return null;
    }
  },
};
