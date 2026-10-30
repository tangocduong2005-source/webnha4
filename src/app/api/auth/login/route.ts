import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AUTH_COOKIE_NAME, encodeSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Vui lòng nhập đầy đủ email và mật khẩu." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Tìm người dùng trong MySQL database
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user || user.password !== password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email hoặc mật khẩu không chính xác. Vui lòng thử lại.",
        },
        { status: 401 }
      );
    }

    const authUser = {
      id: user.id,
      email: user.email,
      name: user.name || "Người dùng",
      role: user.role,
      phone: user.phone,
    };

    const token = encodeSession(authUser);

    const response = NextResponse.json({
      success: true,
      message: "Đăng nhập thành công!",
      user: authUser,
    });

    // Thiết lập Cookie phiên làm việc an toàn
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 ngày
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    return NextResponse.json(
      { success: false, message: "Đã có lỗi xảy ra từ máy chủ." },
      { status: 500 }
    );
  }
}

