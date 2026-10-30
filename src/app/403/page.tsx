"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft, LogOut, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ForbiddenPage() {
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login?callbackUrl=/admin";
    } catch {
      window.location.href = "/login";
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-stone-200 shadow-xl text-center space-y-6">
        <div className="h-16 w-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Lỗi 403 Forbidden
          </span>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight pt-1">
            Không Có Quyền Truy Cập
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            Tài khoản hiện tại của bạn có quyền <strong>Khách Hàng (USER)</strong>. 
            Khu vực Quản trị yêu cầu quyền <strong>Quản Trị Viên (ADMIN)</strong> của Cây Thuốc Ông Han.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left text-xs text-amber-900 space-y-1.5">
          <p className="font-bold flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-amber-700" />
            <span>Chính sách bảo mật:</span>
          </p>
          <p>
            Chỉ những tài khoản được cấp quyền Quản trị viên mới được phép quản lý kho dược liệu, giá bán, cấu hình danh mục và xem báo cáo tài chính.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex-1 rounded-xl h-10 border-stone-300 text-xs font-semibold gap-1.5 text-stone-700 hover:bg-stone-100"
          >
            <LogOut className="h-4 w-4" />
            <span>Đổi tài khoản ADMIN</span>
          </Button>

          <Link href="/" className="flex-1">
            <Button className="w-full rounded-xl h-10 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              <span>Về Trang Bán Hàng</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

