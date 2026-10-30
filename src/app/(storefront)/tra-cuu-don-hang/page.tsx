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
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// 5 Bước trong tiến trình đơn hàng thảo dược
const ORDER_STEPS = [
  {
    key: "pending",
    title: "1. Đặt Hàng",
    shortTitle: "Đặt hàng",
    desc: "Đã tiếp nhận thông tin đơn thuốc",
    icon: FileText,
    stepNum: 1,
  },
  {
    key: "confirmed",
    title: "2. Đã Xác Nhận",
    shortTitle: "Xác nhận",
    desc: "Dược sĩ duyệt đơn & xác nhận thanh toán",
    icon: CreditCard,
    stepNum: 2,
  },
  {
    key: "processing",
    title: "3. Đang Bốc Thuốc",
    shortTitle: "Bốc thuốc/Đóng gói",
    desc: "Chuẩn bị dược liệu, sao tẩm sấy sạch",
    icon: Flame,
    stepNum: 3,
  },
  {
    key: "shipping",
    title: "4. Đang Vận Chuyển",
    shortTitle: "Đang vận chuyển",
    desc: "Bàn giao đơn vị giao hàng hỏa tốc",
    icon: Truck,
    stepNum: 4,
  },
  {
    key: "delivered",
    title: "5. Đã Giao Thành Công",
    shortTitle: "Đã giao thành công",
    desc: "Quý khách đã nhận thuốc & kiểm tra",
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

  // Upload ảnh chứng từ
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
    } catch {
      setOrderData(null);
      setErrorMessage("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

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
    <div className="min-h-screen bg-stone-100/50 py-10 sm:py-14">
      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        {/* Tiêu đề trang */}
        <div className="text-center space-y-2.5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
            <Package className="h-3.5 w-3.5 text-emerald-700" />
            <span>Theo Dõi Đơn Hàng Thảo Dược</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Tra Cứu Tiến Trình Vận Đơn
          </h1>
          <p className="text-stone-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Nhập Mã đơn hàng (DH...) và Số điện thoại đặt thuốc để xem chi tiết tiến độ bốc thuốc, đóng gói và biên lai giao dịch.
          </p>
        </div>

        {/* Khung Tra cứu / Search Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm">
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
              className="w-full h-11.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md gap-2 text-sm"
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

          <div className="mt-4 pt-3.5 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500">
            <span>
              Cần hỗ trợ gấp? Hotline tư vấn: <a href="tel:0964001203" className="font-bold text-emerald-700 hover:underline">0964001203</a>
            </span>
            <Link href="/account/orders" className="text-emerald-700 font-semibold hover:underline">
              Xem Lịch Sử Đơn Hàng Cá Nhân →
            </Link>
          </div>
        </div>

        {/* 3 KHỐI CARD KẾT QUẢ THEO DÕI ĐƠN HÀNG */}
        {orderData && (
          <div className="space-y-6 animate-fade-in">
            {/* ============================================================== */}
            {/* KHUNG 1: TIẾN ĐỘ GIAO HÀNG (TIMELINE STEPPER 5 BƯỚC)          */}
            {/* ============================================================== */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
              {/* Header Khung 1 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-stone-200 gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-600" />
                    <span>Khung 1: Tiến Độ Đơn Thuốc</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <h2 className="font-mono text-2xl font-black text-emerald-950">
                      {orderData.orderCode}
                    </h2>
                    <Badge
                      className={
                        isCancelled
                          ? "bg-rose-100 text-rose-800 border-none font-bold"
                          : currentStep === 5
                          ? "bg-emerald-100 text-emerald-800 border-none font-bold"
                          : "bg-blue-100 text-blue-800 border-none font-bold"
                      }
                    >
                      {isCancelled
                        ? "ĐÃ HỦY ĐƠN"
                        : ORDER_STEPS.find((s) => s.stepNum === currentStep)?.shortTitle || "Đang xử lý"}
                    </Badge>
                  </div>
                </div>

                <div className="text-xs text-stone-500 sm:text-right space-y-0.5">
                  <p className="flex items-center sm:justify-end gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-stone-400" />
                    <span>Đặt ngày: <strong>{new Date(orderData.createdAt).toLocaleDateString("vi-VN")}</strong></span>
                  </p>
                  <p>
                    Hình thức:{" "}
                    <strong className="text-stone-800">
                      {orderData.paymentMethod === "bank_transfer"
                        ? "Chuyển khoản VietQR"
                        : orderData.paymentMethod === "momo"
                        ? "Ví MoMo"
                        : "Thanh toán khi nhận (COD)"}
                    </strong>
                  </p>
                </div>
              </div>

              {/* Nội dung Stepper hoặc Cancelled Alert */}
              {isCancelled ? (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm space-y-1">
                  <div className="flex items-center gap-2 font-bold">
                    <AlertCircle className="h-5 w-5 text-rose-600" />
                    <span>Đơn hàng này hiện đang ở trạng thái đã hủy.</span>
                  </div>
                  <p className="text-xs text-rose-700">
                    Nếu bạn cần bốc lại thuốc hoặc có thắc mắc, vui lòng liên hệ hotline <strong>0964001203</strong>.
                  </p>
                </div>
              ) : (
                <div className="py-4">
                  {/* Stepper Grid (5 Bước) */}
                  <div className="relative">
                    {/* Track Line desktop */}
                    <div className="absolute top-5 left-8 right-8 h-1 bg-stone-200 hidden sm:block -z-0" />
                    <div
                      className="absolute top-5 left-8 h-1 bg-emerald-600 hidden sm:block -z-0 transition-all duration-700"
                      style={{
                        width: `calc(${((Math.min(currentStep, 5) - 1) / 4) * 100}% - 64px)`,
                      }}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-5 sm:gap-2 relative z-10">
                      {ORDER_STEPS.map((step) => {
                        const isDone = currentStep > step.stepNum;
                        const isCurrent = currentStep === step.stepNum;
                        const Icon = step.icon;

                        return (
                          <div
                            key={step.key}
                            className="flex sm:flex-col items-center sm:text-center gap-3.5 sm:gap-2"
                          >
                            {/* Nút tròn biểu tượng */}
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

                            {/* Tiêu đề & mô tả bước */}
                            <div className="text-left sm:text-center">
                              <p
                                className={`text-xs font-bold leading-tight ${
                                  isCurrent
                                    ? "text-emerald-700"
                                    : isDone
                                    ? "text-stone-900"
                                    : "text-stone-400"
                                }`}
                              >
                                {step.title}
                              </p>
                              <p className="text-[11px] text-stone-500 line-clamp-2 max-w-[140px] mx-auto mt-0.5 hidden sm:block">
                                {step.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Banner ghi chú trạng thái hiện tại */}
                  <div className="mt-8 p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-center gap-3 text-xs text-emerald-950">
                    <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0" />
                    <div>
                      <span className="font-bold">Trạng thái hiện tại: </span>
                      <span>
                        {ORDER_STEPS.find((s) => s.stepNum === currentStep)?.desc ||
                          "Nhà thuốc Cây Thuốc Ông Han đang chăm chút chuẩn bị đơn hàng theo quy trình dược liệu sạch."}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ============================================================== */}
            {/* KHUNG 2: DANH SÁCH BÀI THUỐC & DƯỢC LIỆU                       */}
            {/* ============================================================== */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Leaf className="h-4.5 w-4.5 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-stone-900">
                      Khung 2: Danh Sách Bài Thuốc & Cây Thuốc Đã Mua
                    </h3>
                    <p className="text-xs text-stone-500">
                      Tổng cộng {orderData.items?.length || 0} vị thảo dược gia truyền
                    </p>
                  </div>
                </div>
              </div>

              {/* Danh sách từng sản phẩm */}
              <div className="space-y-3.5 divide-y divide-stone-100">
                {orderData.items?.map((item: any) => (
                  <div key={item.id} className="pt-3.5 first:pt-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="h-14 w-14 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-center shrink-0 overflow-hidden">
                        {item.product?.images?.[0] ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Leaf className="h-6 w-6 text-emerald-700/40" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-stone-900 truncate">
                          {item.product?.name || "Cây thuốc nam"}
                        </p>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Khối lượng / Quy cách: <strong>{item.product?.weight || "Gói chuẩn 500g"}</strong>
                        </p>
                        <p className="text-xs text-emerald-800 mt-0.5">
                          Đơn giá: {formatPrice(item.price)} • Số lượng: <strong>x{item.quantity}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-xs text-stone-400">Thành tiền</p>
                      <p className="text-base font-extrabold text-emerald-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Tổng cộng tiền */}
              <div className="space-y-2 text-xs sm:text-sm text-stone-600 pt-1">
                <div className="flex justify-between">
                  <span>Tiền thảo dược:</span>
                  <span className="font-semibold text-stone-900">{formatPrice(orderData.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển toàn quốc:</span>
                  <span className="text-emerald-700 font-semibold">Miễn phí giao hàng</span>
                </div>
                <Separator />
                <div className="flex justify-between items-baseline pt-1">
                  <span className="font-bold text-stone-900 text-base">Tổng tiền thanh toán:</span>
                  <span className="text-2xl font-black text-emerald-900 font-mono">
                    {formatPrice(orderData.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* ============================================================== */}
            {/* KHUNG 3: THÔNG TIN NHẬN HÀNG, THANH TOÁN & HOTLINE HỖ TRỢ      */}
            {/* ============================================================== */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-stone-200">
                <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <MapPin className="h-4.5 w-4.5 text-emerald-700" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-stone-900">
                    Khung 3: Thông Tin Nhận Hàng & Thanh Toán
                  </h3>
                  <p className="text-xs text-stone-500">
                    Địa chỉ người nhận, phương thức thanh toán và hotline liên hệ
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cột Trái: Người nhận hàng */}
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Thông tin người nhận
                  </p>
                  <div className="space-y-2 text-xs sm:text-sm text-stone-700">
                    <p className="font-extrabold text-base text-stone-900">
                      {orderData.customerName}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-emerald-700 shrink-0" />
                      <span className="font-semibold">{orderData.customerPhone}</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                      <span>{orderData.customerAddress}</span>
                    </p>
                    {orderData.notes && (
                      <p className="pt-2 text-stone-600 italic border-t border-stone-200">
                        &ldquo;{orderData.notes}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                {/* Cột Phải: Hình thức & Chứng từ thanh toán */}
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Hình thức & Trạng thái thanh toán
                  </p>
                  <div className="space-y-2.5 text-xs text-stone-700">
                    <div className="flex justify-between items-center">
                      <span className="text-stone-500">Hình thức:</span>
                      <strong className="text-stone-900">
                        {orderData.paymentMethod === "bank_transfer"
                          ? "Chuyển khoản VietQR"
                          : orderData.paymentMethod === "momo"
                          ? "Ví MoMo"
                          : "Tiền mặt khi nhận (COD)"}
                      </strong>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-stone-500">Trạng thái tiền:</span>
                      <Badge
                        className={
                          orderData.paymentStatus === "paid"
                            ? "bg-emerald-100 text-emerald-800 border-none"
                            : "bg-amber-100 text-amber-800 border-none"
                        }
                      >
                        {orderData.paymentStatus === "paid"
                          ? "Đã thanh toán"
                          : orderData.paymentStatus === "pending_review"
                          ? "Chờ dược sĩ đối soát"
                          : "Chưa thanh toán"}
                      </Badge>
                    </div>

                    {/* Chứng từ chuyển khoản */}
                    {orderData.paymentProof ? (
                      <div className="pt-2">
                        <p className="text-[11px] font-bold text-emerald-800 mb-1.5 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
                          Đã đính kèm ảnh chuyển khoản:
                        </p>
                        <a
                          href={orderData.paymentProof}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block rounded-xl overflow-hidden border border-emerald-200 bg-white"
                        >
                          <img
                            src={orderData.paymentProof}
                            alt="Chứng từ chuyển khoản"
                            className="w-full h-28 object-cover hover:scale-105 transition-transform"
                          />
                        </a>
                      </div>
                    ) : (
                      <div className="pt-2 border-t border-stone-200 space-y-2">
                        <p className="text-[11px] text-stone-500">
                          Nếu bạn đã chuyển khoản VietQR, vui lòng gửi ảnh chụp màn hình để được ưu tiên bốc thuốc sớm:
                        </p>
                        <input
                          ref={proofInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleProofUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={isUploadingProof}
                          onClick={() => proofInputRef.current?.click()}
                          className="w-full text-xs h-9 border-dashed border-emerald-400 text-emerald-800 gap-1.5 bg-white"
                        >
                          <Upload className="h-3.5 w-3.5" />
                          <span>{isUploadingProof ? "Đang gửi ảnh..." : "Tải ảnh biên lai chuyển tiền"}</span>
                        </Button>
                      </div>
                    )}

                    {proofUploadedMessage && (
                      <p className="text-xs text-emerald-700 font-semibold text-center pt-1">
                        ✓ Đã cập nhật ảnh chứng từ thành công!
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Nút Cần hỗ trợ qua Hotline 0964001203 */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                <div className="space-y-1 text-center sm:text-left">
                  <p className="font-heading text-base font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                    <Phone className="h-4 w-4 text-emerald-300" />
                    <span>Cần hỗ trợ qua Hotline: 0964001203</span>
                  </p>
                  <p className="text-xs text-emerald-100/80">
                    Dược sĩ Cây Thuốc Ông Han sẵn sàng giải đáp về cách sắc thuốc và lộ trình điều trị.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a href="tel:0964001203">
                    <Button className="bg-white hover:bg-emerald-50 text-emerald-950 font-bold text-xs h-10 px-5 rounded-xl shadow-xs">
                      Gọi Ngay 0964001203
                    </Button>
                  </a>
                  <a href="https://zalo.me/0964001203" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="border-white/40 text-white hover:bg-white/10 text-xs h-10 px-4 rounded-xl">
                      Nhắn Zalo
                    </Button>
                  </a>
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
    <Suspense fallback={<div className="p-10 text-center text-stone-500">Đang tải trang tra cứu đơn hàng...</div>}>
      <OrderTrackingContent />
    </Suspense>
  );
}
