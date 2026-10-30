"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  MapPin,
  Phone,
  AlertCircle,
  FileText,
  CreditCard,
  Flame,
  ShieldCheck,
  Leaf,
  Upload,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Danh sách các bước trong tiến trình đơn hàng thảo dược
const ORDER_STEPS = [
  {
    key: "pending",
    title: "Đã Đặt Hàng",
    desc: "Đơn hàng đã được ghi nhận trên hệ thống",
    icon: FileText,
    stepNum: 1,
  },
  {
    key: "confirmed",
    title: "Đã Xác Nhận",
    desc: "Dược sĩ đã duyệt đơn & đối soát thanh toán",
    icon: CreditCard,
    stepNum: 2,
  },
  {
    key: "processing",
    title: "Đang Đóng Gói / Sắc Thuốc",
    desc: "Chuẩn bị thảo dược, sao tẩm sấy sạch",
    icon: Flame,
    stepNum: 3,
  },
  {
    key: "shipping",
    title: "Đang Giao Hàng",
    desc: "Đang trên đường vận chuyển tới địa chỉ của bạn",
    icon: Truck,
    stepNum: 4,
  },
  {
    key: "delivered",
    title: "Hoàn Thành",
    desc: "Đã giao hàng thành công đến tay quý khách",
    icon: CheckCircle2,
    stepNum: 5,
  },
];

const statusStepIndexMap: Record<string, number> = {
  pending: 1,
  confirmed: 2,
  processing: 3,
  shipping: 4,
  delivered: 5,
  cancelled: -1,
};

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") || "";
  const initialPhone = searchParams.get("phone") || "";

  const [orderCode, setOrderCode] = useState(initialCode);
  const [phone, setPhone] = useState(initialPhone);
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Upload proof on tracking page
  const [isUploadingProof, setIsUploadingProof] = useState(false);
  const [proofUploadedMessage, setProofUploadedMessage] = useState(false);
  const proofInputRef = useRef<HTMLInputElement>(null);

  const fetchTrackOrder = async (codeToSearch: string, phoneToSearch: string) => {
    if (!codeToSearch.trim() || !phoneToSearch.trim()) {
      setErrorMessage("Vui lòng điền cả Mã đơn hàng và Số điện thoại nhận hàng.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderCode: codeToSearch.trim(),
          phone: phoneToSearch.trim(),
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setOrderData(json.data);
      } else {
        setOrderData(null);
        setErrorMessage(
          json.error || "Không tìm thấy đơn hàng. Vui lòng kiểm tra lại mã đơn và số điện thoại."
        );
      }
    } catch (err: any) {
      setOrderData(null);
      setErrorMessage("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  // Tự động tìm kiếm nếu URL có sẵn tham số code & phone
  useEffect(() => {
    if (initialCode && initialPhone) {
      fetchTrackOrder(initialCode, initialPhone);
    }
  }, [initialCode, initialPhone]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrackOrder(orderCode, phone);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Upload thêm chứng từ thanh toán
  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !orderData) return;

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file hình ảnh (PNG, JPG, WEBP).");
      return;
    }

    setIsUploadingProof(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      try {
        const res = await fetch("/api/orders/upload-proof", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderCode: orderData.orderCode,
            orderId: orderData.id,
            paymentProof: base64Data,
          }),
        });
        const resData = await res.json();
        if (resData.success) {
          setOrderData((prev: any) => ({
            ...prev,
            paymentProof: base64Data,
            paymentStatus: "pending_review",
          }));
          setProofUploadedMessage(true);
          setTimeout(() => setProofUploadedMessage(false), 4000);
        }
      } catch (err) {
        console.error("Lỗi tải lên chứng từ:", err);
      } finally {
        setIsUploadingProof(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const currentStep = orderData ? statusStepIndexMap[orderData.status] || 1 : 1;
  const isCancelled = orderData?.status === "cancelled";

  return (
    <div className="min-h-screen bg-stone-50/60 py-10 sm:py-14">
      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        {/* Header Hero */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <Package className="h-3.5 w-3.5" />
            <span>Theo Dõi Vận Đơn Thảo Dược</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Tra Cứu Tiến Độ Đơn Hàng
          </h1>
          <p className="text-stone-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Nhập Mã đơn hàng và Số điện thoại bạn đã dùng khi đặt thuốc để xem trạng thái đóng gói, vận chuyển và biên lai thanh toán real-time.
          </p>
        </div>

        {/* Search Card Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-md">
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="orderCode" className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Mã đơn hàng *
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="orderCode"
                    required
                    placeholder="Ví dụ: DH2610301234"
                    value={orderCode}
                    onChange={(e) => setOrderCode(e.target.value.toUpperCase())}
                    className="font-mono font-bold uppercase pl-3.5 h-11 border-stone-300 focus:ring-emerald-500 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone" className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Số điện thoại nhận hàng *
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="phone"
                    required
                    type="tel"
                    placeholder="0964xxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-3.5 h-11 border-stone-300 focus:ring-emerald-500 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md gap-2"
            >
              {isLoading ? (
                <span>Đang tra cứu dữ liệu...</span>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span>Tra Cứu Đơn Hàng Ngay</span>
                </>
              )}
            </Button>
          </form>

          {/* Tips under form */}
          <div className="mt-4 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500">
            <span>
              Cần hỗ trợ gấp về đơn thuốc? Hotline: <a href="tel:0964001203" className="font-bold text-emerald-700 hover:underline">0964001203</a>
            </span>
            <Link href="/account/orders" className="text-emerald-700 font-semibold hover:underline">
              Đã có tài khoản? Xem Lịch Sử Đơn Hàng →
            </Link>
          </div>
        </div>

        {/* ORDER DETAILS & STEPPER DISPLAY */}
        {orderData && (
          <div className="space-y-6 animate-fade-in">
            {/* Status Stepper Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-3">
                <div>
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Thông tin đơn hàng
                  </span>
                  <div className="flex items-center gap-3 mt-1">
                    <h2 className="font-mono text-xl sm:text-2xl font-extrabold text-emerald-900">
                      {orderData.orderCode}
                    </h2>
                    <Badge
                      className={
                        isCancelled
                          ? "bg-rose-100 text-rose-800"
                          : currentStep === 5
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-blue-100 text-blue-800"
                      }
                    >
                      {isCancelled
                        ? "ĐÃ HỦY ĐƠN"
                        : ORDER_STEPS.find((s) => s.stepNum === currentStep)?.title || "Đang xử lý"}
                    </Badge>
                  </div>
                </div>

                <div className="text-xs text-stone-500 sm:text-right">
                  <p>Thời gian đặt: {new Date(orderData.createdAt).toLocaleString("vi-VN")}</p>
                  <p className="mt-0.5">
                    Hình thức:{" "}
                    <strong>
                      {orderData.paymentMethod === "bank_transfer"
                        ? "Chuyển khoản VietQR"
                        : orderData.paymentMethod === "momo"
                        ? "Ví MoMo"
                        : "Tiền mặt khi nhận (COD)"}
                    </strong>
                  </p>
                </div>
              </div>

              {/* Cancelled Banner */}
              {isCancelled ? (
                <div className="my-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm space-y-1">
                  <div className="flex items-center gap-2 font-bold">
                    <AlertCircle className="h-5 w-5 text-rose-600" />
                    <span>Đơn hàng này đã bị hủy.</span>
                  </div>
                  <p className="text-xs text-rose-700">
                    Nếu bạn có thắc mắc hoặc muốn khôi phục đơn thuốc, xin vui lòng gọi hotline <strong>0964001203</strong> để được dược sĩ hỗ trợ trực tiếp.
                  </p>
                </div>
              ) : (
                /* Stepper Component (5 Steps) */
                <div className="py-8">
                  <div className="relative">
                    {/* Background track line */}
                    <div className="absolute top-5 left-6 right-6 h-1 bg-stone-200 hidden sm:block -z-0" />
                    {/* Active track line */}
                    <div
                      className="absolute top-5 left-6 h-1 bg-emerald-600 hidden sm:block -z-0 transition-all duration-700"
                      style={{
                        width: `calc(${((Math.min(currentStep, 5) - 1) / 4) * 100}% - 48px)`,
                      }}
                    />

                    {/* Step Nodes */}
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2 relative z-10">
                      {ORDER_STEPS.map((step) => {
                        const isDone = currentStep > step.stepNum;
                        const isCurrent = currentStep === step.stepNum;
                        const isPending = currentStep < step.stepNum;
                        const Icon = step.icon;

                        return (
                          <div
                            key={step.key}
                            className="flex sm:flex-col items-center sm:text-center gap-3.5 sm:gap-2"
                          >
                            {/* Circle Node */}
                            <div
                              className={`h-11 w-11 rounded-full flex items-center justify-center shrink-0 border-2 font-bold text-sm transition-all duration-300 ${
                                isDone
                                  ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                                  : isCurrent
                                  ? "bg-emerald-50 border-emerald-600 text-emerald-700 ring-4 ring-emerald-100 shadow-md scale-105"
                                  : "bg-white border-stone-300 text-stone-400"
                              }`}
                            >
                              {isDone ? (
                                <Check className="h-5 w-5 stroke-[2.5]" />
                              ) : (
                                <Icon className="h-5 w-5" />
                              )}
                            </div>

                            {/* Label */}
                            <div className="sm:mt-1 text-left sm:text-center">
                              <p
                                className={`text-xs font-bold ${
                                  isCurrent
                                    ? "text-emerald-700"
                                    : isDone
                                    ? "text-stone-900"
                                    : "text-stone-400"
                                }`}
                              >
                                {step.title}
                              </p>
                              <p className="text-[11px] text-stone-500 line-clamp-2 max-w-[150px] mx-auto mt-0.5 hidden sm:block">
                                {step.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Status Note Highlight */}
              {!isCancelled && (
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center gap-3 text-xs text-emerald-900">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold">Trạng thái hiện tại: </span>
                    <span>
                      {ORDER_STEPS.find((s) => s.stepNum === currentStep)?.desc ||
                        "Nhà thuốc đang xử lý đơn hàng theo đúng quy chuẩn Đông Y."}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Details Breakdown (2 Columns) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column (2 Cols): Products List */}
              <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-md space-y-4">
                <h3 className="font-heading text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-emerald-600" />
                  <span>Danh Sách Cây Thuốc & Dược Liệu ({orderData.items?.length || 0})</span>
                </h3>

                <div className="space-y-3 divide-y divide-stone-100">
                  {orderData.items?.map((item: any) => (
                    <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 overflow-hidden">
                          {item.product?.images?.[0] ? (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Leaf className="h-6 w-6 text-emerald-600/40" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-stone-900 truncate">
                            {item.product?.name || "Cây thuốc nam"}
                          </p>
                          <p className="text-xs text-stone-500">
                            {formatPrice(item.price)} × <strong>{item.quantity}</strong>
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-extrabold text-emerald-800 shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Price summary */}
                <div className="space-y-2 text-xs sm:text-sm text-stone-600 pt-1">
                  <div className="flex justify-between">
                    <span>Tiền dược liệu:</span>
                    <span className="font-semibold text-stone-900">{formatPrice(orderData.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí vận chuyển:</span>
                    <span className="text-emerald-700 font-semibold">Miễn phí giao hàng</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-baseline pt-1">
                    <span className="font-bold text-stone-900 text-base">Tổng tiền thanh toán:</span>
                    <span className="text-xl font-extrabold text-emerald-800">
                      {formatPrice(orderData.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column (1 Col): Customer & Payment Info */}
              <div className="space-y-6">
                {/* Customer card */}
                <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-md space-y-3">
                  <h3 className="font-heading text-sm font-bold text-stone-900 uppercase tracking-wider">
                    Thông Tin Người Nhận
                  </h3>
                  <div className="space-y-2 text-xs text-stone-600">
                    <p className="font-bold text-sm text-stone-900">{orderData.customerName}</p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{orderData.customerPhone}</span>
                    </p>
                    <p className="flex items-start gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{orderData.customerAddress}</span>
                    </p>
                    {orderData.notes && (
                      <p className="pt-2 text-stone-700 italic border-t border-stone-100">
                        &ldquo;{orderData.notes}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                {/* Payment & Proof Card */}
                <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-md space-y-3">
                  <h3 className="font-heading text-sm font-bold text-stone-900 uppercase tracking-wider">
                    Chứng Từ Thanh Toán
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-stone-500">Trạng thái tiền:</span>
                      <Badge
                        className={
                          orderData.paymentStatus === "paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }
                      >
                        {orderData.paymentStatus === "paid"
                          ? "Đã thanh toán"
                          : orderData.paymentStatus === "pending_review"
                          ? "Chờ xác nhận tiền"
                          : "Chưa thanh toán"}
                      </Badge>
                    </div>

                    {/* Screenshot / Proof preview if available */}
                    {orderData.paymentProof ? (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Đã đính kèm ảnh chuyển khoản
                          </span>
                        </div>
                        <a
                          href={orderData.paymentProof}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block rounded-lg overflow-hidden border border-emerald-200 bg-white"
                        >
                          <img
                            src={orderData.paymentProof}
                            alt="Biên lai chuyển khoản"
                            className="w-full h-32 object-cover hover:scale-105 transition-transform"
                          />
                        </a>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-stone-500 text-[11px]">
                          Nếu bạn đã chuyển khoản qua VietQR, hãy tải ảnh chụp biên lai để được ưu tiên bốc thuốc sớm.
                        </p>
                        <input
                          ref={proofInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleProofUpload}
                          className="hidden"
                        />
                        <Button
                          variant="outline"
                          disabled={isUploadingProof}
                          onClick={() => proofInputRef.current?.click()}
                          className="w-full text-xs h-9 border-dashed border-emerald-400 text-emerald-800 gap-1.5"
                        >
                          <Upload className="h-3.5 w-3.5" />
                          <span>{isUploadingProof ? "Đang gửi ảnh..." : "Tải ảnh chuyển khoản"}</span>
                        </Button>
                      </div>
                    )}

                    {proofUploadedMessage && (
                      <p className="text-xs text-emerald-700 font-semibold text-center">
                        ✓ Đã cập nhật ảnh chứng từ thành công!
                      </p>
                    )}
                  </div>
                </div>

                {/* Direct Hotline Box */}
                <div className="p-4 rounded-3xl bg-emerald-800 text-white space-y-2 text-center shadow-md">
                  <p className="text-xs font-semibold text-emerald-200 uppercase tracking-wider">
                    Cần Hỗ Trợ Đơn Hàng?
                  </p>
                  <p className="font-mono text-xl font-bold">0964 001 203</p>
                  <p className="text-[11px] text-emerald-100/80">
                    Thôn Lễ Thần, xã Thái Ninh, tỉnh Hưng Yên
                  </p>
                  <div className="pt-2 flex justify-center gap-2">
                    <a href="tel:0964001203">
                      <Button size="sm" className="bg-white text-emerald-900 hover:bg-emerald-50 font-bold h-8 text-xs">
                        Gọi Ngay
                      </Button>
                    </a>
                    <a href="https://zalo.me/0964001203" target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline" className="border-white/40 text-white hover:bg-white/10 h-8 text-xs">
                        Nhắn Zalo
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Đang tải trang tra cứu đơn hàng...</div>}>
      <OrderTrackingContent />
    </Suspense>
  );
}
