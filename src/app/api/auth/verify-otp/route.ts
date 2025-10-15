import { NextRequest, NextResponse } from "next/server";
import { AuthController } from "@/server/modules/auth/auth.controller";
import { logger } from "@/server/utils/logger";

export async function POST(req: NextRequest) {
  try {
    const result = await AuthController.verifyOtp(req);
    return result;
  } catch (err) {
    logger.error("POST /api/auth/verify-otp error:", err);
    return NextResponse.json({ success: false, message: "Failed to verify OTP" });
  }
}
