import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import FloatingChatbot from "@/components/storefront/FloatingChatbot";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingChatbot />
    </div>
  );
}
