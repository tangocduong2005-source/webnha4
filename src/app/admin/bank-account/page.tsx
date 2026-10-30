"use client";

import { useState, useEffect } from "react";
import {
  CreditCard,
  Building2,
  User,
  QrCode,
  Save,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

// Danh sách các ngân hàng hỗ trợ VietQR phổ biến tại Việt Nam
const POPULAR_BANKS = [
  { code: "MB", bin: "970422", name: "MBBank (Ngân hàng Quân Đội)" },
  { code: "VCB", bin: "970436", name: "Vietcombank (Ngoại Thương Việt Nam)" },
  { code: "ICB", bin: "970415", name: "VietinBank (Công Thương Việt Nam)" },
  { code: "BIDV", bin: "970418", name: "BIDV (Đầu Tư & Phát Triển)" },
  { code: "TCB", bin: "970407", name: "Techcombank (Kỹ Thương Việt Nam)" },
  { code: "ACB", bin: "970416", name: "ACB (Á Châu)" },
  { code: "VPB", bin: "970432", name: "VPBank (Việt Nam Thịnh Vượng)" },
  { code: "TPB", bin: "970423", name: "TPBank (Tiên Phong)" },
  { code: "VBA", bin: "970405", name: "Agribank (Nông Nghiệp & PTNT)" },
  { code: "STB", bin: "970403", name: "Sacombank (Sài Gòn Thương Tín)" },
  { code: "VIB", bin: "970441", name: "VIB (Quốc Tế)" },
  { code: "MSB", bin: "970426", name: "MSB (Hàng Hải Việt Nam)" },
];

export default function AdminBankAccountPage() {
  const [formData, setFormData] = useState({
    bankName: "Ngân hàng Quân Đội (MB Bank)",
    bankCode: "MB",
    accountNumber: "0964001203",
    accountHolder: "TA NGOC DUONG",
    isActive: true,
    qrTemplate: "compact2",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/bank-setting")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setFormData({
            bankName: json.data.bankName,
            bankCode: json.data.bankCode,
            accountNumber: json.data.accountNumber,
            accountHolder: json.data.accountHolder,
            isActive: json.data.isActive ?? true,
            qrTemplate: json.data.qrTemplate || "compact2",
          });
        }
      })
      .catch((e) => console.error("Lỗi nạp cấu hình ngân hàng:", e))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSelectBank = (code: string) => {
    const found = POPULAR_BANKS.find((b) => b.code === code);
    if (found) {
      setFormData((prev) => ({
        ...prev,
        bankCode: found.code,
        bankName: found.name,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/bank-setting", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (json.success) {
        setMessage({ type: "success", text: "Đã lưu cấu hình tài khoản ngân hàng thành công!" });
        setTimeout(() => setMessage(null), 4000);
      } else {
        setMessage({ type: "error", text: json.error || "Không thể lưu thông tin. Vui lòng thử lại." });
      }
    } catch {
      setMessage({ type: "error", text: "Lỗi kết nối máy chủ khi lưu cấu hình." });
    } finally {
      setIsSaving(false);
    }
  };

  // Preview VietQR URL mẫu với số tiền thử nghiệm 250.000đ
  const previewQrUrl = `https://img.vietqr.io/image/${formData.bankCode}-${formData.accountNumber}-${formData.qrTemplate}.png?amount=250000&addInfo=DH-TEST-DEMO&accountName=${encodeURIComponent(
    formData.accountHolder
  )}`;

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-heading text-3xl font-extrabold text-stone-900 tracking-tight">
            Cấu Hình Tài Khoản Ngân Hàng & VietQR
          </h1>
          <Badge className="bg-emerald-100 text-emerald-800 border-none font-semibold text-xs">
            Admin Settings
          </Badge>
        </div>
        <p className="text-stone-500 text-sm mt-1">
          Cài đặt thông tin tài khoản thụ hưởng của Cây Thuốc Ông Han để khách hàng thanh toán chuyển khoản và tạo mã VietQR tự động.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-medium border ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Cấu Hình (Cột Trái) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-stone-900">
                Thông Tin Tài Khoản Thụ Hưởng
              </h2>
              <p className="text-xs text-stone-500">
                Được hiển thị trực tiếp tại trang Checkout khi khách chọn chuyển khoản
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Chọn Ngân Hàng Nhanh */}
            <div>
              <Label className="text-xs font-semibold text-stone-700">
                Chọn ngân hàng phổ biến
              </Label>
              <select
                value={formData.bankCode}
                onChange={(e) => handleSelectBank(e.target.value)}
                className="w-full mt-1.5 h-10 px-3.5 rounded-xl border border-stone-300 bg-white text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {POPULAR_BANKS.map((bank) => (
                  <option key={bank.code} value={bank.code}>
                    {bank.name} ({bank.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Tên ngân hàng chi tiết */}
            <div>
              <Label className="text-xs font-semibold text-stone-700">
                Tên đầy đủ của ngân hàng *
              </Label>
              <Input
                required
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                placeholder="Ngân hàng Quân Đội (MB Bank)"
                className="mt-1.5 h-10 rounded-xl border-stone-300"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Số tài khoản */}
              <div>
                <Label className="text-xs font-semibold text-stone-700">
                  Số tài khoản nhận tiền *
                </Label>
                <div className="relative mt-1.5">
                  <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                  <Input
                    required
                    value={formData.accountNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, accountNumber: e.target.value.replace(/\s+/g, "") })
                    }
                    placeholder="0964001203"
                    className="pl-10 h-10 rounded-xl border-stone-300 font-mono font-semibold"
                  />
                </div>
              </div>

              {/* Mã viết tắt VietQR (Bank Code hoặc BIN) */}
              <div>
                <Label className="text-xs font-semibold text-stone-700">
                  Mã ngân hàng VietQR (Bank Code) *
                </Label>
                <Input
                  required
                  value={formData.bankCode}
                  onChange={(e) =>
                    setFormData({ ...formData, bankCode: e.target.value.toUpperCase().trim() })
                  }
                  placeholder="MB"
                  className="mt-1.5 h-10 rounded-xl border-stone-300 font-mono uppercase"
                />
              </div>
            </div>

            {/* Tên chủ tài khoản */}
            <div>
              <Label className="text-xs font-semibold text-stone-700">
                Tên chủ tài khoản (In hoa không dấu) *
              </Label>
              <div className="relative mt-1.5">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <Input
                  required
                  value={formData.accountHolder}
                  onChange={(e) =>
                    setFormData({ ...formData, accountHolder: e.target.value.toUpperCase() })
                  }
                  placeholder="TA NGOC DUONG"
                  className="pl-10 h-10 rounded-xl border-stone-300 font-mono uppercase font-bold"
                />
              </div>
            </div>

            {/* Mẫu giao diện VietQR */}
            <div>
              <Label className="text-xs font-semibold text-stone-700">
                Mẫu hiển thị VietQR
              </Label>
              <div className="grid grid-cols-3 gap-3 mt-1.5">
                {[
                  { value: "compact2", label: "Chuẩn Đầy Đủ", sub: "Khuyên dùng (Logo + Tên)" },
                  { value: "compact", label: "Gọn Nhẹ", sub: "Khung mã vừa phải" },
                  { value: "qr_only", label: "Chỉ Mã QR", sub: "Chỉ hình vuông QR" },
                ].map((tpl) => (
                  <button
                    key={tpl.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, qrTemplate: tpl.value })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      formData.qrTemplate === tpl.value
                        ? "border-emerald-600 bg-emerald-50/70 text-emerald-950 shadow-xs"
                        : "border-stone-200 bg-white hover:bg-stone-50 text-stone-700"
                    }`}
                  >
                    <p className="text-xs font-bold">{tpl.label}</p>
                    <p className="text-[10px] text-stone-500 mt-0.5">{tpl.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Trạng thái hoạt động */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-stone-800">Bật thanh toán chuyển khoản</p>
                <p className="text-[11px] text-stone-500">Cho phép khách thanh toán chuyển khoản VietQR khi đặt hàng</p>
              </div>
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-5 w-5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
            </div>

            {/* Nút lưu */}
            <div className="pt-3">
              <Button
                type="submit"
                disabled={isSaving || isLoading}
                className="w-full sm:w-auto h-11 px-8 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold shadow-md gap-2 transition-all active:scale-[0.98]"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Đang lưu cài đặt...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Lưu Cấu Hình Ngân Hàng</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* VietQR Live Preview Box (Cột Phải) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-emerald-700" />
                <h3 className="font-heading text-base font-bold text-stone-900">
                  Xem Trước Mã VietQR Thực Tế
                </h3>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                Live Preview
              </span>
            </div>

            <p className="text-xs text-stone-500">
              Mã QR này sẽ hiển thị tự động trên trang Thanh toán của khách hàng khi họ đặt hàng:
            </p>

            {/* Khung ảnh QR */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col items-center justify-center text-center">
              <div className="max-w-[280px] w-full rounded-xl overflow-hidden bg-white p-2 shadow-sm border border-stone-200">
                <img
                  src={previewQrUrl}
                  alt="VietQR Live Preview"
                  className="w-full h-auto object-contain mx-auto"
                />
              </div>

              <div className="mt-4 space-y-1 text-xs">
                <p className="font-bold text-stone-900">{formData.bankName}</p>
                <p className="text-stone-600 font-mono">
                  STK: <strong className="text-emerald-800 text-sm">{formData.accountNumber}</strong>
                </p>
                <p className="text-stone-600 font-mono uppercase">
                  Chủ TK: <strong className="text-stone-800">{formData.accountHolder}</strong>
                </p>
              </div>
            </div>

            {/* Hướng dẫn bảo mật */}
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-amber-700 shrink-0" />
                <span>Cơ chế tạo VietQR động:</span>
              </p>
              <p className="text-[11px] leading-relaxed">
                Khi khách hàng đặt bài thuốc, hệ thống tự động gắn <strong>Số tiền chính xác</strong> và <strong>Mã đơn hàng duy nhất</strong> vào mã QR. Khách chỉ cần mở ứng dụng ngân hàng quét là chuyển khoản chuẩn 100%, không lo chuyển sai tiền hay nhầm số tài khoản.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
