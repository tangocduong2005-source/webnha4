import HeroBanner from "@/components/storefront/HeroBanner";
import CategorySection from "@/components/storefront/CategorySection";
import FeaturedProducts from "@/components/storefront/FeaturedProducts";
import HerbalSpotlight from "@/components/storefront/HerbalSpotlight";
import { Leaf, Quote } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <HerbalSpotlight />
      <CategorySection />
      <FeaturedProducts />

      {/* Testimonial / CTA section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 mb-6">
              <Quote className="h-7 w-7 text-primary" />
            </div>
            <blockquote className="font-heading text-2xl md:text-3xl font-medium text-foreground italic leading-relaxed mb-6">
              &ldquo;Thiên nhiên là nguồn dược liệu vô tận. Hãy trân trọng và
              sử dụng đúng cách để bảo vệ sức khỏe cho chính mình và gia
              đình.&rdquo;
            </blockquote>
            <p className="text-muted-foreground">
              — Triết lý của Thảo Dược Xanh
            </p>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/50">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-12">
            Vì Sao Chọn Thảo Dược Xanh?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Nguồn Gốc Tự Nhiên",
                desc: "Tất cả dược liệu được thu hái từ các vùng trồng hữu cơ, không sử dụng thuốc trừ sâu hay hóa chất. Nguồn gốc rõ ràng, có thể truy xuất.",
                icon: "🌱",
              },
              {
                title: "Chất Lượng Đảm Bảo",
                desc: "Quy trình sơ chế, đóng gói đạt tiêu chuẩn GMP. Sản phẩm được kiểm nghiệm chất lượng trước khi đến tay khách hàng.",
                icon: "✅",
              },
              {
                title: "Tư Vấn Chuyên Nghiệp",
                desc: "Đội ngũ dược sĩ và chuyên gia y học cổ truyền sẵn sàng tư vấn cách sử dụng dược liệu phù hợp với tình trạng sức khỏe của bạn.",
                icon: "👨‍⚕️",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-2xl bg-white border border-border/50 hover-lift"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-heading text-xl font-semibold mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 gradient-hero relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-[10%] animate-float">
            <Leaf className="h-12 w-12 text-white/10 rotate-12" />
          </div>
          <div
            className="absolute bottom-10 right-[15%] animate-float"
            style={{ animationDelay: "3s" }}
          >
            <Leaf className="h-8 w-8 text-white/10 -rotate-45" />
          </div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center text-white">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Nhận Tư Vấn Miễn Phí
            </h2>
            <p className="text-white/80 mb-6">
              Để lại email để nhận thông tin về dược liệu, bài thuốc hay và
              khuyến mãi đặc biệt
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Email của bạn"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <button className="px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors">
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
