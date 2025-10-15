import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Optional: you can add logic here, or just let all requests pass
  return NextResponse.next();
}
