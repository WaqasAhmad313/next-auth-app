import { NextRequest } from "next/server";
import { logger } from "@/server/utils/logger";
import { errorResponse } from "@/server/utils/response";
import { AuthController } from "@/server/modules/auth/auth.controller";
import { getCurrentUser } from "@/server/api/auth/sessions";

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return errorResponse("Unauthorized", 401);
    }

    // ✅ Pass session user ID to controller
    const result = await AuthController.updateUserById(req, {
      params: { id: user.id },
    });

    return result;
  } catch (err) {
    logger.error("PATCH /api/user/update error:", err);
    return errorResponse("Failed to update user", 500);
  }
}
