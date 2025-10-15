import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";
import { logger } from "@/server/utils/logger";

export async function getSession() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      logger.warn("No active session found");
      return null;
    }
    return session;
  } catch (error) {
    logger.error("Error fetching session:", error);
    return null; 
  }
}

export async function getCurrentUser(): Promise<{
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
} | null> {
  try {
    const session = await getSession();
    if (!session?.user) {
      logger.warn("No user found in session");
      return null;
    }

    const { id, name, email, image } = session.user;
    return { id, name, email, image };
  } catch (error) {
    logger.error("Error fetching current user:", error);
    return null;
  }
}
