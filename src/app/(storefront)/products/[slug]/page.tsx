"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
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
  Truck,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const product = products.find((p) => p.slug === params.slug);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imgErrorMap, setImgErrorMap] = useState<Record<number, boolean>>({});

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Leaf className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="font-heading text-2xl font-bold mb-2">
          Không tìm thấy sản phẩm
        </h2>
        <p className="text-muted-foreground mb-4">
          Dược liệu bạn tìm kiếm không tồn tại hoặc đã thay đổi đường dẫn.
        </p>
        <Link href="/products">
          <Button variant="outline" className="mt-2">
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
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
        <Link href="/" className="hover:text-primary transition-colors">
          Trang chủ
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/products" className="hover:text-primary transition-colors">
          Cây lá thuốc & Dược liệu
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        {category && (
          <>
            <Link
              href={`/products?category=${category.slug}`}
              className="hover:text-primary transition-colors"
            >
              {category.name}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
          </>
        )}
        <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none">
          {product.name}
        </span>
      </nav>

      {/* Product main section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* Images Column */}
        <div className="space-y-4">
          {/* Main Large Image */}
          <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/5 via-accent/30 to-primary/15 flex items-center justify-center relative overflow-hidden border border-border/60 shadow-sm group">
            {currentImage && !isCurrentImgError ? (
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={() =>
                  setImgErrorMap((prev) => ({ ...prev, [activeImageIndex]: true }))
                }
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-primary/30 p-6 text-center">
                <Leaf className="h-28 w-28 mb-3" />
                <span className="text-sm font-medium text-muted-foreground">
                  Hình ảnh dược liệu thiên nhiên
                </span>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {discount > 0 && (
                <Badge className="bg-destructive text-white text-sm px-3 py-1 shadow-sm">
                  Tiết kiệm {discount}%
                </Badge>
              )}
              {product.isNew && (
                <Badge className="bg-[hsl(153,42%,30%)] text-white text-sm px-3 py-1 shadow-sm">
                  Thu hái vụ mới
                </Badge>
              )}
            </div>

            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-medium text-foreground shadow-sm flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>100% Tự Nhiên Chuẩn Sạch</span>
            </div>
          </div>

          {/* Thumbnails Gallery */}
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
                    className={`h-20 w-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-accent/20 relative ${isActive
                        ? "border-primary ring-2 ring-primary/30 scale-105"
                        : "border-border/60 hover:border-primary/50 opacity-80 hover:opacity-100"
                      }`}
                  >
                    {!isErr ? (
                      <img
                        src={img}
                        alt={`${product.name} hình ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={() =>
                          setImgErrorMap((prev) => ({ ...prev, [idx]: true }))
                        }
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Leaf className="h-6 w-6 text-primary/40" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Info Column */}
        <div className="space-y-6">
          <div>
            {category && (
              <Link
                href={`/products?category=${category.slug}`}
                className="inline-block text-xs uppercase tracking-wider text-primary font-semibold hover:underline bg-primary/10 px-2.5 py-1 rounded-md mb-2"
              >
                {category.name}
              </Link>
            )}
            <h1 className="font-heading text-3xl md:text-4xl font-bold mt-1 text-foreground">
              {product.name}
            </h1>
          </div>

          {/* Rating & Review */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(product.rating)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                    }`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-foreground">
              {product.rating} / 5.0
            </span>
            <span className="text-sm text-muted-foreground">
              ({product.reviewCount} đánh giá thực tế từ người dùng)
            </span>
          </div>

          {/* Price Box */}
          <div className="p-4 rounded-xl bg-accent/40 border border-border/50 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-primary">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-base text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="text-xs font-semibold text-destructive bg-destructive/10 px-2 py-0.5 rounded">
                  Giảm {discount}%
                </span>
              </>
            )}
            <span className="text-xs text-muted-foreground ml-auto">
              (Đã bao gồm thuế GTGT)
            </span>
          </div>

          {/* Short Description */}
          <p className="text-muted-foreground leading-relaxed text-sm">
            {product.shortDescription}
          </p>

          {/* Key tags */}
          <div className="flex flex-wrap gap-1.5">
            {product.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs gap-1 bg-white hover:bg-accent/40"
              >
                <Tag className="h-3 w-3 text-primary" />
                {tag}
              </Badge>
            ))}
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-muted/40 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              <span>
                <strong>Xuất xứ:</strong> {product.origin}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-primary shrink-0" />
              <span>
                <strong>Khối lượng:</strong> {product.weight}
              </span>
            </div>
            {product.ingredients && (
              <div className="col-span-2 flex items-start gap-2 pt-1 border-t border-border/40 text-xs text-muted-foreground">
                <Leaf className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>Thành phần:</strong> {product.ingredients}
                </span>
              </div>
            )}
          </div>

          <Separator />

          {/* Quantity & Add to Cart */}
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Số lượng:</span>
              <div className="flex items-center border rounded-lg bg-white">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-muted-foreground"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-muted-foreground"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-muted-foreground">
                (Còn {product.stock} sản phẩm trong kho)
              </span>
            </div>

            <div className="flex gap-3">
              <Button
                size="lg"
                className={`flex-1 h-12 text-base font-semibold shadow-md transition-all ${addedToCart
                    ? "bg-green-600 hover:bg-green-600"
                    : "bg-primary hover:bg-primary/90 text-white"
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
                    Đặt Mua Ngay
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 w-12 p-0"
                title="Lưu vào danh sách yêu thích"
              >
                <Heart className="h-5 w-5 text-muted-foreground" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 w-12 p-0"
                title="Chia sẻ sản phẩm"
              >
                <Share2 className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>
          </div>

          {/* Guarantees Box */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t text-center text-xs text-muted-foreground">
            <div className="p-2 rounded-lg bg-accent/20 flex flex-col items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Chuẩn sạch GMP 100% tự nhiên</span>
            </div>
            <div className="p-2 rounded-lg bg-accent/20 flex flex-col items-center gap-1">
              <Truck className="h-4 w-4 text-primary" />
              <span>Giao hàng toàn quốc kiểm tra trước</span>
            </div>
            <div className="p-2 rounded-lg bg-accent/20 flex flex-col items-center gap-1">
              <RotateCcw className="h-4 w-4 text-primary" />
              <span>Đổi trả 7 ngày nếu không hài lòng</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="usage" className="mb-16">
        <TabsList className="w-full justify-start bg-accent/50 h-12 p-1 border">
          <TabsTrigger value="usage" className="text-sm font-semibold px-6">
            Công dụng & Cách dùng
          </TabsTrigger>
          <TabsTrigger value="description" className="text-sm font-semibold px-6">
            Mô tả chi tiết dược liệu
          </TabsTrigger>
          <TabsTrigger value="reviews" className="text-sm font-semibold px-6">
            Đánh giá khách hàng ({productReviews.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab Công dụng & Cách dùng */}
        <TabsContent value="usage" className="mt-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border shadow-xs space-y-8">
            {/* Công dụng */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Leaf className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Công Dụng & Chủ Trị Của {product.name}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                {product.usage
                  .split(". ")
                  .filter((item) => item.trim().length > 0)
                  .map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-accent/20 border border-border/40"
                    >
                      <div className="h-6 w-6 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-sm text-foreground/90 leading-relaxed font-medium">
                        {item.replace(/\.$/, "")}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <Separator />

            {/* Cách dùng */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Package className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Hướng Dẫn Cách Dùng & Liều Lượng Chuẩn
                </h3>
              </div>

              <div className="p-5 rounded-xl bg-accent/30 border border-primary/20 text-sm text-foreground/90 leading-relaxed whitespace-pre-line space-y-2">
                {product.dosage}
              </div>

              <div className="mt-4 p-4 rounded-xl bg-muted/40 border text-xs text-muted-foreground flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>Lời khuyên từ dược sĩ:</strong> Nên sử dụng dược liệu kiên trì đều đặn hằng ngày từ 2 đến 3 tháng. Phụ nữ mang thai hoặc người có cơ địa đặc biệt nên tham khảo ý kiến chuyên gia trước khi dùng.
                </span>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab Mô tả chi tiết */}
        <TabsContent value="description" className="mt-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border shadow-xs space-y-4">
            <h3 className="font-heading text-xl font-bold text-foreground mb-4">
              Tổng Quan Về Cây Dược Liệu {product.name}
            </h3>
            {product.description.split("\n\n").map((paragraph, index) => (
              <p
                key={index}
                className="text-muted-foreground leading-relaxed text-sm"
              >
                {paragraph}
              </p>
            ))}

            {product.ingredients && (
              <div className="mt-6 p-4 rounded-xl bg-accent/30 border">
                <h4 className="font-semibold text-sm text-primary mb-1">
                  Đặc điểm thành phần hoạt chất:
                </h4>
                <p className="text-sm text-foreground/80">
                  {product.ingredients}
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Tab Đánh giá */}
        <TabsContent value="reviews" className="mt-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border shadow-xs space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-xl font-bold">
                Phản Hồi Từ Khách Hàng Đã Sử Dụng ({productReviews.length})
              </h3>
            </div>

            {productReviews.length > 0 ? (
              <div className="space-y-3">
                {productReviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-4 rounded-xl bg-accent/20 border border-border/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-full bg-primary/15 flex items-center justify-center text-primary text-sm font-bold">
                          {review.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">
                            {review.userName}
                          </p>
                          <span className="text-[11px] text-green-700 bg-green-100 px-2 py-0.5 rounded-full inline-block">
                            Đã mua hàng chính hãng
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {review.date}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${i < review.rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                            }`}
                        />
                      ))}
                    </div>

                    <p className="text-sm text-foreground/80 leading-relaxed">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-10">
                Chưa có đánh giá nào cho dược liệu này. Hãy là người đầu tiên chia sẻ cảm nhận!
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-2xl font-bold">
              Các Cây Thuốc Liên Quan
            </h2>
            <Link
              href="/products"
              className="text-sm text-primary font-medium hover:underline"
            >
              Xem tất cả dược liệu →
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
