import { z } from "zod";

// Define schema for all environment variables
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),
  JWT_ACCESS_SECRET: z.string().min(1, "JWT_ACCESS_SECRET is required"),
  JWT_REFRESH_SECRET: z.string().min(1, "JWT_REFRESH_SECRET is required"),
  NEXTAUTH_URL: z.string().url(),
  RESEND_API_KEY: z.string().min(1, "Resend API key is missing"),
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is missing"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is missing"),
});

// Parse and validate
const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error("❌ Invalid environment variables:", env.error.flatten().fieldErrors);
  throw new Error("Invalid environment variables. Please check your .env file.");
}

export const ENV = env.data;
