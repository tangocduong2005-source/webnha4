import Link from "next/link";
import { Leaf, Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { categories } from "@/data/categories";

export default function Footer() {
  return (
    <footer className="bg-[hsl(153,30%,12%)] text-white/80">
      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-white">
                  Cây Thuốc Ông Han
                </h3>
                <p className="text-xs text-white/50">Cây thuốc & Dược liệu gia truyền</p>
              </div>
            </Link>
            <p className="text-sm leading-relaxed">
              Cây Thuốc Ông Han chuyên cung cấp các loại cây lá thuốc, dược liệu tự nhiên thu hái và sơ chế chuẩn Đông Y cổ truyền. An toàn, hiệu quả và tận tâm vì sức khỏe người dùng.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Facebook"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#"
                className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-white mb-4">
              Danh mục
            </h4>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className="text-sm hover:text-primary transition-colors inline-flex items-center gap-2"
                  >
                    <Leaf className="h-3 w-3" />
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-white mb-4">
              Thông tin
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-sm hover:text-primary transition-colors"
                >
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm hover:text-primary transition-colors"
                >
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm hover:text-primary transition-colors"
                >
                  Chính sách giao hàng
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm hover:text-primary transition-colors"
                >
                  Hướng dẫn sử dụng
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm hover:text-primary transition-colors"
                >
                  Câu hỏi thường gặp
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-white mb-4">
              Liên hệ
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                <span>Thôn Lễ Thần, xã Thái Ninh, tỉnh Hưng Yên</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <a href="tel:0964001203" className="hover:text-primary transition-colors">
                  0964001203
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <a href="mailto:tangocduong2005@gmail.com" className="hover:text-primary transition-colors">
                  tangocduong2005@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-white/40">
          <p>© 2024 Cây Thuốc Ông Han. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
