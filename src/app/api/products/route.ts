import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AUTH_COOKIE_NAME, decodeSession } from "@/lib/auth";

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

    const formatted = products.map((p: any) => {
      let images = p.images;
      if (typeof images === "string") {
        try {
          images = JSON.parse(images);
        } catch {
          images = [images];
        }
      }
      if (!Array.isArray(images) || images.length === 0) {
        images = ["https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80"];
      }

      return {
        ...p,
        images,
        tags: Array.isArray(p.tags) ? p.tags : ["thảo dược", "thiên nhiên"],
        rating: p.rating ?? 4.9,
        reviewCount: p.reviewCount ?? 128,
        shortDescription: p.shortDescription || (p.description ? p.description.slice(0, 120) + "..." : "Thảo dược tự nhiên"),
        weight: p.weight || p.unit || "500g",
        isFeatured: p.isFeatured ?? true,
      };
    });

    return NextResponse.json({ success: true, data: formatted });
  } catch (error: any) {
    console.error("Lỗi lấy danh sách sản phẩm:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/products - Thêm sản phẩm mới vào MySQL (Chỉ ADMIN)
export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const cookieMatch = cookieHeader.match(new RegExp(`${AUTH_COOKIE_NAME}=([^;]+)`));
    const session = cookieMatch ? decodeSession(cookieMatch[1]) : null;

    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: Chỉ Quản trị viên (ADMIN) mới có quyền thêm bài thuốc mới.",
        },
        { status: 403 }
      );
    }

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

