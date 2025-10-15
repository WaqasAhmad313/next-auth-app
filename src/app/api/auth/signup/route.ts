import { NextRequest } from "next/server";
import { AuthController } from "@/server/modules/auth/auth.controller";
import { logger } from "@/server/utils/logger";
import { errorResponse } from "@/server/utils/response";

export async function POST(req: NextRequest) {
  try {
    const result = await AuthController.signupUser(req);
    return result;
  } catch (err) {
    logger.error("Route: POST /api/auth/signup error:", err);
    return errorResponse("Failed to sign up user", 500);
  }
}
