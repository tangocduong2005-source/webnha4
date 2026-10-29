"use client";

import Link from "next/link";
import { medicinalHerbs } from "@/data/medicinal-herbs";
import { ArrowRight, Sparkles, ShieldCheck, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HerbalSpotlight() {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white via-accent/20 to-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Tinh Hoa Dược Liệu Cổ Truyền</span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Bộ 4 Cây Lá Thuốc Nam Quý
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Tuyển chọn 4 vị thuốc nam tinh hoa từ các vùng dược liệu sạch Việt Nam: 
            <strong> Cà gai leo</strong> (bảo vệ gan), 
            <strong> Đinh lăng</strong> (bổ khí huyết), 
            <strong> Trà dây</strong> (khắc tinh đau dạ dày) và 
            <strong> Xáo tam phân</strong> (dược liệu phòng ngừa u bướu).
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {medicinalHerbs.map((herb) => (
            <div
              key={herb.id}
              className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm hover:shadow-md hover-lift flex flex-col transition-all group"
            >
              {/* Image */}
              <Link
                href={`/products/${herb.slug}`}
                className="relative aspect-[4/3] overflow-hidden bg-accent/30 block"
              >
                <img
                  src={herb.images[0]}
                  alt={herb.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-2.5 left-2.5 bg-primary/90 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-xs">
                  {herb.weight}
                </div>
              </Link>

              {/* Content */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-primary font-medium mb-1">
                    <HeartPulse className="h-3.5 w-3.5" />
                    <span>Dược liệu chuẩn sạch</span>
                  </div>
                  <Link href={`/products/${herb.slug}`}>
                    <h3 className="font-heading text-base font-bold group-hover:text-primary transition-colors line-clamp-1">
                      {herb.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1.5 leading-relaxed">
                    {herb.shortDescription}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/40 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-base font-bold text-primary">
                      {formatPrice(herb.price)}
                    </span>
                    {herb.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatPrice(herb.originalPrice)}
                      </span>
                    )}
                  </div>

                  <Link href={`/products/${herb.slug}`} className="block">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs font-semibold group-hover:bg-primary group-hover:text-white transition-colors h-8"
                    >
                      Xem chi tiết công dụng
                      <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Trust Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-primary text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-7 w-7 text-[hsl(80,60%,70%)]" />
            </div>
            <div>
              <h4 className="font-heading text-lg font-bold">
                Cam Kết Dược Liệu Thật 100% — Không Chất Bảo Quản
              </h4>
              <p className="text-xs sm:text-sm text-white/80 mt-0.5">
                Thu hái đúng độ tuổi, sơ chế sao sấy theo tiêu chuẩn GMP y học cổ truyền.
              </p>
            </div>
          </div>
          <Link href="/products">
            <Button className="bg-white text-primary hover:bg-white/90 font-semibold px-6 shrink-0 h-10 text-sm">
              Xem Toàn Bộ Sản Phẩm
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

