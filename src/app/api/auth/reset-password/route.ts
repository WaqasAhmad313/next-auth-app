import { NextRequest } from "next/server";
import { AuthController } from "@/server/modules/auth/auth.controller";
import { logger } from "@/server/utils/logger";
import { errorResponse } from "@/server/utils/response";

export async function POST(req: NextRequest) {
  try {
    const result = await AuthController.resetPassword(req);
    return result;
  } catch (err) {
    logger.error("POST /api/auth/reset-password error:", err);
    return errorResponse("Failed to process password reset request", 500);
  }
}
