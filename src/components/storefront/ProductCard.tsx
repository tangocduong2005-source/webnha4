"use client";

import Link from "next/link";
import { useState } from "react";
import { Product } from "@/types";
import { useCart } from "@/lib/store";
import { Star, ShoppingCart, Leaf, Tag, MapPin, Check, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [imgError, setImgError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  const imageUrl = product.images?.[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div className="group rounded-2xl overflow-hidden bg-white border border-stone-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full relative">
      {/* Image Container */}
      <Link href={`/products/${product.slug}`} className="block relative overflow-hidden">
        <div className="aspect-[4/3] bg-gradient-to-br from-stone-100 via-emerald-50/40 to-stone-100 flex items-center justify-center relative overflow-hidden">
          {imageUrl && !imgError ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <Leaf className="h-20 w-20 text-emerald-800/20 group-hover:scale-110 transition-transform duration-500" />
          )}

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.isBestSeller && (
              <Badge className="bg-amber-600 hover:bg-amber-600 text-white text-[11px] font-semibold px-2.5 py-0.5 shadow-sm border-none flex items-center gap-1">
                <Flame className="h-3 w-3 fill-current" />
                <span>Bán Chạy</span>
              </Badge>
            )}
            {discount > 0 && (
              <Badge className="bg-rose-600 hover:bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 shadow-sm border-none">
                -{discount}%
              </Badge>
            )}
            {product.isNew && !product.isBestSeller && (
              <Badge className="bg-emerald-700 hover:bg-emerald-700 text-white text-[11px] font-semibold px-2 py-0.5 shadow-sm border-none">
                Vụ Mới
              </Badge>
            )}
          </div>

          {/* Origin Badge */}
          {product.origin && (
            <div className="absolute bottom-2.5 right-2.5 bg-black/65 backdrop-blur-md text-white text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1 z-10 shadow-xs">
              <MapPin className="h-3 w-3 text-emerald-300" />
              <span className="truncate max-w-[140px] font-medium">{product.origin}</span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Tags & Weight */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(product.tags || []).slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 font-medium"
              >
                <Tag className="h-2.5 w-2.5 text-emerald-600" />
                {tag}
              </span>
            ))}
            {product.weight && (
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 ml-auto font-medium">
                {product.weight}
              </span>
            )}
          </div>

          {/* Name */}
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-heading text-lg font-bold group-hover:text-emerald-800 transition-colors line-clamp-1 title-line text-stone-900">
              {product.name}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {product.shortDescription || (product.description ? product.description.slice(0, 100) + "..." : "")}
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.floor(product.rating || 5)
                      ? "text-amber-500 fill-amber-500"
                      : "text-stone-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-stone-600 font-medium">
              {(product.rating || 5.0).toFixed(1)} ({product.reviewCount || 100} đánh giá)
            </span>
          </div>

          {/* Price & Action */}
          <div className="flex items-end justify-between pt-2 border-t border-stone-200/70">
            <div>
              <p className="text-lg sm:text-xl font-extrabold text-emerald-900 leading-none">
                {formatPrice(product.price)}
              </p>
              {product.originalPrice && (
                <p className="text-xs text-stone-400 line-through mt-1">
                  {formatPrice(product.originalPrice)}
                </p>
              )}
            </div>

            <Button
              size="sm"
              className={`h-9 px-3.5 gap-1.5 rounded-xl font-semibold shadow-xs transition-all duration-200 ${
                justAdded
                  ? "bg-green-600 hover:bg-green-600 text-white"
                  : "bg-emerald-800 hover:bg-emerald-900 text-white"
              }`}
              onClick={handleQuickAdd}
            >
              {justAdded ? (
                <>
                  <Check className="h-4 w-4" />
                  <span className="text-xs">Đã thêm</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  <span className="text-xs">Thêm vào giỏ</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
