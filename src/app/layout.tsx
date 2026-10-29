import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "Cây Thuốc Ông Han - Cây Lá Thuốc & Dược Liệu Thiên Nhiên",
  description:
    "Cây Thuốc Ông Han chuyên cung cấp cây lá thuốc, dược liệu thiên nhiên, trà thảo mộc và thuốc nam gia truyền chất lượng cao. Địa chỉ: Thôn Lễ Thần, xã Thái Ninh, tỉnh Hưng Yên. Hotline: 0964001203.",
  keywords:
    "cây thuốc ông han, cây thuốc, dược liệu, thảo dược, thuốc nam, trà thảo mộc, cà gai leo, đinh lăng, giảo cổ lam, xáo tam phân, hưng yên",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased leaf-pattern">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
