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
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  CreditCard,
} from "lucide-react";

const statusMap: Record<
  string,
  { label: string; color: string }
> = {
  pending: { label: "Chờ xác nhận", color: "bg-amber-100 text-amber-800 border-amber-200" },
  confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-800 border-blue-200" },
  processing: { label: "Đang bốc thuốc", color: "bg-purple-100 text-purple-800 border-purple-200" },
  shipping: { label: "Đang giao hàng", color: "bg-orange-100 text-orange-800 border-orange-200" },
  delivered: { label: "Đã giao thành công", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  cancelled: { label: "Đã hủy đơn", color: "bg-rose-100 text-rose-800 border-rose-200" },
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
  const [viewProofModal, setViewProofModal] = useState<string | null>(null);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        // Map Prisma DB order to UI Order format
        const mapped: Order[] = json.data.map((o: any) => ({
          id: o.id,
          orderNumber: o.orderCode,
          customer: {
            fullName: o.customerName,
            phone: o.customerPhone,
            email: o.customerEmail || "",
            address: o.customerAddress,
            ward: "",
            district: "",
            city: "",
          },
          items: (o.items || []).map((it: any) => ({
            productId: it.productId,
            productName: it.product?.name || "Cây thuốc thảo dược",
            price: it.price,
            quantity: it.quantity,
            productImage: it.product?.images?.[0] || "",
          })),
          subtotal: o.totalAmount,
          shippingFee: 0,
          total: o.totalAmount,
          status: o.status,
          paymentMethod: o.paymentMethod,
          paymentStatus: o.paymentStatus,
          paymentProof: o.paymentProof,
          createdAt: o.createdAt,
          note: o.notes,
        }));
        setOrderList(mapped);
      } else {
        const saved = localStorage.getItem("thaoduocxanh-orders");
        if (saved) setOrderList(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Error fetching orders from MySQL:", e);
      const saved = localStorage.getItem("thaoduocxanh-orders");
      if (saved) setOrderList(JSON.parse(saved));
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const filteredOrders = orderList.filter((order) => {
    const matchSearch =
      (order.orderNumber || "").toLowerCase().includes(search.toLowerCase()) ||
      (order.customer?.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
      (order.customer?.phone || "").includes(search);
    const matchStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      await fetchOrders();
    } catch (e) {
      console.error("Lỗi cập nhật trạng thái đơn hàng:", e);
    }
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) =>
        prev ? { ...prev, status: newStatus } : null
      );
    }
  };

  const updatePaymentStatus = async (orderId: string, paymentStatus: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus }),
      });
      await fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, paymentStatus } : null
        );
      }
    } catch (e) {
      console.error("Lỗi cập nhật trạng thái thanh toán:", e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-stone-900 tracking-tight">
            Quản Lý Đơn Đặt Hàng
          </h1>
          <p className="text-stone-500 text-sm mt-0.5">
            Tổng cộng <strong>{orderList.length}</strong> đơn đặt cây thuốc trên toàn quốc
          </p>
        </div>

        {/* Status Quick Counters */}
        <div className="flex items-center gap-2">
          <Badge className="bg-amber-100 text-amber-800 text-xs px-3 py-1 border-none font-semibold">
            {orderList.filter((o) => o.status === "pending").length} Chờ xác nhận
          </Badge>
          <Badge className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 border-none font-semibold">
            {orderList.filter((o) => o.status === "delivered").length} Đã giao
          </Badge>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <Input
            placeholder="Tìm theo mã đơn (DH...), tên hoặc SĐT khách hàng..."
            className="pl-10 bg-white border-stone-200 rounded-xl"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <Select
          value={statusFilter}
          onValueChange={(val) => {
            setStatusFilter(val ?? "all");
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[220px] bg-white border-stone-200 rounded-xl">
            <SelectValue placeholder="Lọc trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái ({orderList.length})</SelectItem>
            <SelectItem value="pending">Chờ xác nhận</SelectItem>
            <SelectItem value="confirmed">Đã xác nhận</SelectItem>
            <SelectItem value="processing">Đang bốc thuốc</SelectItem>
            <SelectItem value="shipping">Đang giao hàng</SelectItem>
            <SelectItem value="delivered">Đã giao thành công</SelectItem>
            <SelectItem value="cancelled">Đã hủy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden">
        <Table>
          <TableHeader className="bg-stone-50 border-b border-stone-200">
            <TableRow>
              <TableHead className="w-32">Mã Đơn</TableHead>
              <TableHead>Khách Hàng</TableHead>
              <TableHead>Cây Thuốc Đặt</TableHead>
              <TableHead className="text-right">Tổng Tiền</TableHead>
              <TableHead className="text-center">Trạng Thái Đơn</TableHead>
              <TableHead className="text-center">Thanh Toán & Chứng Từ</TableHead>
              <TableHead className="text-right">Chi Tiết</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-stone-50/70 transition-colors">
                  <TableCell className="font-mono font-bold text-xs sm:text-sm text-emerald-900">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-bold text-sm text-stone-900">
                        {order.customer.fullName}
                      </p>
                      <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5">
                        <Phone className="h-3 w-3 text-stone-400" />
                        <span>{order.customer.phone}</span>
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="text-xs sm:text-sm font-semibold text-stone-800">
                        {order.items.length} loại thảo dược
                      </p>
                      <p className="text-xs text-stone-500 truncate max-w-[220px]">
                        {order.items.map((i) => `${i.productName} (x${i.quantity})`).join(", ")}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-extrabold text-sm text-emerald-900">
                    {formatPrice(order.total)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Select
                      value={order.status}
                      onValueChange={(v) => {
                        if (v) updateOrderStatus(order.id, v as OrderStatus);
                      }}
                    >
                      <SelectTrigger className="h-8 w-[155px] text-xs mx-auto bg-white border border-stone-200 rounded-lg">
                        <Badge
                          variant="outline"
                          className={`text-[11px] font-semibold border-none ${statusMap[order.status]?.color}`}
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
                    <div className="flex flex-col items-center gap-1">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-medium text-[11px]">
                        {paymentMethodMap[order.paymentMethod]?.icon}{" "}
                        {paymentMethodMap[order.paymentMethod]?.label}
                      </span>
                      {order.paymentProof ? (
                        <button
                          onClick={() => setViewProofModal(order.paymentProof!)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-md transition-colors"
                        >
                          <ImageIcon className="h-3 w-3" />
                          <span>Xem ảnh CK</span>
                        </button>
                      ) : order.paymentMethod === "bank_transfer" ? (
                        <span className="text-[10px] text-amber-600">Chưa tải ảnh CK</span>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-emerald-800 hover:bg-emerald-100/50"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-14 text-stone-500">
                  Không tìm thấy đơn hàng nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination Bar */}
        <div className="px-6 py-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>
            Hiển thị <strong>{paginatedOrders.length}</strong> trên <strong>{filteredOrders.length}</strong> đơn hàng
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-semibold text-stone-800">
              Trang {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      <Dialog
        open={!!selectedOrder}
        onOpenChange={() => setSelectedOrder(null)}
      >
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl">
          <DialogHeader className="pb-3 border-b border-stone-200">
            <DialogTitle className="font-heading text-xl font-bold flex items-center justify-between text-stone-900">
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
              {/* Customer Contact & Zalo CTA */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <div>
                  <p className="font-bold text-sm text-stone-900">{selectedOrder.customer.fullName}</p>
                  <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5">
                    <Phone className="h-3.5 w-3.5 text-stone-400" />
                    <span>{selectedOrder.customer.phone}</span>
                  </p>
                </div>
                <a
                  href={`https://zalo.me/${selectedOrder.customer.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm" className="bg-[#0068FF] hover:bg-[#0052cc] text-white text-xs gap-1.5 h-8.5 rounded-xl font-semibold">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Mở Zalo Khách</span>
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </a>
              </div>

              {/* Delivery Address */}
              <div className="space-y-1.5 text-xs sm:text-sm text-stone-600 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <p className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-emerald-800 shrink-0 mt-0.5" />
                  <span>
                    <strong>Địa chỉ nhận hàng:</strong>{" "}
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
                  <p className="flex items-center gap-2.5 pt-1">
                    <Mail className="h-3.5 w-3.5 text-emerald-800" />
                    <span>Email: {selectedOrder.customer.email}</span>
                  </p>
                )}
                {selectedOrder.note && (
                  <p className="pt-2 text-stone-800 font-medium border-t border-stone-200/80">
                    📝 Ghi chú: &ldquo;{selectedOrder.note}&rdquo;
                  </p>
                )}
              </div>

              {/* Payment Proof Screenshot Box */}
              {selectedOrder.paymentProof && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <ImageIcon className="h-4 w-4 text-emerald-700" />
                      Ảnh chụp màn hình chuyển khoản của khách hàng
                    </p>
                    <Badge
                      className={
                        selectedOrder.paymentStatus === "paid"
                          ? "bg-emerald-600 text-white"
                          : "bg-amber-100 text-amber-800"
                      }
                    >
                      {selectedOrder.paymentStatus === "paid"
                        ? "Đã xác nhận tiền vào TK"
                        : "Chờ đối soát tiền"}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4">
                    <div
                      className="cursor-pointer group relative rounded-xl overflow-hidden border border-emerald-300 w-32 h-32 bg-white shrink-0 shadow-xs"
                      onClick={() => setViewProofModal(selectedOrder.paymentProof!)}
                    >
                      <img
                        src={selectedOrder.paymentProof}
                        alt="Chứng từ chuyển khoản"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium transition-opacity">
                        Phóng to
                      </div>
                    </div>
                    <div className="space-y-2 text-xs">
                      <p className="text-stone-600">
                        Khách hàng đã gửi biên lai thanh toán. Vui lòng kiểm tra biến động số dư tài khoản ngân hàng trước khi xác nhận đơn.
                      </p>
                      {selectedOrder.paymentStatus !== "paid" ? (
                        <Button
                          size="sm"
                          onClick={() => updatePaymentStatus(selectedOrder.id, "paid")}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 h-8 text-xs font-semibold"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Xác nhận đã nhận tiền (Khớp lệnh)
                        </Button>
                      ) : (
                        <p className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Đã xác nhận thanh toán thành công
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <Separator />

              {/* Ordered Herbs */}
              <div className="space-y-2.5">
                <h4 className="font-bold text-sm text-stone-900">
                  Danh sách cây thuốc đã đặt ({selectedOrder.items.length})
                </h4>
                {selectedOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-xl bg-stone-100 flex items-center justify-center shrink-0 overflow-hidden border">
                        {item.productImage ? (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Leaf className="h-5 w-5 text-emerald-800/40" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-stone-900">
                          {item.productName}
                        </p>
                        <p className="text-xs text-stone-500">
                          Đơn giá: {formatPrice(item.price)} • Số lượng: <strong>x{item.quantity}</strong>
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-emerald-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Calculation & Payment method */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>Phương thức thanh toán:</span>
                  <span className="font-bold text-stone-900">
                    {paymentMethodMap[selectedOrder.paymentMethod]?.label}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Tiền hàng:</span>
                  <span>{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Phí giao hàng:</span>
                  <span>
                    {selectedOrder.shippingFee === 0
                      ? "Miễn phí"
                      : formatPrice(selectedOrder.shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-stone-200">
                  <span>Tổng tiền đơn hàng:</span>
                  <span className="text-emerald-900 text-xl font-extrabold">
                    {formatPrice(selectedOrder.total)}
                  </span>
                </div>
              </div>

              {/* Quick Status Bar */}
              <div className="p-4 rounded-2xl bg-stone-100/70 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs font-bold text-stone-800 shrink-0">
                  Cập nhật tiến độ:
                </span>
                <div className="flex gap-1.5 flex-wrap">
                  {(["confirmed", "processing", "shipping", "delivered"] as OrderStatus[]).map((st) => (
                    <Button
                      key={st}
                      size="sm"
                      variant={selectedOrder.status === st ? "default" : "outline"}
                      className={`text-xs h-7.5 rounded-lg ${
                        selectedOrder.status === st ? "bg-emerald-800 text-white" : "border-stone-300"
                      }`}
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

      {/* Proof Lightbox Modal */}
      <Dialog open={!!viewProofModal} onOpenChange={() => setViewProofModal(null)}>
        <DialogContent className="max-w-3xl p-4 bg-white rounded-2xl">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-base font-bold text-stone-900">
              Ảnh Chứng Từ Chuyển Khoản
            </DialogTitle>
          </DialogHeader>
          {viewProofModal && (
            <div className="flex flex-col items-center justify-center p-2">
              <img
                src={viewProofModal}
                alt="Chứng từ chuyển khoản đầy đủ"
                className="max-h-[75vh] w-auto object-contain rounded-xl border shadow-md"
              />
              <div className="mt-3 flex justify-end w-full">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewProofModal(null)}
                >
                  Đóng
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
