"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
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
  Upload,
  Image as ImageIcon,
  Trash2,
  Search,
  Building2,
  CreditCard,
  AlertCircle,
  FileCheck,
} from "lucide-react";

interface BankSettingData {
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountHolder: string;
  isActive: boolean;
  qrTemplate: string;
}

const DEFAULT_BANK_SETTING: BankSettingData = {
  bankName: "Ngân hàng Quân Đội (MB Bank)",
  bankCode: "MB",
  accountNumber: "0964001203",
  accountHolder: "TA NGOC DUONG",
  isActive: true,
  qrTemplate: "compact2",
};

export default function CheckoutForm() {
  const { state, subtotal, clearCart, totalItems } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer"); // Mặc định VietQR
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

  // Cấu hình ngân hàng động từ Admin
  const [bankSetting, setBankSetting] = useState<BankSettingData>(DEFAULT_BANK_SETTING);

  // Ảnh chụp màn hình chuyển khoản (Chứng từ giao dịch)
  const [paymentProof, setPaymentProof] = useState<string | null>(null);
  const [isUploadingProof, setIsUploadingProof] = useState(false);
  const [postOrderProofUploaded, setPostOrderProofUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const postFileInputRef = useRef<HTMLInputElement>(null);

  // Tạo mã đơn hàng duy nhất cho phiên đặt hàng
  const [orderCode] = useState(() => {
    const d = new Date().toISOString().slice(2, 10).replace(/-/g, "");
    return `DH${d}${Math.floor(1000 + Math.random() * 9000)}`;
  });

  // Tải cấu hình ngân hàng Admin
  useEffect(() => {
    fetch("/api/bank-setting")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setBankSetting(json.data);
        }
      })
      .catch((e) => console.error("Lỗi lấy cấu hình ngân hàng:", e));
  }, []);

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

  // URL tạo ảnh VietQR tự động theo chuẩn Napas 24/7 với ngân hàng từ CSDL
  const vietQrUrl = `https://img.vietqr.io/image/${bankSetting.bankCode}-${bankSetting.accountNumber}-${
    bankSetting.qrTemplate || "compact2"
  }.png?amount=${total}&addInfo=${orderCode}&accountName=${encodeURIComponent(
    bankSetting.accountHolder
  )}`;

  // Xử lý đọc file ảnh chụp màn hình chuyển khoản
  const handleProofImageChange = (e: React.ChangeEvent<HTMLInputElement>, isPostOrder = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn tệp định dạng hình ảnh (PNG, JPG, WEBP).");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert("Dung lượng ảnh tối đa là 8MB. Vui lòng chọn ảnh chụp màn hình nhỏ hơn.");
      return;
    }

    setIsUploadingProof(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      setPaymentProof(base64Data);
      setIsUploadingProof(false);

      // Nếu người dùng upload sau khi đã đặt hàng thành công
      if (isPostOrder && createdOrder) {
        try {
          await fetch("/api/orders/upload-proof", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderCode: createdOrder.orderNumber,
              orderId: createdOrder.id,
              paymentProof: base64Data,
            }),
          });
          setPostOrderProofUploaded(true);
        } catch (err) {
          console.error("Lỗi cập nhật ảnh chứng từ sau đặt hàng:", err);
        }
      }
    };
    reader.onerror = () => {
      alert("Có lỗi khi đọc file ảnh. Vui lòng thử lại!");
      setIsUploadingProof(false);
    };
    reader.readAsDataURL(file);
  };

  // Xử lý tạo nội dung tin nhắn gửi Zalo
  const getZaloMessageText = (ord: Order) => {
    const itemsList = ord.items
      .map((it) => `+ ${it.productName} (x${it.quantity})`)
      .join("\n");
    return `Chào Cây Thuốc Ông Han, tôi vừa đặt đơn hàng:\n- Mã đơn: ${ord.orderNumber}\n- Người nhận: ${ord.customer.fullName} (${ord.customer.phone})\n- Địa chỉ: ${ord.customer.address}, ${ord.customer.city}\n- Cây thuốc:\n${itemsList}\n- Tổng tiền: ${formatPrice(ord.total)}\n- Hình thức: ${
      ord.paymentMethod === "bank_transfer" ? "Chuyển khoản VietQR" : "COD"
    }\nNhờ nhà thuốc kiểm tra và xác nhận đơn giúp tôi nhé!`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state.items.length === 0) return;

    setIsSubmitting(true);

    const orderItems: OrderItem[] = state.items.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      productImage: item.product.images?.[0] || "",
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
      paymentProof: paymentProof || undefined,
      note,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 1. Lưu vào MySQL qua API /api/orders
    try {
      const fullAddress = `${customer.address}, ${
        customer.ward ? customer.ward + ", " : ""
      }${customer.district ? customer.district + ", " : ""}${customer.city}`;

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderCode,
          customerName: customer.fullName,
          customerPhone: customer.phone,
          customerEmail: customer.email,
          customerAddress: fullAddress,
          paymentMethod,
          paymentProof: paymentProof || null,
          notes: note,
          totalAmount: total,
          items: orderItems.map((it) => ({
            productId: it.productId,
            quantity: it.quantity,
            price: it.price,
          })),
        }),
      });

      const resData = await res.json();
      if (resData.success && resData.data) {
        newOrder.id = resData.data.id;
        newOrder.orderNumber = resData.data.orderCode;
      }
    } catch (err) {
      console.error("Lỗi lưu đơn hàng vào MySQL:", err);
    }

    // Backup lưu vào localStorage
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

  // Giao diện khi đặt hàng thành công
  if (orderPlaced && createdOrder) {
    const zaloMsg = getZaloMessageText(createdOrder);
    const zaloUrl = `https://zalo.me/0964001203?text=${encodeURIComponent(zaloMsg)}`;

    return (
      <div className="max-w-3xl mx-auto py-10 animate-fade-in space-y-8">
        {/* Success Header */}
        <div className="bg-white rounded-3xl p-8 border border-border/60 shadow-sm text-center">
          <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5 text-emerald-600">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="font-heading text-3xl font-bold mb-2 text-foreground">
            Đặt Hàng Thành Công!
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed mb-4">
            Cảm ơn quý khách <strong>{createdOrder.customer.fullName}</strong> đã tin dùng thảo dược thiên nhiên của Cây Thuốc Ông Han.
          </p>

          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-sm font-semibold mb-6">
            <span>Mã đơn hàng của bạn:</span>
            <span className="font-mono text-base text-emerald-700 font-bold">{createdOrder.orderNumber}</span>
          </div>

          {/* Stepper Preview */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left mb-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Tiến trình đơn hàng
            </p>
            <div className="flex items-center justify-between text-xs font-medium text-emerald-700">
              <span className="flex items-center gap-1 font-bold">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                1. Đã đặt hàng
              </span>
              <span className="text-slate-400">→</span>
              <span className="text-slate-500">2. Xác nhận thanh toán</span>
              <span className="text-slate-400">→</span>
              <span className="text-slate-500">3. Đóng gói & Bốc thuốc</span>
              <span className="text-slate-400">→</span>
              <span className="text-slate-500">4. Giao hàng</span>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href={`/tra-cuu-don-hang?code=${createdOrder.orderNumber}&phone=${createdOrder.customer.phone}`}
              className="w-full sm:w-auto"
            >
              <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-11 px-6 gap-2 shadow-md">
                <Search className="h-4 w-4" />
                <span>Tra Cứu & Theo Dõi Tiến Trình</span>
              </Button>
            </Link>

            <a
              href={zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button variant="outline" className="w-full sm:w-auto text-[#0068FF] border-[#0068FF]/30 hover:bg-[#0068FF]/10 font-semibold h-11 px-5 gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>Nhắn Tin Zalo Cửa Hàng</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-80" />
              </Button>
            </a>

            <Button
              variant="ghost"
              onClick={() => copyToClipboard(zaloMsg, "order-summary")}
              className="w-full sm:w-auto h-11 px-4 gap-1.5 text-xs text-muted-foreground"
            >
              {copiedKey === "order-summary" ? (
                <>
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>Đã sao chép</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Sao chép tóm tắt đơn</span>
                </>
              )}
            </Button>
          </div>

          {/* Telegram Status */}
          <div className="mt-4 text-xs text-muted-foreground flex items-center justify-center gap-1.5">
            <Send className="h-3.5 w-3.5 text-emerald-600" />
            {telegramStatus === "sent" ? (
              <span className="text-emerald-700 font-medium">
                ✓ Đã tự động gửi thông báo đơn hàng về Telegram Bot của nhà thuốc
              </span>
            ) : (
              <span>
                Hệ thống đã lưu vào trang Quản trị Admin. Dược sĩ sẽ liên hệ theo SĐT <strong>{createdOrder.customer.phone}</strong> sớm nhất.
              </span>
            )}
          </div>
        </div>

        {/* VietQR Bank Transfer Box if Chosen */}
        {createdOrder.paymentMethod === "bank_transfer" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/30 shadow-md">
            <div className="flex items-center gap-2.5 mb-6 text-emerald-800">
              <QrCode className="h-6 w-6 text-emerald-600" />
              <h3 className="font-heading text-xl font-bold">
                Thanh Toán Chuyển Khoản Qua VietQR
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* QR Image */}
              <div className="flex flex-col items-center bg-emerald-50/40 p-5 rounded-2xl border border-emerald-100">
                <img
                  src={vietQrUrl}
                  alt="Mã VietQR thanh toán Cây Thuốc Ông Han"
                  className="w-full max-w-[260px] aspect-square object-contain rounded-xl shadow-xs bg-white p-2 border"
                />
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Mở ứng dụng ngân hàng hoặc ví điện tử bất kỳ quét mã để tự động điền số tiền và nội dung
                </p>
              </div>

              {/* Bank Details with Copy */}
              <div className="space-y-3.5">
                <div className="p-3.5 rounded-xl bg-slate-50 border space-y-1">
                  <span className="text-xs text-muted-foreground">Ngân hàng thụ hưởng:</span>
                  <p className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-emerald-600" />
                    {bankSetting.bankName}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border flex items-center justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground">Số tài khoản:</span>
                    <p className="font-mono font-bold text-base text-emerald-700">
                      {bankSetting.accountNumber}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 gap-1 text-xs"
                    onClick={() => copyToClipboard(bankSetting.accountNumber, "acc")}
                  >
                    {copiedKey === "acc" ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    <span>{copiedKey === "acc" ? "Đã chép" : "Sao chép"}</span>
                  </Button>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border space-y-1">
                  <span className="text-xs text-muted-foreground">Chủ tài khoản:</span>
                  <p className="font-semibold text-sm uppercase text-slate-900">{bankSetting.accountHolder}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border flex items-center justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground">Số tiền thanh toán:</span>
                    <p className="font-bold text-lg text-emerald-700">
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
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    <span>{copiedKey === "amount" ? "Đã chép" : "Sao chép"}</span>
                  </Button>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-amber-800 font-medium">Nội dung chuyển khoản (bắt buộc):</span>
                    <p className="font-mono font-bold text-sm text-amber-900">
                      {createdOrder.orderNumber}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1 text-xs bg-white text-amber-900 border-amber-300"
                    onClick={() => copyToClipboard(createdOrder.orderNumber, "code")}
                  >
                    {copiedKey === "code" ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    <span>{copiedKey === "code" ? "Đã chép" : "Sao chép"}</span>
                  </Button>
                </div>

                {/* Upload Proof on Success Screen */}
                <div className="pt-2">
                  <input
                    ref={postFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleProofImageChange(e, true)}
                    className="hidden"
                  />
                  {paymentProof || postOrderProofUploaded ? (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileCheck className="h-5 w-5 text-emerald-600" />
                        <div>
                          <p className="text-xs font-bold text-emerald-900">
                            Đã tải lên chứng từ chuyển khoản
                          </p>
                          <p className="text-[11px] text-emerald-700">
                            Nhà thuốc đã nhận ảnh và sẽ duyệt đơn của bạn nhanh chóng.
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => postFileInputRef.current?.click()}
                        className="text-xs h-7 border-emerald-300 text-emerald-800"
                      >
                        Đổi ảnh
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => postFileInputRef.current?.click()}
                      variant="outline"
                      disabled={isUploadingProof}
                      className="w-full border-dashed border-2 border-emerald-400 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-800 h-10 gap-2 text-xs font-semibold"
                    >
                      <Upload className="h-4 w-4" />
                      <span>{isUploadingProof ? "Đang xử lý ảnh..." : "Tải lên ảnh chụp màn hình chuyển khoản ngay"}</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation bottom */}
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Link href="/">
            <Button variant="outline" className="h-11 px-6">
              Quay lại trang chủ
            </Button>
          </Link>
          <Link href={`/tra-cuu-don-hang?code=${createdOrder.orderNumber}&phone=${createdOrder.customer.phone}`}>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white h-11 px-6 gap-2">
              <Search className="h-4 w-4" />
              <span>Xem Chi Tiết & Tiến Độ Đơn Hàng</span>
            </Button>
          </Link>
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
                <Label htmlFor="phone" className="text-sm font-medium">Số điện thoại * (dùng tra cứu đơn hàng)</Label>
                <Input
                  id="phone"
                  required
                  type="tel"
                  value={customer.phone}
                  onChange={(e) =>
                    setCustomer({ ...customer, phone: e.target.value })
                  }
                  placeholder="0964xxxxxx"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium">Email (nếu có)</Label>
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
                  placeholder="Hưng Yên / Hà Nội / TP. Hồ Chí Minh..."
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
                  label: "Chuyển khoản VietQR (Khuyên dùng - Nhanh chóng & Chính xác)",
                  icon: QrCode,
                  badge: "Miễn phí chuyển",
                  desc: "Mã QR ngân hàng tự điền đúng số tiền và nội dung đơn hàng, quét app ngân hàng là hoàn tất.",
                },
                {
                  id: "cod",
                  label: "Thanh toán khi nhận hàng (COD)",
                  icon: Banknote,
                  badge: "Kiểm tra hàng trước",
                  desc: "Nhận kiện hàng thảo dược, kiểm tra chất lượng đúng sản phẩm rồi mới thanh toán tiền mặt cho shipper.",
                },
                {
                  id: "momo",
                  label: "Ví điện tử MoMo",
                  icon: Smartphone,
                  badge: "Tiện lợi",
                  desc: "Chuyển tiền nhanh chóng qua số điện thoại ví MoMo của nhà thuốc.",
                },
              ].map((method) => (
                <label
                  key={method.id}
                  className={`flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === method.id
                      ? "border-emerald-600 bg-emerald-50/20"
                      : "border-border hover:border-emerald-300 bg-white"
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
                          ? "bg-emerald-600 text-white"
                          : "bg-accent text-muted-foreground"
                      }`}
                    >
                      <method.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{method.label}</p>
                        {method.badge && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">
                            {method.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {method.desc}
                      </p>
                    </div>
                  </div>

                  {/* Inline VietQR Details & Screenshot Upload when bank_transfer is selected */}
                  {paymentMethod === "bank_transfer" && method.id === "bank_transfer" && (
                    <div className="mt-4 pt-4 border-t border-emerald-200/60 space-y-4">
                      {/* Bank Details & QR Row */}
                      <div className="flex flex-col sm:flex-row items-center gap-5 bg-white p-4 rounded-xl border border-slate-200">
                        <div className="relative group shrink-0">
                          <img
                            src={vietQrUrl}
                            alt="Xem trước VietQR"
                            className="w-32 h-32 object-contain rounded-lg border shadow-xs bg-white p-1"
                          />
                          <span className="absolute bottom-1 right-1 text-[9px] bg-black/70 text-white px-1.5 py-0.5 rounded">
                            VietQR
                          </span>
                        </div>

                        <div className="text-xs space-y-1.5 flex-1 w-full">
                          <p className="font-bold text-emerald-800 text-sm flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            Thông tin tài khoản nhà thuốc:
                          </p>
                          <div className="space-y-1 text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                            <p className="flex justify-between">
                              <span className="text-slate-500">Ngân hàng:</span>
                              <strong>{bankSetting.bankName}</strong>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-slate-500">Số tài khoản:</span>
                              <strong className="font-mono text-emerald-700">{bankSetting.accountNumber}</strong>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-slate-500">Chủ tài khoản:</span>
                              <strong>{bankSetting.accountHolder}</strong>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-slate-500">Nội dung chuyển:</span>
                              <strong className="font-mono text-amber-700">{orderCode}</strong>
                            </p>
                          </div>
                          <p className="text-[11px] text-muted-foreground italic">
                            * Bạn có thể quét mã QR ngay bây giờ hoặc sau khi bấm &ldquo;Xác Nhận Đặt Hàng&rdquo;.
                          </p>
                        </div>
                      </div>

                      {/* Payment Proof Upload Box */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-emerald-300">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <ImageIcon className="h-4 w-4 text-emerald-600" />
                            Ảnh chụp màn hình chuyển khoản (Chứng từ giao dịch)
                          </Label>
                          <span className="text-[11px] text-muted-foreground">Không bắt buộc</span>
                        </div>

                        <p className="text-xs text-muted-foreground mb-3">
                          Tải lên ảnh chụp thông báo chuyển tiền thành công trên App Ngân hàng để dược sĩ xác nhận đơn hàng nhanh nhất.
                        </p>

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleProofImageChange(e, false)}
                          className="hidden"
                        />

                        {paymentProof ? (
                          <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-emerald-200">
                            <img
                              src={paymentProof}
                              alt="Chứng từ chuyển khoản"
                              className="h-16 w-16 object-cover rounded-md border"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Đã đính kèm ảnh chụp màn hình
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                Ảnh sẽ được gửi kèm đơn hàng đến nhà thuốc
                              </p>
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setPaymentProof(null);
                                if (fileInputRef.current) fileInputRef.current.value = "";
                              }}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploadingProof}
                            className="w-full bg-white border border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-700 text-xs h-10 gap-2"
                          >
                            <Upload className="h-4 w-4 text-emerald-600" />
                            <span>{isUploadingProof ? "Đang xử lý ảnh..." : "Chọn ảnh chụp màn hình chuyển khoản"}</span>
                          </Button>
                        )}
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
                  <div className="h-12 w-12 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 overflow-hidden relative border border-emerald-100">
                    {item.product.images?.[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Leaf className="h-6 w-6 text-emerald-600/40" />
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
                  <p className="text-sm font-bold shrink-0 text-emerald-700">
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
                    <span className="text-emerald-600 font-semibold">Miễn phí (Đơn ≥ 300k)</span>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-baseline pt-1">
                <span className="text-base font-bold">Tổng thanh toán:</span>
                <span className="text-2xl font-extrabold text-emerald-700">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || state.items.length === 0}
              size="lg"
              className="w-full h-12 text-base font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md gap-2"
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
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Cam kết 100% thảo dược thiên nhiên chuẩn sạch</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Giao hàng hỏa tốc toàn quốc, kiểm tra trước khi nhận</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
