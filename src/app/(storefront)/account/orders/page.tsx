"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Calendar,
  CreditCard,
  ChevronRight,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Flame,
  AlertCircle,
  Leaf,
  User,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const statusMap: Record<
  string,
  { label: string; color: string; icon: any }
> = {
  pending: { label: "Chờ xác nhận", color: "bg-amber-100 text-amber-800", icon: Clock },
  confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-800", icon: CreditCard },
  processing: { label: "Đang bốc thuốc", color: "bg-purple-100 text-purple-800", icon: Flame },
  shipping: { label: "Đang giao hàng", color: "bg-orange-100 text-orange-800", icon: Truck },
  delivered: { label: "Hoàn thành", color: "bg-emerald-100 text-emerald-800", icon: CheckCircle2 },
  cancelled: { label: "Đã hủy", color: "bg-rose-100 text-rose-800", icon: AlertCircle },
};

export default function CustomerOrdersHistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [user, setUser] = useState<{ name: string; email: string; phone?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotLoggedIn, setIsNotLoggedIn] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    fetch("/api/orders/my-orders")
      .then((res) => {
        if (res.status === 401) {
          setIsNotLoggedIn(true);
          setIsLoading(false);
          return null;
        }
        return res.json();
      })
      .then((json) => {
        if (json && json.success) {
          setOrders(json.data || []);
          if (json.user) setUser(json.user);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        console.error("Lỗi lấy lịch sử đơn hàng:", e);
        setIsLoading(false);
      });
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const filteredOrders = orders.filter((o) => {
    if (activeFilter === "all") return true;
    return o.status === activeFilter;
  });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4">
        <div className="h-10 w-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-stone-500 text-sm">Đang tải lịch sử đơn hàng của bạn...</p>
      </div>
    );
  }

  // Khách chưa đăng nhập
  if (isNotLoggedIn) {
    return (
      <div className="min-h-[70vh] bg-stone-50/60 py-16 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-stone-200/80 shadow-md text-center space-y-5">
          <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <User className="h-8 w-8" />
          </div>

          <h2 className="font-heading text-2xl font-bold text-stone-900">
            Xem Lịch Sử Đơn Hàng
          </h2>

          <p className="text-stone-600 text-sm leading-relaxed">
            Vui lòng đăng nhập tài khoản để xem toàn bộ danh sách đơn đặt thảo dược và bài thuốc bạn đã mua.
          </p>

          <div className="space-y-3 pt-2">
            <Link href="/login?redirect=/account/orders" className="block">
              <Button className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl gap-2 shadow-sm">
                <LogIn className="h-4 w-4" />
                <span>Đăng Nhập Tài Khoản</span>
              </Button>
            </Link>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-stone-400">hoặc</span>
              </div>
            </div>

            <Link href="/tra-cuu-don-hang" className="block">
              <Button variant="outline" className="w-full h-11 border-stone-300 text-stone-800 font-medium rounded-xl gap-2">
                <Search className="h-4 w-4 text-emerald-600" />
                <span>Tra Cứu Nhanh Bằng Mã Đơn + SĐT</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50/60 py-10 sm:py-14">
      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        {/* User Welcome Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl">
              {user?.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <div>
              <h1 className="font-heading text-2xl font-extrabold text-stone-900">
                Xin chào, {user?.name || "Khách Hàng"}!
              </h1>
              <p className="text-xs text-stone-500 mt-0.5">
                {user?.email} {user?.phone && `• ${user.phone}`}
              </p>
            </div>
          </div>

          <Link href="/tra-cuu-don-hang">
            <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs text-emerald-800 border-emerald-300 hover:bg-emerald-50 rounded-xl">
              <Search className="h-3.5 w-3.5" />
              <span>Tra cứu theo mã đơn khác</span>
            </Button>
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: "all", label: `Tất cả (${orders.length})` },
            { id: "pending", label: "Chờ xác nhận" },
            { id: "confirmed", label: "Đã duyệt" },
            { id: "processing", label: "Đang bốc thuốc" },
            { id: "shipping", label: "Đang giao" },
            { id: "delivered", label: "Hoàn thành" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                activeFilter === tab.id
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Order Cards List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusInfo = statusMap[order.status] || statusMap.pending;
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-md hover:border-emerald-300 transition-all space-y-4"
                >
                  {/* Order Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-base text-emerald-900">
                        {order.orderCode}
                      </span>
                      <Badge className={`text-xs ${statusInfo.color} border-none font-semibold flex items-center gap-1`}>
                        <StatusIcon className="h-3 w-3" />
                        <span>{statusInfo.label}</span>
                      </Badge>
                    </div>

                    <div className="text-xs text-stone-500 flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{new Date(order.createdAt).toLocaleDateString("vi-VN")}</span>
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="space-y-2">
                    {order.items?.slice(0, 3).map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-stone-800">
                          <Leaf className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="font-medium">{item.product?.name || "Cây thuốc thảo dược"}</span>
                          <span className="text-stone-400">×{item.quantity}</span>
                        </div>
                        <span className="font-semibold text-stone-700">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                    {order.items?.length > 3 && (
                      <p className="text-[11px] text-stone-400 italic">
                        và {order.items.length - 3} thảo dược khác...
                      </p>
                    )}
                  </div>

                  {/* Footer Bar */}
                  <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-stone-500">Tổng thanh toán:</span>
                      <span className="font-extrabold text-lg text-emerald-800">
                        {formatPrice(order.totalAmount)}
                      </span>
                      <span className="text-[11px] text-stone-400">
                        ({order.paymentMethod === "bank_transfer" ? "VietQR" : "COD"})
                      </span>
                    </div>

                    <Link
                      href={`/tra-cuu-don-hang?code=${order.orderCode}&phone=${order.customerPhone}`}
                    >
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs gap-1.5 h-9"
                      >
                        <Search className="h-3.5 w-3.5" />
                        <span>Theo Dõi Tiến Trình Đơn</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/80 shadow-md space-y-4">
            <div className="h-16 w-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h3 className="font-heading text-lg font-bold text-stone-800">
              Chưa có đơn hàng nào
            </h3>
            <p className="text-stone-500 text-xs sm:text-sm max-w-sm mx-auto">
              Bạn chưa có đơn đặt hàng nào trong trạng thái này. Hãy khám phá các bài thuốc nam cổ truyền của Cây Thuốc Ông Han nhé!
            </p>
            <Link href="/products">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs h-10 px-6 font-semibold">
                Khám Phá Cây Thuốc Ngay
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
