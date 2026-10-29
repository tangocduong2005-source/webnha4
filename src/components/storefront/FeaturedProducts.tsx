"use client";

import Link from "next/link";
import { products } from "@/data/products";
import ProductCard from "./ProductCard";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FeaturedProducts() {
  const featuredProducts = products.filter((p) => p.isFeatured);

  return (
    <section className="py-16 bg-accent/30">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
              Sản Phẩm Nổi Bật
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Những loại thảo dược được yêu thích nhất, được hàng nghìn khách
              hàng tin dùng
            </p>
          </div>
          <Link href="/products" className="hidden md:block">
            <Button variant="outline" className="group">
              Xem tất cả
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="md:hidden text-center mt-8">
          <Link href="/products">
            <Button variant="outline" className="group">
              Xem tất cả sản phẩm
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
