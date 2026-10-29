import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, decodeSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get(AUTH_COOKIE_NAME);
  if (!cookie?.value) {
    return NextResponse.json({ success: false, user: null });
  }

  const user = decodeSession(cookie.value);
  if (!user) {
    return NextResponse.json({ success: false, user: null });
  }

  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
    },
  });
}
