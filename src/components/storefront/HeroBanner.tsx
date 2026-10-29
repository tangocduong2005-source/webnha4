import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Truck, Leaf, Award } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden">
      {/* Hero background */}
      <div className="gradient-hero min-h-[600px] lg:min-h-[650px] relative">
        <div className="gradient-hero-overlay absolute inset-0" />

        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-56 h-56 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-40 right-[20%] animate-float">
          <Leaf className="h-16 w-16 text-white/10 rotate-45" />
        </div>
        <div className="absolute bottom-32 right-[30%] animate-float" style={{ animationDelay: "2s" }}>
          <Leaf className="h-10 w-10 text-white/10 -rotate-12" />
        </div>

        <div className="container mx-auto px-4 h-full relative z-10">
          <div className="flex items-center min-h-[600px] lg:min-h-[650px]">
            <div className="max-w-2xl space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm">
                <Leaf className="h-4 w-4" />
                <span>100% Dược liệu thiên nhiên</span>
              </div>

              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Sức Khỏe Từ
                <br />
                <span className="text-[hsl(80,60%,70%)]">Thiên Nhiên</span>
              </h1>

              <p className="text-lg text-white/80 max-w-lg leading-relaxed">
                Khám phá kho tàng dược liệu quý của Việt Nam. Cây thuốc tươi,
                dược liệu khô, trà thảo mộc và bài thuốc nam gia truyền — tất
                cả đều có nguồn gốc rõ ràng, an toàn cho sức khỏe.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link href="/products">
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 font-semibold px-8 h-12 text-base"
                  >
                    Khám phá ngay
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/products?featured=true">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 h-12 text-base"
                  >
                    Sản phẩm nổi bật
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-4">
                <div>
                  <p className="text-2xl font-bold text-white">500+</p>
                  <p className="text-sm text-white/60">Sản phẩm</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">10.000+</p>
                  <p className="text-sm text-white/60">Khách hàng</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">50+</p>
                  <p className="text-sm text-white/60">Vùng dược liệu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 justify-center">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Leaf className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">100% Tự Nhiên</p>
                <p className="text-xs text-muted-foreground">
                  Không hóa chất
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Giao Hàng Toàn Quốc</p>
                <p className="text-xs text-muted-foreground">
                  Miễn phí từ 300k
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Cam Kết Chất Lượng</p>
                <p className="text-xs text-muted-foreground">
                  Hoàn tiền 100%
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Nguồn Gốc Rõ Ràng</p>
                <p className="text-xs text-muted-foreground">
                  Truy xuất được
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
