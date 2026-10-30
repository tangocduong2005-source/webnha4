import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, decodeSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/admin/customers - Lấy danh sách khách hàng tổng hợp từ Đơn hàng & Tài khoản
export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    const user = decodeSession(sessionToken || "");

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Bạn không có quyền truy cập quản trị" },
        { status: 403 }
      );
    }

    // Lấy tất cả đơn hàng để tổng hợp thông tin khách
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    });

    const customerMap = new Map<string, any>();

    orders.forEach((order) => {
      const key = order.customerPhone.trim() || order.customerEmail || order.customerName;
      if (!customerMap.has(key)) {
        customerMap.set(key, {
          id: order.id,
          name: order.customerName,
          phone: order.customerPhone,
          email: order.customerEmail || "",
          address: order.customerAddress,
          totalOrders: 1,
          totalSpent: order.totalAmount,
          lastOrderDate: order.createdAt,
          lastOrderCode: order.orderCode,
        });
      } else {
        const existing = customerMap.get(key);
        existing.totalOrders += 1;
        existing.totalSpent += order.totalAmount;
      }
    });

    const customers = Array.from(customerMap.values());

    return NextResponse.json({
      success: true,
      data: customers,
    });
  } catch (error: any) {
    console.error("Lỗi lấy danh sách khách hàng:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi máy chủ" },
      { status: 500 }
    );
  }
}
