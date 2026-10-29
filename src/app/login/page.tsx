"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Leaf, Lock, Mail, ArrowLeft, ShieldCheck, UserCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(
    errorParam === "unauthorized"
      ? "Khu vực Quản trị yêu cầu đăng nhập bằng tài khoản Quản trị viên (ADMIN)."
      : errorParam === "forbidden"
      ? "Tài khoản của bạn không có quyền truy cập vào khu vực Quản trị."
      : ""
  );

  const fillAdmin = () => {
    setEmail("admin@caythuoconghan.vn");
    setPassword("Admin@123456");
    setErrorMsg("");
  };

  const fillUser = () => {
    setEmail("khachhang@caythuoconghan.vn");
    setPassword("User@123456");
    setErrorMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || "Email hoặc mật khẩu không chính xác.");
        setLoading(false);
        return;
      }

      // Đăng nhập thành công
      if (data.user?.role === "ADMIN") {
        router.push(callbackUrl);
      } else {
        // Tài khoản khách hàng thường
        if (callbackUrl.startsWith("/admin")) {
          router.push("/403?role=USER");
        } else {
          router.push("/");
        }
      }
      router.refresh();
    } catch {
      setErrorMsg("Không thể kết nối đến máy chủ. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-center items-center p-4 py-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-200/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-teal-200/40 blur-3xl pointer-events-none" />

      {/* Card Form */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-stone-200/80 p-7 sm:p-9 relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center justify-center gap-2.5 mx-auto">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md">
              <Leaf className="h-6 w-6" />
            </div>
            <div className="text-left">
              <span className="font-heading text-lg font-bold text-stone-900 block leading-tight">
                Cây Thuốc Ông Han
              </span>
              <span className="text-[11px] text-emerald-700 font-medium block">
                Cổng Quản Trị & Khách Hàng
              </span>
            </div>
          </Link>
          <h1 className="text-xl font-bold text-stone-900 pt-3">
            Đăng Nhập Hệ Thống
          </h1>
          <p className="text-xs text-stone-500">
            Hệ thống phân quyền bảo mật dành riêng cho Quản trị viên và Khách hàng
          </p>
        </div>

        {/* Thông báo lỗi nếu có */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{errorMsg}</div>
          </div>
        )}

        {/* Form Đăng Nhập */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-xs font-semibold text-stone-700">Email đăng nhập</Label>
            <div className="relative mt-1.5">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@caythuoconghan.vn"
                className="pl-10 h-10 rounded-xl border-stone-300 bg-stone-50/50 focus:bg-white text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-stone-700">Mật khẩu</Label>
            </div>
            <div className="relative mt-1.5">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10 h-10 rounded-xl border-stone-300 bg-stone-50/50 focus:bg-white text-sm"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold shadow-md shadow-emerald-800/20 text-sm mt-2 transition-all active:scale-[0.99]"
          >
            {loading ? "Đang xác thực..." : "Đăng Nhập"}
          </Button>
        </form>

        {/* Phím Nhanh Demo Phân Quyền */}
        <div className="pt-2 border-t border-stone-200 space-y-2">
          <p className="text-[11px] font-semibold text-stone-400 text-center uppercase tracking-wider">
            Tài khoản mẫu thử nghiệm phân quyền
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillAdmin}
              className="p-2.5 rounded-xl border border-emerald-300/80 bg-emerald-50/70 hover:bg-emerald-100 text-left transition-all group"
            >
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Quyền ADMIN</span>
              </div>
              <p className="text-[10px] text-emerald-700/80 mt-0.5 truncate">
                admin@caythuoconghan.vn
              </p>
            </button>

            <button
              type="button"
              onClick={fillUser}
              className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-left transition-all"
            >
              <div className="flex items-center gap-1.5 text-stone-700 font-bold text-xs">
                <UserCheck className="h-3.5 w-3.5 text-stone-500" />
                <span>Quyền USER</span>
              </div>
              <p className="text-[10px] text-stone-500 mt-0.5 truncate">
                khachhang@caythuoconghan.vn
              </p>
            </button>
          </div>
        </div>

        {/* Trở về trang chủ */}
        <div className="text-center pt-1">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-emerald-800 font-medium transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Quay lại trang bán hàng</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-100 flex items-center justify-center text-stone-500">
          Đang tải trang đăng nhập...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
