import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// POST /api/orders/track - Tra cứu đơn hàng công khai bằng Mã đơn + Số điện thoại
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderCode, phone } = body;

    if (!orderCode || !phone) {
      return NextResponse.json(
        {
          success: false,
          error: "Vui lòng nhập đầy đủ Mã đơn hàng và Số điện thoại đặt hàng",
        },
        { status: 400 }
      );
    }

    const cleanOrderCode = orderCode.trim();
    const cleanPhone = phone.trim().replace(/[^0-9]/g, "");

    // Tìm đơn hàng theo mã đơn (không phân biệt chữ hoa chữ thường)
    const order = await prisma.order.findFirst({
      where: {
        orderCode: {
          equals: cleanOrderCode,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: `Không tìm thấy đơn hàng có mã "${cleanOrderCode}". Vui lòng kiểm tra lại mã đơn hàng.`,
        },
        { status: 404 }
      );
    }

    // So khớp số điện thoại
    const orderPhoneClean = order.customerPhone.trim().replace(/[^0-9]/g, "");
    if (!orderPhoneClean.endsWith(cleanPhone) && !cleanPhone.endsWith(orderPhoneClean)) {
      return NextResponse.json(
        {
          success: false,
          error: "Số điện thoại không khớp với thông tin người nhận của đơn hàng này.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    console.error("Lỗi tra cứu đơn hàng:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi hệ thống khi tra cứu đơn hàng" },
      { status: 500 }
    );
  }
}

// GET /api/orders/track?code=...&phone=...
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderCode = searchParams.get("code");
    const phone = searchParams.get("phone");

    if (!orderCode || !phone) {
      return NextResponse.json(
        { success: false, error: "Thiếu mã đơn hàng hoặc số điện thoại" },
        { status: 400 }
      );
    }

    const cleanOrderCode = orderCode.trim();
    const cleanPhone = phone.trim().replace(/[^0-9]/g, "");

    const order = await prisma.order.findFirst({
      where: {
        orderCode: {
          equals: cleanOrderCode,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy đơn hàng" },
        { status: 404 }
      );
    }

    const orderPhoneClean = order.customerPhone.trim().replace(/[^0-9]/g, "");
    if (!orderPhoneClean.endsWith(cleanPhone) && !cleanPhone.endsWith(orderPhoneClean)) {
      return NextResponse.json(
        { success: false, error: "Số điện thoại không khớp" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    console.error("Lỗi tra cứu đơn hàng:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi hệ thống" },
      { status: 500 }
    );
  }
}
