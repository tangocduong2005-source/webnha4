"use client";

import Link from "next/link";
import { useState } from "react";
import { Product } from "@/types";
import { useCart } from "@/lib/store";
import { Star, ShoppingCart, Leaf, Tag, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [imgError, setImgError] = useState(false);

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

  return (
    <div className="group rounded-2xl overflow-hidden bg-white border border-border/50 hover-lift shadow-sm flex flex-col h-full transition-all">
      {/* Image Container */}
      <Link href={`/products/${product.slug}`} className="block relative overflow-hidden">
        <div className="aspect-[4/3] bg-gradient-to-br from-primary/5 via-accent/30 to-primary/15 flex items-center justify-center relative overflow-hidden">
          {imageUrl && !imgError ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <Leaf className="h-20 w-20 text-primary/25 group-hover:scale-110 transition-transform duration-500" />
          )}

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {discount > 0 && (
              <Badge className="bg-destructive text-white text-xs font-semibold px-2 py-0.5 shadow-sm">
                -{discount}%
              </Badge>
            )}
            {product.isNew && (
              <Badge className="bg-[hsl(153,42%,30%)] text-white text-xs font-semibold px-2 py-0.5 shadow-sm">
                Mới
              </Badge>
            )}
          </div>

          {/* Origin Badge */}
          {product.origin && (
            <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 z-10">
              <MapPin className="h-3 w-3 text-primary-foreground" />
              <span className="truncate max-w-[130px]">{product.origin}</span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-medium"
              >
                <Tag className="h-2.5 w-2.5" />
                {tag}
              </span>
            ))}
            {product.weight && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground ml-auto">
                {product.weight}
              </span>
            )}
          </div>

          {/* Name */}
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-heading text-lg font-semibold group-hover:text-primary transition-colors line-clamp-1 title-line">
              {product.name}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {product.shortDescription}
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
                    i < Math.floor(product.rating)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              {product.rating} ({product.reviewCount})
            </span>
          </div>

          {/* Price & Action */}
          <div className="flex items-end justify-between pt-1 border-t border-border/40">
            <div>
              <p className="text-lg font-bold text-primary leading-none">
                {formatPrice(product.price)}
              </p>
              {product.originalPrice && (
                <p className="text-xs text-muted-foreground line-through mt-0.5">
                  {formatPrice(product.originalPrice)}
                </p>
              )}
            </div>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-3 gap-1 shadow-xs"
              onClick={(e) => {
                e.preventDefault();
                addToCart(product);
              }}
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Chọn</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
