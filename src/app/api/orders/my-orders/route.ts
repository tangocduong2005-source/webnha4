import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, decodeSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/orders/my-orders - Lấy danh sách đơn hàng của khách hàng đã đăng nhập
export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: "Vui lòng đăng nhập để xem lịch sử đơn hàng" },
        { status: 401 }
      );
    }

    const sessionUser = decodeSession(sessionToken);
    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: "Phiên làm việc hết hạn, vui lòng đăng nhập lại" },
        { status: 401 }
      );
    }

    // Tìm các đơn hàng liên kết theo userId hoặc theo customerPhone / customerEmail
    const whereConditions: any[] = [];
    if (sessionUser.id) {
      whereConditions.push({ userId: sessionUser.id });
    }
    if (sessionUser.email) {
      whereConditions.push({ customerEmail: sessionUser.email });
    }
    if (sessionUser.phone) {
      whereConditions.push({ customerPhone: sessionUser.phone });
    }

    const orders = await prisma.order.findMany({
      where: whereConditions.length > 0 ? { OR: whereConditions } : { userId: sessionUser.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: orders,
      user: {
        id: sessionUser.id,
        name: sessionUser.name,
        email: sessionUser.email,
        phone: sessionUser.phone,
      },
    });
  } catch (error: any) {
    console.error("Lỗi lấy lịch sử đơn hàng cá nhân:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi máy chủ khi lấy danh sách đơn hàng" },
      { status: 500 }
    );
  }
}

