"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  TrendingUp,
  ArrowRight,
  Leaf,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { orders as initialOrders } from "@/data/orders";
import { products as initialProducts } from "@/data/products";
import { Order, Product } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-800" },
  processing: { label: "Đang xử lý", color: "bg-purple-100 text-purple-800" },
  shipping: { label: "Đang giao", color: "bg-orange-100 text-orange-800" },
  delivered: { label: "Đã giao", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-800" },
};

export default function AdminDashboard() {
  const [orderList, setOrderList] = useState<Order[]>(initialOrders);
  const [productList, setProductList] = useState<Product[]>(initialProducts);

  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem("thaoduocxanh-orders");
      if (savedOrders) setOrderList(JSON.parse(savedOrders));

      const savedProducts = localStorage.getItem("thaoduocxanh-products");
      if (savedProducts) setProductList(JSON.parse(savedProducts));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const totalRevenue = orderList.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orderList.length;
  const totalProducts = productList.length;
  const totalStock = productList.reduce((sum, p) => sum + p.stock, 0);

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
      change: "+15.2% tháng này",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600 bg-green-50",
    },
    {
      title: "Đơn đặt hàng",
      value: `${totalOrders} đơn`,
      change: `${orderList.filter((o) => o.status === "pending").length} đơn mới`,
      trend: "up",
      icon: ShoppingBag,
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "Bài thuốc & Dược liệu",
      value: `${totalProducts} loại`,
      change: `${totalStock} gói tồn kho`,
      trend: "neutral",
      icon: Package,
      color: "text-purple-600 bg-purple-50",
    },
    {
      title: "Khách hàng mua",
      value: "186 người",
      change: "+8 khách mới",
      trend: "up",
      icon: Users,
      color: "text-orange-600 bg-orange-50",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">
          Bảng Điều Khiển Cửa Hàng
        </h1>
        <p className="text-muted-foreground text-sm">
          Tổng quan số liệu kinh doanh dược liệu Thảo Dược Xanh
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover-lift border shadow-xs bg-white">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center ${stat.color}`}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
                {stat.trend === "up" && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    <TrendingUp className="h-3 w-3" />
                    {stat.change}
                  </span>
                )}
                {stat.trend === "neutral" && (
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {stat.change}
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.title}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent orders & Top products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <Card className="border shadow-xs bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="font-heading text-lg">
                Đơn Hàng Vừa Đặt
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Cập nhật đơn hàng mới nhất của khách
              </p>
            </div>
            <Link href="/admin/orders">
              <Button variant="ghost" size="sm" className="text-xs text-primary gap-1">
                <span>Xem tất cả</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orderList.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-accent/20 border border-border/40 hover:bg-accent/30 transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-primary">
                        {order.orderNumber}
                      </span>
                      <span className="text-xs font-semibold text-foreground">
                        {order.customer.fullName}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {order.items.length} món • SĐT: {order.customer.phone}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-bold text-primary">
                      {formatPrice(order.total)}
                    </p>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${statusMap[order.status]?.color}`}
                    >
                      {statusMap[order.status]?.label}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top products */}
        <Card className="border shadow-xs bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="font-heading text-lg">
                Cây Thuốc Bán Chạy & Tồn Kho
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Các loại dược liệu được quan tâm nhiều nhất
              </p>
            </div>
            <Link href="/admin/products">
              <Button variant="ghost" size="sm" className="text-xs text-primary gap-1">
                <span>Quản lý kho</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {productList.slice(0, 5).map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-accent/20 border border-border/40"
                >
                  <div className="h-10 w-10 rounded-lg bg-accent/50 flex items-center justify-center shrink-0 overflow-hidden border">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Leaf className="h-5 w-5 text-primary/40" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate text-foreground">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Tồn: <strong>{product.stock}</strong> gói • ⭐ {product.rating} ({product.reviewCount} đánh giá)
                    </p>
                  </div>
                  <p className="text-sm font-bold text-primary">
                    {formatPrice(product.price)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
