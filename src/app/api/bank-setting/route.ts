import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/bank-setting - Lấy thông tin tài khoản ngân hàng của cửa hàng
export async function GET() {
  try {
    let setting = await prisma.bankSetting.findUnique({
      where: { id: "default" },
    });

    if (!setting) {
      setting = await prisma.bankSetting.create({
        data: {
          id: "default",
          bankName: "Ngân hàng Quân Đội (MB Bank)",
          bankCode: "MB",
          accountNumber: "0964001203",
          accountHolder: "TA NGOC DUONG",
          isActive: true,
          qrTemplate: "compact2",
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: setting,
    });
  } catch (error: any) {
    console.error("Lỗi lấy thông tin ngân hàng:", error);
    // Fallback nếu có lỗi DB
    return NextResponse.json({
      success: true,
      data: {
        id: "default",
        bankName: "Ngân hàng Quân Đội (MB Bank)",
        bankCode: "MB",
        accountNumber: "0964001203",
        accountHolder: "TA NGOC DUONG",
        isActive: true,
        qrTemplate: "compact2",
      },
    });
  }
}
