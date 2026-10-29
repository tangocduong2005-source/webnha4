"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Product } from "@/types";
import { products, reviews } from "@/data/products";
import { categories } from "@/data/categories";
import { useCart } from "@/lib/store";
import ProductCard from "@/components/storefront/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  ShoppingCart,
  Minus,
  Plus,
  Leaf,
  MapPin,
  Package,
  Tag,
  Heart,
  Share2,
  ChevronRight,
  Check,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  Award,
  CheckCircle2,
  Flame,
  FileText,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const initialProduct = products.find((p) => p.slug === params.slug);
  const [product, setProduct] = useState<Product | undefined>(initialProduct);

  useEffect(() => {
    if (params.slug) {
      fetch(`/api/products/${params.slug}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data) {
            setProduct(json.data);
          }
        })
        .catch((e) => console.error("Lỗi tải chi tiết cây thuốc từ MySQL:", e));
    }
  }, [params.slug]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imgErrorMap, setImgErrorMap] = useState<Record<number, boolean>>({});

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Leaf className="h-16 w-16 text-emerald-800/30 mx-auto mb-4" />
        <h2 className="font-heading text-2xl font-bold mb-2">
          Không tìm thấy bài thuốc
        </h2>
        <p className="text-muted-foreground mb-6">
          Dược liệu bạn tìm kiếm không tồn tại hoặc đã thay đổi đường dẫn.
        </p>
        <Link href="/products">
          <Button className="bg-emerald-800 hover:bg-emerald-900 text-white">
            Quay lại danh mục sản phẩm
          </Button>
        </Link>
      </div>
    );
  }

  const category = categories.find((c) => c.id === product.categoryId);
  const productReviews = reviews.filter((r) => r.productId === product.id);
  const relatedProducts = products
    .filter(
      (p) => p.categoryId === product.categoryId && p.id !== product.id
    )
    .slice(0, 3);

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const currentImage = product.images?.[activeImageIndex];
  const isCurrentImgError = imgErrorMap[activeImageIndex];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-stone-500 mb-8 flex-wrap">
        <Link href="/" className="hover:text-emerald-800 transition-colors">
          Trang chủ
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/products" className="hover:text-emerald-800 transition-colors">
          Cây lá thuốc & Dược liệu
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        {category && (
          <>
            <Link
              href={`/products?category=${category.slug}`}
              className="hover:text-emerald-800 transition-colors"
            >
              {category.name}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
          </>
        )}
        <span className="text-stone-900 font-medium truncate max-w-[220px] sm:max-w-none">
          {product.name}
        </span>
      </nav>

      {/* Product Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-start">
        {/* Images Gallery Column */}
        <div className="space-y-4 lg:sticky lg:top-28">
          {/* Main Large Image */}
          <div className="aspect-square rounded-3xl bg-gradient-to-br from-stone-100 via-emerald-50/30 to-stone-100 flex items-center justify-center relative overflow-hidden border border-stone-200/80 shadow-md group">
            {currentImage && !isCurrentImgError ? (
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={() =>
                  setImgErrorMap((prev) => ({ ...prev, [activeImageIndex]: true }))
                }
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-emerald-800/30 p-6 text-center">
                <Leaf className="h-28 w-28 mb-3" />
                <span className="text-sm font-medium text-stone-500">
                  Dược liệu thiên nhiên chuẩn sạch
                </span>
              </div>
            )}

            {/* Badges Over Image */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {product.isBestSeller && (
                <Badge className="bg-amber-600 text-white text-xs px-3 py-1 shadow-sm border-none flex items-center gap-1 font-semibold">
                  <Flame className="h-3.5 w-3.5 fill-current" />
                  Sản phẩm bán chạy
                </Badge>
              )}
              {discount > 0 && (
                <Badge className="bg-rose-600 text-white text-xs px-3 py-1 shadow-sm border-none font-bold">
                  Tiết kiệm {discount}%
                </Badge>
              )}
              {product.isNew && !product.isBestSeller && (
                <Badge className="bg-emerald-800 text-white text-xs px-3 py-1 shadow-sm border-none font-semibold">
                  Thu hái vụ mới
                </Badge>
              )}
            </div>

            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs font-semibold text-emerald-950 shadow-sm flex items-center gap-1.5 border border-white/50">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span>Chuẩn Đông Y GMP</span>
            </div>
          </div>

          {/* Thumbnails row */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => {
                const isActive = activeImageIndex === idx;
                const isErr = imgErrorMap[idx];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-20 w-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 bg-stone-100 relative ${
                      isActive
                        ? "border-emerald-800 ring-2 ring-emerald-800/20 scale-105 shadow-sm"
                        : "border-stone-200/80 hover:border-emerald-600/60 opacity-80 hover:opacity-100"
                    }`}
                  >
                    {!isErr ? (
                      <img
                        src={img}
                        alt={`${product.name} ảnh ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={() =>
                          setImgErrorMap((prev) => ({ ...prev, [idx]: true }))
                        }
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Leaf className="h-6 w-6 text-emerald-800/40" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Product Details Info Column */}
        <div className="space-y-6">
          <div>
            {category && (
              <Link
                href={`/products?category=${category.slug}`}
                className="inline-block text-xs uppercase tracking-wider text-emerald-800 font-bold bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full mb-3"
              >
                {category.name}
              </Link>
            )}
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-stone-900 leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Rating & Review */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? "text-amber-500 fill-amber-500"
                      : "text-stone-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-stone-800">
              {product.rating} / 5.0
            </span>
            <span className="text-sm text-stone-500">
              ({product.reviewCount} đánh giá từ người dùng)
            </span>
          </div>

          {/* Price Box */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-baseline gap-4 shadow-xs">
            <span className="text-3xl sm:text-4xl font-extrabold text-emerald-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-base sm:text-lg text-stone-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                  Giảm {discount}%
                </span>
              </>
            )}
            <span className="text-xs text-stone-500 ml-auto font-medium">
              (Đã bao gồm thuế)
            </span>
          </div>

          {/* Short Description */}
          <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
            {product.shortDescription || (product.description ? product.description.slice(0, 150) + "..." : "")}
          </p>

          {/* Key Tags */}
          <div className="flex flex-wrap gap-2">
            {(product.tags || []).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs gap-1.5 bg-white border-stone-200 text-stone-700 px-3 py-1 font-medium shadow-2xs"
              >
                <Tag className="h-3 w-3 text-emerald-700" />
                {tag}
              </Badge>
            ))}
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3.5 p-4 rounded-2xl bg-stone-100/70 text-sm border border-stone-200/60">
            <div className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 text-emerald-700 shrink-0" />
              <span>
                <strong>Xuất xứ:</strong> {product.origin}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Package className="h-4 w-4 text-emerald-700 shrink-0" />
              <span>
                <strong>Khối lượng:</strong> {product.weight}
              </span>
            </div>
            {product.ingredients && (
              <div className="col-span-2 flex items-start gap-2.5 pt-2 border-t border-stone-200/80 text-xs text-stone-600">
                <Leaf className="h-3.5 w-3.5 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Thành phần:</strong> {product.ingredients}
                </span>
              </div>
            )}
          </div>

          <Separator />

          {/* Quantity & Action CTA */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-stone-700">Số lượng:</span>
              <div className="flex items-center border border-stone-300 rounded-xl bg-white shadow-2xs">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-stone-600 hover:text-emerald-800"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-bold text-stone-900">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-stone-600 hover:text-emerald-800"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-stone-500">
                (Còn <strong>{product.stock}</strong> gói trong kho)
              </span>
            </div>

            <div className="flex gap-3">
              <Button
                size="lg"
                className={`flex-1 h-13 text-base font-bold shadow-md transition-all duration-300 rounded-xl ${
                  addedToCart
                    ? "bg-green-600 hover:bg-green-600 text-white"
                    : "bg-emerald-800 hover:bg-emerald-900 text-white hover:shadow-lg hover:-translate-y-0.5"
                }`}
                onClick={handleAddToCart}
              >
                {addedToCart ? (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    Đã thêm vào giỏ hàng thành công
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Thêm Vào Giỏ Hàng
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-13 w-13 p-0 rounded-xl border-stone-300"
                title="Lưu vào danh sách yêu thích"
              >
                <Heart className="h-5 w-5 text-stone-500" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-13 w-13 p-0 rounded-xl border-stone-300"
                title="Chia sẻ sản phẩm"
              >
                <Share2 className="h-5 w-5 text-stone-500" />
              </Button>
            </div>
          </div>

          {/* CALLOUT BOX: Cam kết chất lượng chuẩn Đông Y */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-amber-50/40 to-stone-50 border-2 border-emerald-800/20 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 text-emerald-900 font-bold text-sm">
              <Award className="h-5 w-5 text-amber-600" />
              <span>Cam Kết Chất Lượng Chuẩn Đông Y Y Học Cổ Truyền</span>
            </div>
            <ul className="text-xs text-stone-700 space-y-1.5 pl-1 leading-relaxed">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                <span>100% Thu hái từ vùng trồng tự nhiên, chọn lọc rễ thân lá đạt độ tuổi dược tính.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                <span>Quy trình rửa sạch, sấy lạnh / sao vàng hạ thổ GMP, không xông lưu huỳnh (SO2).</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                <span>Đổi trả miễn phí 100% trong 7 ngày nếu sản phẩm có dấu hiệu ẩm mốc, hư hỏng.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                <span>Đồng kiểm hàng trước khi thanh toán, kèm hướng dẫn chi tiết của lương y.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tabs Section Chuẩn Y Khoa */}
      <Tabs defaultValue="usage" className="mb-16">
        <TabsList className="w-full justify-start bg-stone-100/80 h-13 p-1.5 border border-stone-200/80 rounded-2xl flex flex-wrap sm:flex-nowrap gap-1">
          <TabsTrigger
            value="usage"
            className="text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl data-[state=active]:bg-emerald-800 data-[state=active]:text-white transition-all"
          >
            Công dụng & Chủ trị
          </TabsTrigger>
          <TabsTrigger
            value="dosage"
            className="text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl data-[state=active]:bg-emerald-800 data-[state=active]:text-white transition-all"
          >
            Cách dùng & Liều lượng
          </TabsTrigger>
          <TabsTrigger
            value="precautions"
            className="text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl data-[state=active]:bg-emerald-800 data-[state=active]:text-white transition-all"
          >
            Lưu ý & Đối tượng dùng
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl data-[state=active]:bg-emerald-800 data-[state=active]:text-white transition-all"
          >
            Đánh giá từ khách hàng ({productReviews.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Công dụng & Chủ trị */}
        <TabsContent value="usage" className="mt-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-stone-900">
                  Công Dụng & Chủ Trị Dược Lý
                </h3>
                <p className="text-xs text-stone-500">
                  Dựa trên ghi chép y học cổ truyền và nghiên cứu dược lý thực nghiệm
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {product.usage
                .split(". ")
                .filter((item) => item.trim().length > 0)
                .map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/80"
                  >
                    <div className="h-6 w-6 rounded-full bg-emerald-800 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-sm text-stone-800 leading-relaxed font-medium">
                      {item.replace(/\.$/, "")}
                    </span>
                  </div>
                ))}
            </div>

            {/* Description Paragraphs */}
            <div className="pt-4 border-t border-stone-200 space-y-3">
              <h4 className="font-heading text-lg font-bold text-stone-900 flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-800" />
                Mô Tả Nguồn Gốc & Dược Tính Sinh Học
              </h4>
              {product.description.split("\n\n").map((para, idx) => (
                <p key={idx} className="text-sm text-stone-600 leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Cách dùng & Liều lượng */}
        <TabsContent value="dosage" className="mt-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 border border-amber-100">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-stone-900">
                  Phác Đồ Sử Dụng & Liều Lượng Chuẩn
                </h3>
                <p className="text-xs text-stone-500">
                  Hướng dẫn chi tiết nhiệt độ nước, số phút sắc và thời điểm uống trong ngày
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 text-sm text-stone-800 leading-relaxed whitespace-pre-line space-y-3 font-medium">
              {product.dosage}
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs sm:text-sm text-emerald-950 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-800 shrink-0 mt-0.5" />
              <div>
                <strong>Lời khuyên từ Lương y:</strong> Thuốc Nam có tính bình hòa, tác động vào tận căn nguyên gốc rễ của bệnh. Để đạt hiệu quả phục hồi tối ưu, quý khách nên duy trì lộ trình sắc uống liên tục từ 60 đến 90 ngày.
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: Lưu ý & Đối tượng dùng */}
        <TabsContent value="precautions" className="mt-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-rose-50 text-rose-800 flex items-center justify-center shrink-0 border border-rose-100">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-stone-900">
                  Chỉ Định, Kiêng Kỵ & Thận Trọng Khi Dùng
                </h3>
                <p className="text-xs text-stone-500">
                  Đảm bảo an toàn tuyệt đối theo nguyên lý tương sinh tương khắc Đông Y
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-rose-50/40 border border-rose-200/70 text-sm text-stone-800 leading-relaxed whitespace-pre-line space-y-3 font-medium">
              {product.precautions ||
                "• Phụ nữ có thai, người có tạng hàn hoặc đang điều trị bệnh lý đặc biệt nên tham khảo ý kiến thầy thuốc.\n• Không uống thuốc sắc nguội để qua đêm.\n• Đậy kín túi zip sau khi mở, bảo quản nơi thoáng mát, khô ráo tránh ánh nắng trực tiếp."}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1">
                <p className="font-bold text-stone-800">Đối tượng thích hợp:</p>
                <p className="text-stone-600">
                  Người cần cải thiện sức khỏe gan, dạ dày, bồi bổ khí huyết, mất ngủ, cơ thể suy nhược mệt mỏi.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1">
                <p className="font-bold text-stone-800">Bảo quản & Hạn sử dụng:</p>
                <p className="text-stone-600">
                  Hạn dùng 12 tháng kể từ ngày đóng gói sấy lạnh. Để nơi khô ráo, tránh ẩm mốc.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 4: Đánh giá từ khách hàng */}
        <TabsContent value="reviews" className="mt-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-xl font-bold text-stone-900">
                  Phản Hồi Thực Tế Của Người Dùng ({productReviews.length})
                </h3>
                <p className="text-xs text-stone-500">
                  Những trải nghiệm chân thực từ khách hàng đã đặt mua và sử dụng
                </p>
              </div>
            </div>

            {productReviews.length > 0 ? (
              <div className="space-y-3.5">
                {productReviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                          {review.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-stone-900">
                            {review.userName}
                          </p>
                          <span className="text-[11px] text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full font-medium inline-block mt-0.5">
                            ✓ Đã mua hàng chính hãng
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-stone-400">
                        {review.date}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < review.rating
                              ? "text-amber-500 fill-amber-500"
                              : "text-stone-300"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-sm text-stone-700 leading-relaxed italic">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-stone-500 py-12">
                Chưa có đánh giá nào cho dược liệu này. Hãy là người đầu tiên chia sẻ cảm nhận!
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="pt-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-stone-900">
                Các Cây Thuốc Phối Hợp Tốt
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Các thảo dược thường được phối cùng bài thuốc để nhân đôi hiệu quả
              </p>
            </div>
            <Link
              href="/products"
              className="text-sm text-emerald-800 font-bold hover:underline"
            >
              Xem tất cả →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
