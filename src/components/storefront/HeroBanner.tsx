"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Leaf,
  Sparkles,
  Award,
  HeartHandshake,
  CheckCircle2,
} from "lucide-react";

export default function HeroBanner() {
  const [spotlightImage, setSpotlightImage] = useState(
    "https://tse1.mm.bing.net/th/id/OIP.smnBviBS76tZOHlKTXlUEwHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
  );
  const [spotlightName, setSpotlightName] = useState(
    "Cà Gai Leo Sấy Khô Chuẩn GMP"
  );

  useEffect(() => {
    fetch("/api/products/ca-gai-leo")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          const img = json.data.images?.[0];
          if (img) setSpotlightImage(img);
          if (json.data.name) setSpotlightName(json.data.name);
        }
      })
      .catch(() => {});
  }, []);
  return (
    <section className="relative overflow-hidden">
      {/* Hero background with deep emerald to teal gradient */}
      <div className="gradient-hero min-h-[620px] lg:min-h-[680px] relative flex items-center">
        {/* Soft decorative botanical glows */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.06),transparent_60%)]" />

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-white animate-fade-in">
              {/* Badges certification pills */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-medium text-emerald-100 shadow-xs">
                  <Leaf className="h-3.5 w-3.5 text-emerald-300" />
                  100% Thảo Dược Tự Nhiên
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-medium text-emerald-100 shadow-xs">
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  Thu Hái Thủ Công
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-medium text-emerald-100 shadow-xs">
                  <Award className="h-3.5 w-3.5 text-emerald-300" />
                  Chuẩn Đông Y Cổ Truyền
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                Dược Liệu Quý <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-amber-200 to-emerald-100">
                  Thuận Tự Nhiên
                </span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-white/85 max-w-xl leading-relaxed font-light">
                Chắt lọc tinh hoa từ các vùng dược thảo trứ danh Việt Nam: Cà gai leo, Đinh lăng nếp, Trà dây tuyết Sapa và Xáo tam phân Hòn Hèo. Sơ chế sấy sạch chuẩn GMP, an toàn cho cả gia đình.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href="/products">
                  <Button
                    size="lg"
                    className="bg-white text-emerald-950 hover:bg-emerald-50 font-bold px-8 h-13 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 text-base"
                  >
                    Khám Phá Cây Thuốc
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/#spotlight">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 backdrop-blur-xs font-medium h-13 px-6 rounded-xl transition-all duration-300"
                  >
                    Bộ 4 Thảo Dược Quý
                  </Button>
                </Link>
              </div>

              {/* Micro stats counter */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/15 max-w-md">
                <div>
                  <p className="font-heading text-2xl sm:text-3xl font-bold text-white">100%</p>
                  <p className="text-xs text-emerald-200/80">Dược liệu sạch</p>
                </div>
                <div>
                  <p className="font-heading text-2xl sm:text-3xl font-bold text-white">15.000+</p>
                  <p className="text-xs text-emerald-200/80">Khách tin dùng</p>
                </div>
                <div>
                  <p className="font-heading text-2xl sm:text-3xl font-bold text-white">24/7</p>
                  <p className="text-xs text-emerald-200/80">Tư vấn Đông Y</p>
                </div>
              </div>
            </div>

            {/* Right Showcase Card Column */}
            <div className="lg:col-span-5 relative hidden lg:block">
              {/* Glass spotlight feature card */}
              <div className="relative rounded-3xl p-6 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl space-y-5 hover-lift">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Dược Liệu Tiêu Biểu Hôm Nay</span>
                  </div>
                  <span className="text-[11px] bg-amber-500/20 text-amber-200 border border-amber-400/30 px-2 py-0.5 rounded-full font-semibold">
                    Được Tìm Kiếm Nhiều
                  </span>
                </div>

                {/* Split mini preview */}
                <div className="aspect-[16/10] rounded-2xl overflow-hidden relative shadow-inner bg-black/20">
                  <img
                    src={spotlightImage}
                    alt={spotlightName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                    <p className="text-xs text-emerald-300 font-medium">Bảo vệ & Phục hồi tế bào gan</p>
                    <h3 className="font-heading text-lg font-bold">{spotlightName}</h3>
                    <p className="text-xs text-white/80 line-clamp-1 mt-0.5">Vùng dược liệu Quảng Nam • Giàu hoạt chất Glycoalkaloid</p>
                  </div>
                </div>

                {/* Key check bullets */}
                <div className="space-y-2 text-xs text-white/90">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Thu hoạch đúng tuổi, sấy lạnh giữ nguyên dược tính</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Hỗ trợ hạ men gan, giải rượu bia, tăng cường đề kháng</span>
                  </div>
                </div>

                <Link href="/products/ca-gai-leo" className="block">
                  <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold h-11 rounded-xl shadow-md gap-2">
                    <span>Xem Bài Thuốc Chi Tiết</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust bar at bottom */}
      <div className="bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="container mx-auto px-4 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="h-11 w-11 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">100% Tự Nhiên</p>
                <p className="text-xs text-muted-foreground">Không chất bảo quản</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="h-11 w-11 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 border border-amber-100">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Chuẩn Sạch GMP</p>
                <p className="text-xs text-muted-foreground">Kiểm định dược chất</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="h-11 w-11 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Giao Toàn Quốc</p>
                <p className="text-xs text-muted-foreground">Kiểm tra trước khi trả</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="h-11 w-11 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 border border-amber-100">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Tư Vấn Đông Y</p>
                <p className="text-xs text-muted-foreground">Đội ngũ lương y tận tâm</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
