// export type ApiResponse<T = unknown> = {
//   success: boolean;
//   message: string;
//   data?: T;
//   error?: unknown;
// };

// export const successResponse = <T>(
//   message: string,
//   data?: T
// ): ApiResponse<T> => ({
//   success: true,
//   message,
//   data,
// });

// export const errorResponse = (
//   message: string,
//   error?: unknown
// ): ApiResponse => ({
//   success: false,
//   message,
//   error: error instanceof Error ? error.message : error,
// });


import { NextResponse } from "next/server";

export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  error?: unknown;
};

function toNextResponse<T>(body: ApiResponse<T>, status = 200) {
  try {
    // Check if running in Next.js Route Handler context (server)
    if (typeof NextResponse !== "undefined") {
      return NextResponse.json(body, { status });
    }
  } catch {
    // fallback for environments where NextResponse isn’t available
  }
  return body;
}

export const successResponse = <T>(
  message: string,
  data?: T,
  status = 200
): ApiResponse<T> | Response => {
  const response: ApiResponse<T> = { success: true, message, data };
  return toNextResponse(response, status);
};

export const errorResponse = (
  message: string,
  error?: unknown,
  status = 400
): ApiResponse | Response => {
  const response: ApiResponse = {
    success: false,
    message,
    error: error instanceof Error ? error.message : error,
  };
  return toNextResponse(response, status);
};
