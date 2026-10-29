"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { medicinalHerbs as fallbackHerbs } from "@/data/medicinal-herbs";
import { ArrowRight, Sparkles, ShieldCheck, HeartPulse, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";

export default function HerbalSpotlight() {
  const [herbs, setHerbs] = useState<Product[]>(fallbackHerbs);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          // Lấy 4 cây thuốc đặc trưng nếu có trong database
          const matched = fallbackHerbs.map((fb) => {
            const found = json.data.find((p: Product) => p.slug === fb.slug || p.id === fb.id);
            return found || fb;
          });
          setHerbs(matched);
        }
      })
      .catch((e) => console.error("Lỗi đồng bộ 4 cây thuốc từ MySQL:", e));
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <section id="spotlight" className="py-20 bg-gradient-to-b from-stone-50 via-emerald-50/20 to-stone-50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/70 border border-emerald-200/60 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5 text-emerald-700" />
            <span>Tinh Hoa Dược Liệu Cổ Truyền</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 mb-4 tracking-tight">
            Bộ 4 Cây Lá Thuốc Nam Quý
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Tuyển chọn 4 vị thuốc nam tinh hoa từ các vùng dược liệu sạch Việt Nam: 
            <strong> Cà gai leo</strong> (giải độc gan), 
            <strong> Đinh lăng</strong> (bổ khí huyết), 
            <strong> Trà dây</strong> (tiêu viêm loét dạ dày) và 
            <strong> Xáo tam phân</strong> (ức chế tế bào ác tính).
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {herbs.map((herb) => (
            <div
              key={herb.id}
              className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 flex flex-col transition-all duration-300 group"
            >
              {/* Image */}
              <Link
                href={`/products/${herb.slug}`}
                className="relative aspect-[4/3] overflow-hidden bg-stone-100 block"
              >
                <img
                  src={herb.images?.[0] || "https://tse1.mm.bing.net/th/id/OIP.smnBviBS76tZOHlKTXlUEwHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"}
                  alt={herb.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-emerald-900/85 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                  {herb.weight || "500g"}
                </div>
                <div className="absolute top-3 right-3 bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                  <Flame className="h-3 w-3 fill-current" />
                  Đông Y Quý
                </div>
              </Link>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold mb-1">
                    <HeartPulse className="h-3.5 w-3.5" />
                    <span>Dược chất chuẩn sạch</span>
                  </div>
                  <Link href={`/products/${herb.slug}`}>
                    <h3 className="font-heading text-lg font-bold group-hover:text-emerald-800 transition-colors line-clamp-1 text-stone-900">
                      {herb.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-stone-600 line-clamp-2 mt-1.5 leading-relaxed">
                    {herb.shortDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-200/80 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-extrabold text-emerald-900">
                      {formatPrice(herb.price)}
                    </span>
                    {herb.originalPrice && (
                      <span className="text-xs text-stone-400 line-through">
                        {formatPrice(herb.originalPrice)}
                      </span>
                    )}
                  </div>

                  <Link href={`/products/${herb.slug}`} className="block">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs font-bold rounded-xl group-hover:bg-emerald-800 group-hover:text-white transition-all h-9 border-stone-300"
                    >
                      Xem chi tiết bài thuốc
                      <ArrowRight className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Trust Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-emerald-800/40">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
              <ShieldCheck className="h-8 w-8 text-amber-300" />
            </div>
            <div>
              <h4 className="font-heading text-lg sm:text-xl font-bold">
                Cam Kết Dược Liệu Tự Nhiên Thật 100% — Không Chất Bảo Quản
              </h4>
              <p className="text-xs sm:text-sm text-emerald-200/90 mt-1">
                Khai thác đúng tuổi, sơ chế sao sấy theo tiêu chuẩn GMP y học cổ truyền Việt Nam.
              </p>
            </div>
          </div>
          <Link href="/products" className="shrink-0">
            <Button className="bg-white text-emerald-950 hover:bg-emerald-50 font-bold px-7 h-12 rounded-xl text-sm shadow-md transition-all hover:scale-105">
              Xem Toàn Bộ Sản Phẩm
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
