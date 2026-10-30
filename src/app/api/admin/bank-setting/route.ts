import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AUTH_COOKIE_NAME, decodeSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/admin/bank-setting
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

    return NextResponse.json({ success: true, data: setting });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT /api/admin/bank-setting
export async function PUT(req: NextRequest) {
  try {
    // Kiểm tra quyền Admin
    const cookie = req.cookies.get(AUTH_COOKIE_NAME);
    const session = cookie?.value ? decodeSession(cookie.value) : null;
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Chỉ Quản trị viên (ADMIN) mới có quyền cập nhật tài khoản ngân hàng." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { bankName, bankCode, accountNumber, accountHolder, isActive, qrTemplate } = body;

    if (!bankName || !bankCode || !accountNumber || !accountHolder) {
      return NextResponse.json(
        { success: false, error: "Vui lòng điền đầy đủ tên ngân hàng, mã ngân hàng, số tài khoản và tên chủ tài khoản." },
        { status: 400 }
      );
    }

    const updated = await prisma.bankSetting.upsert({
      where: { id: "default" },
      update: {
        bankName: bankName.trim(),
        bankCode: bankCode.trim().toUpperCase(),
        accountNumber: accountNumber.trim(),
        accountHolder: accountHolder.trim().toUpperCase(),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        qrTemplate: qrTemplate || "compact2",
      },
      create: {
        id: "default",
        bankName: bankName.trim(),
        bankCode: bankCode.trim().toUpperCase(),
        accountNumber: accountNumber.trim(),
        accountHolder: accountHolder.trim().toUpperCase(),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        qrTemplate: qrTemplate || "compact2",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Cập nhật tài khoản ngân hàng thành công!",
      data: updated,
    });
  } catch (error: any) {
    console.error("Lỗi cập nhật cấu hình ngân hàng:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
