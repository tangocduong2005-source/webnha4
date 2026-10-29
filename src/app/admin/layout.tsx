"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Leaf,
  ArrowLeft,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const sidebarLinks = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/products",
    label: "Sản phẩm",
    icon: Package,
  },
  {
    href: "/admin/categories",
    label: "Danh mục",
    icon: FolderTree,
  },
  {
    href: "/admin/orders",
    label: "Đơn hàng",
    icon: ShoppingBag,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-accent/30">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-[hsl(153,30%,12%)] text-white z-50 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-5">
          {/* Logo */}
          <Link href="/admin" className="flex items-center gap-2 mb-8">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-heading text-lg font-bold">Thảo Dược Xanh</h1>
              <p className="text-[10px] text-white/50">Quản trị hệ thống</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="space-y-1">
            {sidebarLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/admin" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${isActive
                      ? "bg-primary text-white font-medium"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  <link.icon className="h-4.5 w-4.5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Back to store */}
        <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Về trang bán hàng
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b">
          <div className="flex items-center justify-between px-4 lg:px-8 py-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="hidden lg:block">
              <h2 className="text-sm font-medium text-muted-foreground">
                Admin Panel
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
