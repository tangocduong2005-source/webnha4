import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, decodeSession } from "@/lib/auth";

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
      paymentProof,
    } = body;

    if (!customerName || !customerPhone || !customerAddress || !items?.length) {
      return NextResponse.json(
        { success: false, error: "Vui lòng điền đầy đủ thông tin đặt hàng" },
        { status: 400 }
      );
    }

    // Nhận diện người dùng nếu đã đăng nhập
    let userId = body.userId || null;
    try {
      const cookieStore = await cookies();
      const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME)?.value;
      if (sessionCookie) {
        const sessionUser = decodeSession(sessionCookie);
        if (sessionUser?.id) {
          userId = sessionUser.id;
        }
      }
    } catch {
      // Bỏ qua nếu không đọc được cookie
    }

    // Đồng bộ mã đơn hàng nếu phía client đã tạo để khớp với mã VietQR
    let orderCode = body.orderCode?.trim();
    if (!orderCode) {
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      orderCode = `DH-${dateStr}-${randomSuffix}`;
    }

    // Kiểm tra trùng mã đơn
    const existing = await prisma.order.findUnique({
      where: { orderCode },
    });
    if (existing) {
      orderCode = `${orderCode}-${Math.floor(100 + Math.random() * 900)}`;
    }

    const newOrder = await prisma.order.create({
      data: {
        orderCode,
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        customerAddress,
        paymentMethod: paymentMethod || "cod",
        paymentStatus: paymentMethod === "bank_transfer" ? (paymentProof ? "pending_review" : "unpaid") : "unpaid",
        paymentProof: paymentProof || null,
        notes: notes || null,
        totalAmount: parseInt(totalAmount, 10),
        userId,
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

