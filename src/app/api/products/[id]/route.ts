import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/products/[id] - Lấy chi tiết sản phẩm theo ID hoặc Slug
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy sản phẩm" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Cập nhật thông tin/giá/tồn kho sản phẩm trong MySQL
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.price !== undefined) updateData.price = parseInt(body.price, 10);
    if (body.originalPrice !== undefined)
      updateData.originalPrice = body.originalPrice
        ? parseInt(body.originalPrice, 10)
        : null;
    if (body.stock !== undefined) updateData.stock = parseInt(body.stock, 10);
    if (body.unit !== undefined) updateData.unit = body.unit;
    if (body.origin !== undefined) updateData.origin = body.origin;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.usage !== undefined) updateData.usage = body.usage;
    if (body.dosage !== undefined) updateData.dosage = body.dosage;
    if (body.precautions !== undefined) updateData.precautions = body.precautions;
    if (body.preservation !== undefined) updateData.preservation = body.preservation;
    if (body.isBestSeller !== undefined) updateData.isBestSeller = Boolean(body.isBestSeller);
    if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;
    if (body.images !== undefined) {
      updateData.images = Array.isArray(body.images) ? body.images : [body.images];
    }

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Lỗi cập nhật sản phẩm:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Xóa sản phẩm khỏi MySQL
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Đã xóa sản phẩm thành công khỏi MySQL",
    });
  } catch (error: any) {
    console.error("Lỗi xóa sản phẩm:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

