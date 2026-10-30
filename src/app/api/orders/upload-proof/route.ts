import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { orderCode, orderId, paymentProof } = await request.json();

    if ((!orderCode && !orderId) || !paymentProof) {
      return NextResponse.json(
        { success: false, error: "Thiếu mã đơn hàng hoặc ảnh chứng từ" },
        { status: 400 }
      );
    }

    const where = orderId ? { id: orderId } : { orderCode };

    const updated = await prisma.order.update({
      where,
      data: {
        paymentProof,
        paymentStatus: "pending_review",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Tải lên chứng từ thanh toán thành công",
      data: updated,
    });
  } catch (error: any) {
    console.error("Lỗi cập nhật chứng từ chuyển khoản:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi cập nhật chứng từ" },
      { status: 500 }
    );
  }
}
