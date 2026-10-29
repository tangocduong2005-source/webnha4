import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/products - Lấy danh sách sản phẩm từ MySQL
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("category");
    const search = searchParams.get("search");

    const where: any = { isActive: true };
    if (categoryId && categoryId !== "all") {
      where.categoryId = categoryId;
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    console.error("Lỗi lấy danh sách sản phẩm:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/products - Thêm sản phẩm mới vào MySQL (Dành cho Admin)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      price,
      originalPrice,
      stock,
      unit,
      origin,
      images,
      description,
      usage,
      dosage,
      precautions,
      preservation,
      categoryId,
      isBestSeller,
    } = body;

    if (!name || !price) {
      return NextResponse.json(
        { success: false, error: "Tên và giá sản phẩm là bắt buộc" },
        { status: 400 }
      );
    }

    // Tự sinh slug nếu chưa có
    const productSlug =
      slug ||
      name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const newProduct = await prisma.product.create({
      data: {
        name,
        slug: productSlug,
        price: parseInt(price, 10),
        originalPrice: originalPrice ? parseInt(originalPrice, 10) : null,
        stock: parseInt(stock ?? 0, 10),
        unit: unit || "gói",
        origin: origin || "Việt Nam",
        images: Array.isArray(images) ? images : [images || "/placeholder.jpg"],
        description,
        usage,
        dosage,
        precautions,
        preservation,
        categoryId: categoryId || null,
        isBestSeller: Boolean(isBestSeller),
      },
    });

    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error: any) {
    console.error("Lỗi thêm sản phẩm:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

