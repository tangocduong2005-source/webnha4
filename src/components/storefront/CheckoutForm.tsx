"use client";

import { useState } from "react";
import { useCart } from "@/lib/store";
import { CustomerInfo, Order, OrderItem } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Banknote,
  Smartphone,
  CheckCircle2,
  Leaf,
  Truck,
  Copy,
  Check,
  QrCode,
  Send,
  MessageSquare,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

// Cấu hình thanh toán VietQR & Thông báo chủ cửa hàng
const BANK_CONFIG = {
  bankId: "MB",
  bankName: "Ngân hàng Quân Đội (MB Bank)",
  accountNo: "0345678999",
  accountName: "THAO DUOC XANH",
  zaloPhone: "0987654321",
};

export default function CheckoutForm() {
  const { state, subtotal, clearCart, totalItems } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer"); // Mặc định mở VietQR
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [telegramStatus, setTelegramStatus] = useState<"idle" | "sent" | "not_configured">("idle");
  const [note, setNote] = useState("");
  const [customer, setCustomer] = useState<CustomerInfo>({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    ward: "",
    district: "",
    city: "Hà Nội",
  });

  // Tạo mã đơn ngẫu nhiên theo phiên
  const [orderCode] = useState(() => `DH${Math.floor(100000 + Math.random() * 900000)}`);

  const shippingFee = subtotal >= 300000 ? 0 : 30000;
  const total = subtotal + shippingFee;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const copyToClipboard = (text: string, key: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  // URL tạo ảnh VietQR tự động theo chuẩn Napas 24/7
  const vietQrUrl = `https://img.vietqr.io/image/${BANK_CONFIG.bankId}-${BANK_CONFIG.accountNo}-compact2.png?amount=${total}&addInfo=${orderCode}&accountName=${encodeURIComponent(
    BANK_CONFIG.accountName
  )}`;

  // Xử lý tạo nội dung tin nhắn gửi Zalo
  const getZaloMessageText = (ord: Order) => {
    const itemsList = ord.items
      .map((it) => `+ ${it.productName} (x${it.quantity})`)
      .join("\n");
    return `Chào Thảo Dược Xanh, tôi vừa đặt đơn hàng:\n- Mã đơn: ${ord.orderNumber}\n- Người nhận: ${ord.customer.fullName} (${ord.customer.phone})\n- Địa chỉ: ${ord.customer.address}, ${ord.customer.city}\n- Cây thuốc:\n${itemsList}\n- Tổng tiền: ${formatPrice(ord.total)}\n- Hình thức: ${
      ord.paymentMethod === "bank_transfer" ? "Chuyển khoản VietQR" : "COD"
    }\nNhờ shop kiểm tra và xác nhận đơn giúp tôi nhé!`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state.items.length === 0) return;

    setIsSubmitting(true);

    const orderItems: OrderItem[] = state.items.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      productImage: item.product.images[0] || "",
      price: item.product.price,
      quantity: item.quantity,
    }));

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderCode,
      items: orderItems,
      customer,
      subtotal,
      shippingFee,
      total,
      status: "pending",
      paymentMethod: paymentMethod as "cod" | "bank_transfer" | "momo",
      note,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 1. Lưu vào localStorage cho Admin
    try {
      const existing = localStorage.getItem("thaoduocxanh-orders");
      const list: Order[] = existing ? JSON.parse(existing) : [];
      list.unshift(newOrder);
      localStorage.setItem("thaoduocxanh-orders", JSON.stringify(list));
    } catch (err) {
      console.error("Lỗi lưu đơn hàng vào localStorage:", err);
    }

    // 2. Gửi thông báo về Telegram Bot qua API route
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });
      const resData = await res.json();
      if (resData.telegramSent) {
        setTelegramStatus("sent");
      } else {
        setTelegramStatus("not_configured");
      }
    } catch {
      setTelegramStatus("not_configured");
    }

    setCreatedOrder(newOrder);
    setOrderPlaced(true);
    clearCart();
    setIsSubmitting(false);
  };

  if (orderPlaced && createdOrder) {
    const zaloMsg = getZaloMessageText(createdOrder);
    const zaloUrl = `https://zalo.me/${BANK_CONFIG.zaloPhone}?text=${encodeURIComponent(
      zaloMsg
    )}`;

    return (
      <div className="max-w-3xl mx-auto py-10 animate-fade-in space-y-8">
        {/* Success Header */}
        <div className="bg-white rounded-3xl p-8 border border-border/60 shadow-sm text-center">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5 text-primary">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="font-heading text-3xl font-bold mb-2 text-foreground">
            Đặt Hàng Thành Công!
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed mb-4">
            Cảm ơn quý khách <strong>{createdOrder.customer.fullName}</strong> đã tin dùng thảo dược thiên nhiên của Thảo Dược Xanh.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/50 text-foreground text-sm font-semibold mb-6">
            <span>Mã đơn hàng:</span>
            <span className="text-primary font-mono text-base">{createdOrder.orderNumber}</span>
          </div>

          {/* Quick Actions Bar (Zalo & Telegram) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button className="w-full sm:w-auto bg-[#0068FF] hover:bg-[#0052cc] text-white font-semibold h-11 px-6 gap-2 shadow-sm">
                <MessageSquare className="h-4 w-4" />
                <span>Gửi Đơn Qua Zalo Chủ Shop</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-80" />
              </Button>
            </a>

            <Button
              variant="outline"
              onClick={() => copyToClipboard(zaloMsg, "order-summary")}
              className="w-full sm:w-auto h-11 px-5 gap-2"
            >
              {copiedKey === "order-summary" ? (
                <>
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Đã sao chép đơn</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Sao chép tin nhắn đơn hàng</span>
                </>
              )}
            </Button>
          </div>

          {/* Telegram Status Pill */}
          <div className="mt-4 text-xs text-muted-foreground flex items-center justify-center gap-1.5">
            <Send className="h-3.5 w-3.5 text-primary" />
            {telegramStatus === "sent" ? (
              <span className="text-green-600 font-medium">
                ✓ Đã tự động gửi thông báo đơn hàng về Telegram Bot của cửa hàng
              </span>
            ) : (
              <span>
                Hệ thống đã lưu vào trang Quản trị Admin. (Có thể kích hoạt Telegram Bot bằng cách thêm TELEGRAM_BOT_TOKEN)
              </span>
            )}
          </div>
        </div>

        {/* VietQR Bank Transfer Box if Chosen */}
        {createdOrder.paymentMethod === "bank_transfer" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-primary/30 shadow-md">
            <div className="flex items-center gap-2.5 mb-6 text-primary">
              <QrCode className="h-6 w-6" />
              <h3 className="font-heading text-xl font-bold">
                Thanh Toán Chuyển Khoản Qua VietQR
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* QR Image */}
              <div className="flex flex-col items-center bg-accent/20 p-5 rounded-2xl border">
                <img
                  src={vietQrUrl}
                  alt="Mã VietQR thanh toán Thảo Dược Xanh"
                  className="w-full max-w-[260px] aspect-square object-contain rounded-xl shadow-xs"
                />
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Mở ứng dụng ngân hàng hoặc ví điện tử bất kỳ quét mã để tự động điền số tiền và nội dung
                </p>
              </div>

              {/* Bank Details with Copy */}
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-accent/30 border space-y-1">
                  <span className="text-xs text-muted-foreground">Ngân hàng thụ hưởng:</span>
                  <p className="font-semibold text-sm text-foreground">{BANK_CONFIG.bankName}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-accent/30 border flex items-center justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground">Số tài khoản:</span>
                    <p className="font-mono font-bold text-base text-primary">
                      {BANK_CONFIG.accountNo}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 gap-1 text-xs"
                    onClick={() => copyToClipboard(BANK_CONFIG.accountNo, "acc")}
                  >
                    {copiedKey === "acc" ? (
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    <span>{copiedKey === "acc" ? "Đã chép" : "Sao chép"}</span>
                  </Button>
                </div>

                <div className="p-3.5 rounded-xl bg-accent/30 border space-y-1">
                  <span className="text-xs text-muted-foreground">Chủ tài khoản:</span>
                  <p className="font-semibold text-sm uppercase">{BANK_CONFIG.accountName}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-accent/30 border flex items-center justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground">Số tiền thanh toán:</span>
                    <p className="font-bold text-lg text-primary">
                      {formatPrice(createdOrder.total)}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 gap-1 text-xs"
                    onClick={() => copyToClipboard(createdOrder.total.toString(), "amount")}
                  >
                    {copiedKey === "amount" ? (
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    <span>{copiedKey === "amount" ? "Đã chép" : "Sao chép"}</span>
                  </Button>
                </div>

                <div className="p-3.5 rounded-xl bg-yellow-50 border border-yellow-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-yellow-800 font-medium">Nội dung chuyển khoản (bắt buộc):</span>
                    <p className="font-mono font-bold text-sm text-yellow-900">
                      {createdOrder.orderNumber}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1 text-xs bg-white text-yellow-900 border-yellow-300"
                    onClick={() => copyToClipboard(createdOrder.orderNumber, "code")}
                  >
                    {copiedKey === "code" ? (
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    <span>{copiedKey === "code" ? "Đã chép" : "Sao chép"}</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation bottom */}
        <div className="flex justify-center gap-4 pt-2">
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
            className="h-11 px-6"
          >
            Quay lại trang chủ
          </Button>
          <Button
            onClick={() => (window.location.href = "/admin/orders")}
            className="bg-primary hover:bg-primary/90 text-white h-11 px-6 gap-2"
          >
            <span>Xem Đơn Hàng Trong Admin</span>
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Customer info & Payment method */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer info card */}
          <div className="bg-white rounded-2xl p-6 border shadow-xs space-y-4">
            <h3 className="font-heading text-xl font-bold text-foreground">
              Thông Tin Giao Hàng
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label htmlFor="fullName" className="text-sm font-medium">Họ và tên người nhận *</Label>
                <Input
                  id="fullName"
                  required
                  value={customer.fullName}
                  onChange={(e) =>
                    setCustomer({ ...customer, fullName: e.target.value })
                  }
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-medium">Số điện thoại nhận hàng *</Label>
                <Input
                  id="phone"
                  required
                  value={customer.phone}
                  onChange={(e) =>
                    setCustomer({ ...customer, phone: e.target.value })
                  }
                  placeholder="Ví dụ: 0912 345 678"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium">Email (nhận hóa đơn điện tử)</Label>
                <Input
                  id="email"
                  type="email"
                  value={customer.email}
                  onChange={(e) =>
                    setCustomer({ ...customer, email: e.target.value })
                  }
                  placeholder="email@example.com"
                  className="mt-1"
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="address" className="text-sm font-medium">Địa chỉ nhận hàng (Số nhà, đường/thôn) *</Label>
                <Input
                  id="address"
                  required
                  value={customer.address}
                  onChange={(e) =>
                    setCustomer({ ...customer, address: e.target.value })
                  }
                  placeholder="Số 45 ngõ 12 đường Trần Phú"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="ward" className="text-sm font-medium">Phường / Xã</Label>
                <Input
                  id="ward"
                  value={customer.ward}
                  onChange={(e) =>
                    setCustomer({ ...customer, ward: e.target.value })
                  }
                  placeholder="Phường Dịch Vọng Hậu"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="district" className="text-sm font-medium">Quận / Huyện</Label>
                <Input
                  id="district"
                  value={customer.district}
                  onChange={(e) =>
                    setCustomer({ ...customer, district: e.target.value })
                  }
                  placeholder="Quận Cầu Giấy"
                  className="mt-1"
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="city" className="text-sm font-medium">Tỉnh / Thành phố *</Label>
                <Input
                  id="city"
                  required
                  value={customer.city}
                  onChange={(e) =>
                    setCustomer({ ...customer, city: e.target.value })
                  }
                  placeholder="Hà Nội / TP. Hồ Chí Minh..."
                  className="mt-1"
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="note" className="text-sm font-medium">Ghi chú cho dược sĩ hoặc người giao hàng</Label>
                <Textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ví dụ: Giao giờ hành chính, gọi điện trước khi tới, tư vấn thêm cách uống..."
                  rows={2}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Payment method selection */}
          <div className="bg-white rounded-2xl p-6 border shadow-xs space-y-4">
            <h3 className="font-heading text-xl font-bold text-foreground">
              Phương Thức Thanh Toán
            </h3>

            <div className="space-y-3">
              {[
                {
                  id: "bank_transfer",
                  label: "Chuyển khoản VietQR (Khuyên dùng - Nhanh chóng)",
                  icon: QrCode,
                  badge: "Miễn phí chuyển",
                  desc: "Hiển thị mã QR ngân hàng có sẵn số tiền & nội dung, quét bằng app ngân hàng là xong.",
                },
                {
                  id: "cod",
                  label: "Thanh toán khi nhận hàng (COD)",
                  icon: Banknote,
                  badge: "Được kiểm tra hàng",
                  desc: "Nhận kiện hàng dược liệu, kiểm tra đúng sản phẩm rồi mới thanh toán tiền mặt cho shipper.",
                },
                {
                  id: "momo",
                  label: "Ví điện tử MoMo",
                  icon: Smartphone,
                  badge: "Tiện lợi",
                  desc: "Chuyển tiền nhanh chóng qua số điện thoại ví MoMo của cửa hàng.",
                },
              ].map((method) => (
                <label
                  key={method.id}
                  className={`flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === method.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                        paymentMethod === method.id
                          ? "bg-primary text-white"
                          : "bg-accent text-muted-foreground"
                      }`}
                    >
                      <method.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{method.label}</p>
                        {method.badge && (
                          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">
                            {method.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {method.desc}
                      </p>
                    </div>
                  </div>

                  {/* Inline VietQR Preview when bank_transfer is selected */}
                  {paymentMethod === "bank_transfer" && method.id === "bank_transfer" && (
                    <div className="mt-4 pt-4 border-t border-primary/20 flex flex-col sm:flex-row items-center gap-5 bg-white p-4 rounded-xl border">
                      <img
                        src={vietQrUrl}
                        alt="Xem trước VietQR"
                        className="w-32 h-32 object-contain rounded-lg border shadow-xs"
                      />
                      <div className="text-xs space-y-1.5 flex-1">
                        <p className="font-semibold text-primary text-sm flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4" />
                          Mã VietQR đã sẵn sàng: {formatPrice(total)}
                        </p>
                        <p className="text-muted-foreground">
                          • Ngân hàng: <strong>{BANK_CONFIG.bankName}</strong>
                        </p>
                        <p className="text-muted-foreground">
                          • Số tài khoản: <strong>{BANK_CONFIG.accountNo}</strong> ({BANK_CONFIG.accountName})
                        </p>
                        <p className="text-muted-foreground">
                          • Nội dung: <strong className="text-primary">{orderCode}</strong>
                        </p>
                        <p className="text-muted-foreground italic">
                          Sau khi nhấn &ldquo;Đặt Mua Ngay&rdquo;, mã QR lớn sẽ hiển thị đầy đủ kèm tùy chọn gửi xác nhận qua Zalo.
                        </p>
                      </div>
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 border shadow-xs sticky top-32 space-y-5">
            <h3 className="font-heading text-xl font-bold">
              Đơn Hàng ({totalItems} món)
            </h3>

            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {state.items.map((item) => (
                <div key={item.product.id} className="flex gap-3 items-center">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden relative border">
                    {item.product.images?.[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Leaf className="h-6 w-6 text-primary/40" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.product.weight} • x{item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-bold shrink-0 text-primary">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <Separator />

            {/* Calculations */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Tiền dược liệu:</span>
                <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Phí vận chuyển:</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-green-600 font-semibold">Miễn phí (Đơn ≥ 300k)</span>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-baseline pt-1">
                <span className="text-base font-bold">Tổng thanh toán:</span>
                <span className="text-2xl font-extrabold text-primary">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || state.items.length === 0}
              size="lg"
              className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 text-white shadow-md gap-2"
            >
              {isSubmitting ? (
                <span>Đang xử lý đơn hàng...</span>
              ) : (
                <>
                  <Check className="h-5 w-5" />
                  <span>Xác Nhận Đặt Hàng</span>
                </>
              )}
            </Button>

            {/* Guarantees */}
            <div className="pt-2 text-xs text-muted-foreground space-y-1.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                <span>Cam kết 100% thảo dược thiên nhiên chuẩn sạch</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary shrink-0" />
                <span>Giao hàng hỏa tốc toàn quốc, kiểm tra trước khi trả tiền</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
