"use client";

import { useState, useEffect } from "react";
import { orders as initialOrders } from "@/data/orders";
import { Order, OrderStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Eye,
  MapPin,
  Phone,
  Mail,
  Leaf,
  MessageSquare,
  ExternalLink,
} from "lucide-react";

const statusMap: Record<
  string,
  { label: string; color: string }
> = {
  pending: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-800 border-blue-200" },
  processing: { label: "Đang sắc/bốc thuốc", color: "bg-purple-100 text-purple-800 border-purple-200" },
  shipping: { label: "Đang giao hàng", color: "bg-orange-100 text-orange-800 border-orange-200" },
  delivered: { label: "Đã giao thành công", color: "bg-green-100 text-green-800 border-green-200" },
  cancelled: { label: "Đã hủy đơn", color: "bg-red-100 text-red-800 border-red-200" },
};

const paymentMethodMap: Record<string, { label: string; icon: string }> = {
  cod: { label: "Tiền mặt (COD)", icon: "💵" },
  bank_transfer: { label: "Chuyển khoản VietQR", icon: "📱" },
  momo: { label: "Ví MoMo", icon: "👛" },
};

export default function AdminOrdersPage() {
  const [orderList, setOrderList] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Tải đơn hàng từ localStorage khi mở trang
  useEffect(() => {
    try {
      const saved = localStorage.getItem("thaoduocxanh-orders");
      if (saved) {
        const parsed: Order[] = JSON.parse(saved);
        // Hợp nhất đơn hàng mới và đơn mẫu
        setOrderList(parsed);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveOrders = (newList: Order[]) => {
    setOrderList(newList);
    try {
      localStorage.setItem("thaoduocxanh-orders", JSON.stringify(newList));
    } catch (e) {
      console.error(e);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const filteredOrders = orderList.filter((order) => {
    const matchSearch =
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.fullName.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.phone.includes(search);
    const matchStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const updated = orderList.map((o) =>
      o.id === orderId
        ? { ...o, status: newStatus, updatedAt: new Date().toISOString() }
        : o
    );
    saveOrders(updated);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) =>
        prev ? { ...prev, status: newStatus } : null
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Quản Lý Đơn Hàng Dược Liệu
          </h1>
          <p className="text-muted-foreground text-sm">
            Tổng cộng <strong>{orderList.length}</strong> đơn hàng đã ghi nhận
          </p>
        </div>

        {/* Status Quick Counters */}
        <div className="flex items-center gap-2">
          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
            {orderList.filter((o) => o.status === "pending").length} Chờ xác nhận
          </Badge>
          <Badge className="bg-green-100 text-green-800 text-xs">
            {orderList.filter((o) => o.status === "delivered").length} Đã giao
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo mã đơn (DH...), tên hoặc SĐT khách hàng..."
            className="pl-10 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val ?? "all")}>
          <SelectTrigger className="w-[200px] bg-white">
            <SelectValue placeholder="Lọc trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="pending">Chờ xác nhận</SelectItem>
            <SelectItem value="confirmed">Đã xác nhận</SelectItem>
            <SelectItem value="processing">Đang sắc/bốc thuốc</SelectItem>
            <SelectItem value="shipping">Đang giao hàng</SelectItem>
            <SelectItem value="delivered">Đã giao thành công</SelectItem>
            <SelectItem value="cancelled">Đã hủy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-accent/30">
            <TableRow>
              <TableHead className="w-28">Mã Đơn</TableHead>
              <TableHead>Khách Hàng</TableHead>
              <TableHead>Cây Thuốc Đặt</TableHead>
              <TableHead className="text-right">Tổng Tiền</TableHead>
              <TableHead className="text-center">Trạng Thái Đơn</TableHead>
              <TableHead className="text-center">Thanh Toán</TableHead>
              <TableHead className="text-right">Chi Tiết</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-accent/10">
                  <TableCell className="font-mono font-bold text-sm text-primary">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold text-sm text-foreground">
                        {order.customer.fullName}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>{order.customer.phone}</span>
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">
                        {order.items.length} loại thảo dược
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {order.items.map((i) => `${i.productName} (x${i.quantity})`).join(", ")}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-bold text-sm text-primary">
                    {formatPrice(order.total)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Select
                      value={order.status}
                      onValueChange={(v) => {
                        if (v) updateOrderStatus(order.id, v as OrderStatus);
                      }}
                    >
                      <SelectTrigger className="h-7 w-[150px] text-xs mx-auto bg-white border">
                        <Badge
                          variant="outline"
                          className={`text-[11px] ${statusMap[order.status]?.color}`}
                        >
                          {statusMap[order.status]?.label}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusMap).map(([key, val]) => (
                          <SelectItem key={key} value={key}>
                            {val.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-center text-xs">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-medium">
                      {paymentMethodMap[order.paymentMethod]?.icon}{" "}
                      {paymentMethodMap[order.paymentMethod]?.label}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  Không tìm thấy đơn hàng nào phù hợp với bộ lọc.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Order detail dialog */}
      <Dialog
        open={!!selectedOrder}
        onOpenChange={() => setSelectedOrder(null)}
      >
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl flex items-center justify-between">
              <span>Đơn Hàng: {selectedOrder?.orderNumber}</span>
              {selectedOrder && (
                <Badge
                  variant="outline"
                  className={statusMap[selectedOrder.status]?.color}
                >
                  {statusMap[selectedOrder.status]?.label}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-5 pt-2">
              {/* Quick Customer Action */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-accent/30 border">
                <div>
                  <p className="font-bold text-sm">{selectedOrder.customer.fullName}</p>
                  <p className="text-xs text-muted-foreground">
                    SĐT: {selectedOrder.customer.phone}
                  </p>
                </div>
                <a
                  href={`https://zalo.me/${selectedOrder.customer.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm" className="bg-[#0068FF] hover:bg-[#0052cc] text-white text-xs gap-1.5 h-8">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Mở Zalo Khách</span>
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </a>
              </div>

              {/* Delivery Address */}
              <div className="space-y-1 text-xs sm:text-sm text-muted-foreground p-3.5 rounded-xl bg-muted/40 border">
                <p className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>
                    <strong>Địa chỉ giao:</strong>{" "}
                    {[
                      selectedOrder.customer.address,
                      selectedOrder.customer.ward,
                      selectedOrder.customer.district,
                      selectedOrder.customer.city,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </p>
                {selectedOrder.customer.email && (
                  <p className="flex items-center gap-2 pt-1">
                    <Mail className="h-3.5 w-3.5 text-primary" />
                    <span>Email: {selectedOrder.customer.email}</span>
                  </p>
                )}
                {selectedOrder.note && (
                  <p className="pt-2 text-foreground font-medium border-t border-border/40">
                    📝 Ghi chú: &ldquo;{selectedOrder.note}&rdquo;
                  </p>
                )}
              </div>

              <Separator />

              {/* Items List */}
              <div className="space-y-2.5">
                <h4 className="font-semibold text-sm text-foreground">
                  Danh sách cây lá thuốc đã đặt ({selectedOrder.items.length})
                </h4>
                {selectedOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-white border shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-accent/40 flex items-center justify-center shrink-0 overflow-hidden border">
                        {item.productImage ? (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Leaf className="h-5 w-5 text-primary/40" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {item.productName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Đơn giá: {formatPrice(item.price)} • Số lượng: <strong>x{item.quantity}</strong>
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-primary">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Payment & Totals */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Hình thức thanh toán:</span>
                  <span className="font-semibold text-foreground">
                    {paymentMethodMap[selectedOrder.paymentMethod]?.label}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tiền hàng:</span>
                  <span>{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Phí giao hàng:</span>
                  <span>
                    {selectedOrder.shippingFee === 0
                      ? "Miễn phí (≥ 300k)"
                      : formatPrice(selectedOrder.shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t">
                  <span>Tổng tiền thanh toán:</span>
                  <span className="text-primary text-xl">
                    {formatPrice(selectedOrder.total)}
                  </span>
                </div>
              </div>

              {/* Quick Status Update in Dialog */}
              <div className="p-3.5 rounded-xl bg-accent/20 border flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">
                  Chuyển trạng thái đơn:
                </span>
                <div className="flex gap-1.5 flex-wrap">
                  {(["confirmed", "shipping", "delivered", "cancelled"] as OrderStatus[]).map((st) => (
                    <Button
                      key={st}
                      size="sm"
                      variant={selectedOrder.status === st ? "default" : "outline"}
                      className="text-xs h-7"
                      onClick={() => updateOrderStatus(selectedOrder.id, st)}
                    >
                      {statusMap[st]?.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
