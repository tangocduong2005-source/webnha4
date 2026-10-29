import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/orders - Lấy danh sách đơn hàng cho Admin
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: any = {};
    if (status && status !== "all") {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
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

    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    console.error("Lỗi lấy danh sách đơn hàng:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/orders - Khách hàng đặt hàng -> Lưu vào MySQL
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      paymentMethod,
      notes,
      items,
      totalAmount,
    } = body;

    if (!customerName || !customerPhone || !customerAddress || !items?.length) {
      return NextResponse.json(
        { success: false, error: "Vui lòng điền đầy đủ thông tin đặt hàng" },
        { status: 400 }
      );
    }

    // Tạo mã đơn hàng duy nhất theo ngày giờ
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderCode = `DH-${dateStr}-${randomSuffix}`;

    const newOrder = await prisma.order.create({
      data: {
        orderCode,
        customerName,
        customerPhone,
        customerEmail,
        customerAddress,
        paymentMethod: paymentMethod || "cod",
        paymentStatus: paymentMethod === "bank_transfer" ? "unpaid" : "unpaid",
        notes,
        totalAmount: parseInt(totalAmount, 10),
        items: {
          create: items.map((item: any) => ({
            productId: item.productId || item.id,
            quantity: item.quantity,
            price: item.price,
          })),
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

    return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
  } catch (error: any) {
    console.error("Lỗi tạo đơn hàng:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

