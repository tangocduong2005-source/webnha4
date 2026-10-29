import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, decodeSession } from "@/lib/auth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Kiểm tra các route quản trị /admin
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  const cookie = req.cookies.get(AUTH_COOKIE_NAME);
  const session = cookie?.value ? decodeSession(cookie.value) : null;

  // 1. Trường hợp chưa đăng nhập
  if (!session) {
    if (isAdminApi) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          message: "Vui lòng đăng nhập bằng tài khoản Quản trị viên để thực hiện thao tác.",
        },
        { status: 401 }
      );
    }

    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    loginUrl.searchParams.set("error", "unauthorized");
    return NextResponse.redirect(loginUrl);
  }

  // 2. Trường hợp đã đăng nhập nhưng KHÔNG CÓ QUYỀN ADMIN (role === 'USER')
  if (session.role !== "ADMIN") {
    if (isAdminApi) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden",
          message: "Bạn không có quyền quản trị viên (ADMIN) để thao tác dữ liệu này.",
        },
        { status: 403 }
      );
    }

    // Chuyển hướng về trang thông báo lỗi 403 Forbidden
    const forbiddenUrl = new URL("/403", req.url);
    forbiddenUrl.searchParams.set("role", session.role);
    forbiddenUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(forbiddenUrl);
  }

  // 3. Đã đăng nhập và có quyền ADMIN hợp lệ
  const res = NextResponse.next();
  // Đính kèm thông tin admin vào header nội bộ nếu cần
  res.headers.set("x-user-id", session.id);
  res.headers.set("x-user-role", session.role);
  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
