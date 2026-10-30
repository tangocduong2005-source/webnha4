"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderTree,
  ShoppingBag,
  Leaf,
  ArrowLeft,
  Menu,
  Store,
  Bell,
  Sparkles,
  BarChart3,
  LogOut,
  ShieldCheck,
  CreditCard,
  Users,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const sidebarLinks = [
  {
    href: "/admin",
    label: "Tổng quan",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/doanh-thu",
    label: "Báo cáo Doanh thu",
    icon: BarChart3,
  },
  {
    href: "/admin/products",
    label: "Cây thuốc & Bài thuốc",
    icon: Leaf,
  },
  {
    href: "/admin/orders",
    label: "Quản lý Đơn hàng",
    icon: ShoppingBag,
  },
  {
    href: "/admin/customers",
    label: "Quản lý Khách hàng",
    icon: Users,
  },
  {
    href: "/admin/categories",
    label: "Danh mục dược liệu",
    icon: FolderTree,
  },
  {
    href: "/admin/bank-account",
    label: "Cấu hình Ngân hàng",
    icon: CreditCard,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingOrders, setPendingOrders] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const json = await res.json();
        if (json.success && json.user) {
          setCurrentUser(json.user);
        }
      } catch {
        // Ignored
      }
    };
    fetchUser();
  }, []);

  // Fetch số đơn hàng chờ xử lý để hiển thị thông báo
  useEffect(() => {
    fetch("/api/orders?status=pending")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setPendingOrders(json.data.length);
        }
      })
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      window.location.href = "/login";
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/60 font-sans">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Cố Định Bên Trái (Left Sidebar Navigation) */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-stone-900 text-stone-300 border-r border-stone-800 z-50 transition-transform duration-300 flex flex-col lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 flex-1 flex flex-col overflow-y-auto">
          {/* Brand Logo */}
          <Link href="/admin" className="flex items-center gap-3 mb-8 px-1">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-heading text-base font-bold text-white tracking-wide">
                Cây Thuốc Ông Han
              </h1>
              <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                <span>Admin Portal</span>
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-2">
              Quản trị hệ thống
            </p>
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
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-emerald-800 text-white shadow-sm font-semibold"
                        : "text-stone-400 hover:bg-stone-800/80 hover:text-stone-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <link.icon className={`h-4.5 w-4.5 ${isActive ? "text-emerald-300" : "text-stone-400"}`} />
                      <span>{link.label}</span>
                    </div>

                    {link.href === "/admin/orders" && pendingOrders > 0 && (
                      <span className="h-5 min-w-5 px-1.5 rounded-full bg-amber-500 text-stone-900 font-bold text-[10px] flex items-center justify-center">
                        {pendingOrders}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Storefront Link */}
        <div className="p-4 border-t border-stone-800">
          <Link
            href="/"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-stone-800/60 hover:bg-stone-800 text-xs font-semibold text-stone-300 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Store className="h-4 w-4 text-emerald-400" />
              <span>Xem Web Bán Hàng</span>
            </span>
            <ArrowLeft className="h-3.5 w-3.5 rotate-180 text-stone-500" />
          </Link>
        </div>
      </aside>

      {/* Main content wrapper */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Top Header Admin với Thông tin tài khoản, Thông báo & Đăng xuất */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 lg:px-8 py-3 shadow-2xs">
          <div className="flex items-center justify-between">
            {/* Left: Mobile Toggle & Status */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-stone-700"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="hidden sm:flex items-center gap-2 text-xs text-stone-500">
                <span>Hệ thống:</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Đang hoạt động ổn định
                </span>
              </div>
            </div>

            {/* Right: Storefront, Notifications, Account Info & Logout */}
            <div className="flex items-center gap-3">
              {/* Storefront Button */}
              <Link href="/" target="_blank">
                <Button variant="outline" size="sm" className="hidden md:inline-flex text-xs h-9 gap-1.5 border-stone-300 rounded-xl hover:bg-stone-50 font-medium">
                  <Store className="h-3.5 w-3.5 text-emerald-700" />
                  <span>Xem Website</span>
                </Button>
              </Link>

              {/* Notification: Đơn hàng mới cần duyệt */}
              <Link href="/admin/orders?status=pending" title="Đơn hàng chờ xử lý">
                <div className="relative h-9 w-9 rounded-xl bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 flex items-center justify-center border border-stone-200 transition-colors cursor-pointer">
                  <Bell className="h-4 w-4" />
                  {pendingOrders > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 bg-rose-500 text-white font-extrabold text-[10px] rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                      {pendingOrders}
                    </span>
                  )}
                </div>
              </Link>

              {/* Account Info Pill */}
              <div className="flex items-center gap-2.5 pl-3 border-l border-stone-200">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : "AD"}
                </div>
                <div className="hidden sm:block text-left leading-tight">
                  <p className="text-xs font-bold text-stone-900 truncate max-w-[140px]">
                    {currentUser?.name || "Dược Sĩ Quản Trị"}
                  </p>
                  <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    <span>{currentUser?.role || "ADMIN"}</span>
                  </p>
                </div>

                {/* Logout Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  title="Đăng xuất khỏi Quản trị"
                  className="h-9 px-2.5 text-xs text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl ml-1 gap-1"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Đăng xuất</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
