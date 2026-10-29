"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  ShoppingBag,
  Leaf,
  Clock,
  TrendingUp,
  ArrowRight,
  Phone,
} from "lucide-react";
import { orders as initialOrders } from "@/data/orders";
import { products as initialProducts } from "@/data/products";
import { Order, Product } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: "Chờ xác nhận", color: "bg-amber-100 text-amber-800 border-amber-200" },
  confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-800 border-blue-200" },
  processing: { label: "Đang bốc thuốc", color: "bg-purple-100 text-purple-800 border-purple-200" },
  shipping: { label: "Đang giao", color: "bg-orange-100 text-orange-800 border-orange-200" },
  delivered: { label: "Đã giao", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  cancelled: { label: "Đã hủy", color: "bg-rose-100 text-rose-800 border-rose-200" },
};

export default function AdminDashboard() {
  const [orderList, setOrderList] = useState<Order[]>(initialOrders);
  const [productList, setProductList] = useState<Product[]>(initialProducts);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, oRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/orders"),
        ]);
        const pJson = await pRes.json();
        const oJson = await oRes.json();

        if (pJson.success && Array.isArray(pJson.data) && pJson.data.length > 0) {
          setProductList(pJson.data);
        }
        if (oJson.success && Array.isArray(oJson.data) && oJson.data.length > 0) {
          const mappedOrders: Order[] = oJson.data.map((o: any) => ({
            id: o.id,
            orderNumber: o.orderCode,
            customer: {
              name: o.customerName,
              phone: o.customerPhone,
              email: o.customerEmail || "",
              address: o.customerAddress,
              city: "",
            },
            items: (o.items || []).map((it: any) => ({
              productId: it.productId,
              productName: it.product?.name || "Cây thuốc",
              price: it.price,
              quantity: it.quantity,
            })),
            subtotal: o.totalAmount,
            shippingFee: 0,
            total: o.totalAmount,
            status: o.status,
            paymentMethod: o.paymentMethod,
            paymentStatus: o.paymentStatus,
            createdAt: o.createdAt,
            notes: o.notes,
          }));
          setOrderList(mappedOrders);
        }
      } catch (e) {
        console.error("Lỗi đồng bộ Dashboard từ MySQL:", e);
      }
    };
    fetchData();
  }, []);

  const totalRevenue = orderList.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orderList.length;
  const totalProducts = productList.length;
  const pendingOrders = orderList.filter((o) => o.status === "pending").length;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const stats = [
    {
      title: "Tổng doanh thu",
      value: formatPrice(totalRevenue),
      subtext: "+18.4% so với tháng trước",
      trend: "up",
      icon: DollarSign,
      iconColor: "text-emerald-700",
      bgColor: "bg-emerald-50 border-emerald-200/60",
    },
    {
      title: "Tổng đơn hàng",
      value: `${totalOrders} đơn`,
      subtext: "Đã ghi nhận trên hệ thống",
      trend: "neutral",
      icon: ShoppingBag,
      iconColor: "text-blue-700",
      bgColor: "bg-blue-50 border-blue-200/60",
    },
    {
      title: "Số loại cây thuốc",
      value: `${totalProducts} loại`,
      subtext: `${productList.reduce((sum, p) => sum + p.stock, 0)} gói trong kho`,
      trend: "neutral",
      icon: Leaf,
      iconColor: "text-purple-700",
      bgColor: "bg-purple-50 border-purple-200/60",
    },
    {
      title: "Đơn chờ xử lý",
      value: `${pendingOrders} đơn`,
      subtext: pendingOrders > 0 ? "Cần liên hệ khách xác nhận" : "Tất cả đơn đã được duyệt",
      trend: pendingOrders > 0 ? "alert" : "good",
      icon: Clock,
      iconColor: "text-amber-700",
      bgColor: "bg-amber-50 border-amber-200/60",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-stone-900 tracking-tight">
            Bảng Điều Khiển Quản Trị
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Tổng quan hiệu suất bán hàng & tình trạng tồn kho cây thuốc Nam
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/products">
            <Button className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs h-9 gap-1.5 rounded-xl shadow-xs">
              <Leaf className="h-3.5 w-3.5" />
              <span>Thêm Cây Thuốc</span>
            </Button>
          </Link>
          <Link href="/admin/orders">
            <Button variant="outline" className="text-xs h-9 gap-1.5 rounded-xl border-stone-300">
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Xem Đơn Hàng</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className={`p-5 rounded-2xl border bg-white shadow-2xs hover:shadow-md transition-all duration-300 hover:-translate-y-1`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {stat.title}
              </span>
              <div
                className={`h-11 w-11 rounded-xl flex items-center justify-center border ${stat.bgColor} ${stat.iconColor}`}
              >
                <stat.icon className="h-5 w-5" />
              </div>
            </div>

            <p className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              {stat.value}
            </p>

            <div className="mt-2 flex items-center gap-1.5 text-xs">
              {stat.trend === "up" && (
                <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                  <TrendingUp className="h-3 w-3" />
                  {stat.subtext}
                </span>
              )}
              {stat.trend === "alert" && (
                <span className="text-amber-700 font-semibold bg-amber-100/70 px-2 py-0.5 rounded-md">
                  ⚠ {stat.subtext}
                </span>
              )}
              {stat.trend !== "up" && stat.trend !== "alert" && (
                <span className="text-stone-500">{stat.subtext}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Recent orders & Top Herb products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recent orders column */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div>
              <h2 className="font-heading text-lg font-bold text-stone-900">
                Đơn Hàng Gần Đây
              </h2>
              <p className="text-xs text-stone-500">Các đơn mới đặt từ trang cửa hàng</p>
            </div>
            <Link href="/admin/orders">
              <Button variant="ghost" size="sm" className="text-xs text-emerald-800 hover:text-emerald-900 gap-1 font-semibold">
                <span>Xem tất cả ({orderList.length})</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {orderList.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 border border-stone-200/60 hover:border-emerald-700/30 transition-all hover:bg-stone-50/80"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-900 bg-emerald-100/60 px-2 py-0.5 rounded-md">
                      {order.orderNumber}
                    </span>
                    <span className="text-sm font-bold text-stone-900">
                      {order.customer.fullName}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 flex items-center gap-2">
                    <span>{order.items.length} bài thuốc</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {order.customer.phone}
                    </span>
                  </p>
                </div>

                <div className="text-right space-y-1.5">
                  <p className="text-sm font-extrabold text-emerald-900">
                    {formatPrice(order.total)}
                  </p>
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-semibold ${statusMap[order.status]?.color}`}
                  >
                    {statusMap[order.status]?.label}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products column */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div>
              <h2 className="font-heading text-lg font-bold text-stone-900">
                Cây Thuốc Tiêu Biểu
              </h2>
              <p className="text-xs text-stone-500">Theo dõi tồn kho & đánh giá</p>
            </div>
            <Link href="/admin/products">
              <Button variant="ghost" size="sm" className="text-xs text-emerald-800 hover:text-emerald-900 gap-1 font-semibold">
                <span>Quản lý kho</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {productList.slice(0, 5).map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3.5 p-3 rounded-2xl bg-stone-50 border border-stone-200/60"
              >
                <div className="h-12 w-12 rounded-xl bg-stone-200 flex items-center justify-center shrink-0 overflow-hidden border">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Leaf className="h-6 w-6 text-emerald-800/40" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate text-stone-900">
                    {product.name}
                  </p>
                  <p className="text-xs text-stone-500">
                    Tồn: <strong className="text-stone-800">{product.stock}</strong> gói • ⭐ {product.rating}
                  </p>
                </div>
                <p className="text-sm font-bold text-emerald-900">
                  {formatPrice(product.price)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
