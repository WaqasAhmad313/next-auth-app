import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { logger } from "@/server/utils/logger";
import { errorResponse } from "@/server/utils/response";
import { AuthController } from "@/server/modules/auth/auth.controller";
import { authOptions } from "../../auth/authOptions";

export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return errorResponse("Unauthorized", 401);
    }
    console.log("Session user ID:", session.user.id);

    const result = await AuthController.getUserById(_req, {
      params: { id: session.user.id },
    });

    return result;
  } catch (err) {
    logger.error("GET /api/user/me error:", err);
    return errorResponse("Failed to fetch user", 500);
  }
}
