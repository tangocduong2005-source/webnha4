import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "Thảo Dược Xanh - Cây Lá Thuốc & Dược Liệu Thiên Nhiên",
  description:
    "Chuyên cung cấp cây lá thuốc, dược liệu thiên nhiên, trà thảo mộc và thuốc nam gia truyền chất lượng cao. Nguồn gốc rõ ràng, an toàn cho sức khỏe.",
  keywords:
    "cây thuốc, dược liệu, thảo dược, thuốc nam, trà thảo mộc, cà gai leo, đinh lăng, giảo cổ lam",
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
