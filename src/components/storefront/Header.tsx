"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/store";
import {
  Leaf,
  ShoppingCart,
  Search,
  Menu,
  X,
  Phone,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { categories } from "@/data/categories";

export default function Header() {
  const { totalItems, state, removeFromCart, updateQuantity, subtotal } =
    useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-1.5 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5" />
            <a href="tel:0964001203" className="hover:underline font-medium">
              Hotline: 0964001203
            </a>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span>Miễn phí vận chuyển đơn từ 300.000đ</span>
            <span>•</span>
            <Link href="/tra-cuu-don-hang" className="hover:underline flex items-center gap-1 font-semibold text-amber-200">
              <Search className="h-3 w-3" />
              Tra cứu đơn hàng
            </Link>
            <span>•</span>
            <Link href="/account/orders" className="hover:underline">
              Đơn hàng của tôi
            </Link>
            <span>•</span>
            <Link href="/admin" className="hover:underline">
              Quản trị
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                <Leaf className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-heading text-xl font-bold text-primary leading-tight">
                  Cây Thuốc Ông Han
                </h1>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Dược liệu cổ truyền Thái Ninh
                </p>
              </div>
            </Link>

            {/* Search bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-xl">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm cây thuốc, dược liệu, công dụng..."
                  className="pl-10 pr-4 bg-accent/50 border-border focus:bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
                    }
                  }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Mobile search toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Cart Button with Mini-Cart Sheet */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-11 px-3 sm:px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 rounded-xl flex items-center gap-2 sm:gap-2.5 transition-all shadow-xs group"
                    id="cart-button"
                    aria-label="Xem giỏ hàng"
                  >
                    <div className="relative flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 text-emerald-700 group-hover:scale-110 transition-transform" />
                      {totalItems > 0 && (
                        <span className="absolute -top-2.5 -right-3 h-5 min-w-5 px-1 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-extrabold text-[11px] rounded-full flex items-center justify-center ring-2 ring-white shadow-xs animate-scale-in">
                          {totalItems}
                        </span>
                      )}
                    </div>
                    <div className="hidden sm:flex flex-col text-left leading-none gap-0.5">
                      <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                        Giỏ hàng
                      </span>
                      <span className="text-xs font-extrabold text-emerald-950 font-mono">
                        {totalItems > 0 ? formatPrice(subtotal) : "0đ"}
                      </span>
                    </div>
                  </Button>
                </SheetTrigger>

                {/* Mini-Cart Drawer (Slide-out from Right) */}
                <SheetContent className="w-full sm:max-w-md p-0 flex flex-col h-full bg-white">
                  {/* Drawer Header */}
                  <SheetHeader className="p-5 border-b border-stone-200 bg-stone-50/70">
                    <SheetTitle className="font-heading text-lg font-bold text-stone-900 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <ShoppingCart className="h-4 w-4" />
                        </div>
                        <span>Giỏ Hàng Dược Liệu</span>
                      </div>
                      <Badge className="bg-emerald-600 text-white font-bold text-xs">
                        {totalItems} món
                      </Badge>
                    </SheetTitle>
                  </SheetHeader>

                  {/* Free Shipping Alert Bar */}
                  <div className="bg-emerald-50/90 border-b border-emerald-100 px-5 py-2.5 text-xs text-emerald-900">
                    {subtotal >= 300000 ? (
                      <p className="font-semibold text-emerald-700 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        ✓ Đơn của bạn đủ điều kiện <strong>Miễn Phí Vận Chuyển</strong> toàn quốc!
                      </p>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-[11px] text-emerald-800">
                          Mua thêm <strong>{formatPrice(300000 - subtotal)}</strong> để được <strong>Freeship</strong> đơn từ 300.000đ
                        </p>
                        <div className="w-full bg-emerald-200/60 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, (subtotal / 300000) * 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Drawer Body */}
                  <div className="flex-1 overflow-y-auto p-5">
                    {state.items.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                        <div className="h-20 w-20 rounded-full bg-emerald-50 text-emerald-400 flex items-center justify-center">
                          <ShoppingCart className="h-10 w-10 stroke-[1.5]" />
                        </div>
                        <div>
                          <p className="font-heading text-base font-bold text-stone-800">
                            Giỏ hàng của bạn đang trống
                          </p>
                          <p className="text-xs text-stone-500 max-w-xs mt-1">
                            Hãy lựa chọn các bài thuốc nam và cây dược liệu sạch chuẩn Đông Y cho bạn và gia đình.
                          </p>
                        </div>
                        <Link href="/products">
                          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs h-10 px-5 font-semibold">
                            Khám Phá Cây Thuốc Ngay
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-3.5">
                        {state.items.map((item) => (
                          <div
                            key={item.product.id}
                            className="flex gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-200/80 hover:border-emerald-200 transition-all"
                          >
                            <div className="h-16 w-16 rounded-xl bg-white border border-stone-200 flex items-center justify-center shrink-0 overflow-hidden relative">
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
                              <h4 className="font-bold text-xs sm:text-sm text-stone-900 truncate">
                                {item.product.name}
                              </h4>
                              <p className="text-[11px] text-stone-500">
                                {item.product.weight || "Gói chuẩn"} • {formatPrice(item.product.price)}
                              </p>

                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center border border-stone-200 rounded-lg bg-white shadow-2xs">
                                  <button
                                    type="button"
                                    className="h-6 w-6 flex items-center justify-center text-xs text-stone-600 hover:bg-stone-100 rounded-l-lg"
                                    onClick={() =>
                                      updateQuantity(item.product.id, item.quantity - 1)
                                    }
                                  >
                                    -
                                  </button>
                                  <span className="text-xs font-bold w-6 text-center text-stone-900">
                                    {item.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    className="h-6 w-6 flex items-center justify-center text-xs text-stone-600 hover:bg-stone-100 rounded-r-lg"
                                    onClick={() =>
                                      updateQuantity(item.product.id, item.quantity + 1)
                                    }
                                  >
                                    +
                                  </button>
                                </div>

                                <span className="font-extrabold text-xs text-emerald-800">
                                  {formatPrice(item.product.price * item.quantity)}
                                </span>

                                <button
                                  type="button"
                                  className="h-6 w-6 text-stone-400 hover:text-rose-500 flex items-center justify-center transition-colors"
                                  onClick={() => removeFromCart(item.product.id)}
                                  title="Xóa món này"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Drawer Footer */}
                  {state.items.length > 0 && (
                    <div className="p-5 border-t border-stone-200 bg-stone-50/80 space-y-3">
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs text-stone-500 font-medium">Tổng tiền dược liệu:</span>
                        <span className="font-heading font-extrabold text-xl text-emerald-900">
                          {formatPrice(subtotal)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <Link href="/cart" className="block">
                          <Button variant="outline" className="w-full h-11 rounded-xl text-xs font-semibold border-stone-300 hover:bg-white text-stone-800">
                            Xem Giỏ Hàng
                          </Button>
                        </Link>
                        <Link href="/checkout" className="block">
                          <Button className="w-full h-11 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md">
                            Thanh Toán Ngay
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </SheetContent>
              </Sheet>

              {/* Mobile menu toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile search */}
          {searchOpen && (
            <div className="md:hidden mt-3 animate-slide-up">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm cây thuốc, dược liệu..."
                  className="pl-10 bg-accent/50"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:block border-t border-border/50">
          <div className="container mx-auto px-4">
            <ul className="flex items-center gap-1">
              <li>
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2.5 text-sm font-medium hover:text-primary transition-colors"
                >
                  Trang chủ
                </Link>
              </li>
              <li className="group relative">
                <button className="inline-flex items-center gap-1 px-4 py-2.5 text-sm font-medium hover:text-primary transition-colors">
                  Danh mục
                  <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 pt-1">
                  <div className="bg-white rounded-lg shadow-xl border border-border p-2 min-w-[220px]">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/products?category=${cat.slug}`}
                        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent text-sm transition-colors"
                      >
                        <Leaf className="h-4 w-4 text-primary" />
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </li>
              <li>
                <Link
                  href="/products"
                  className="inline-flex items-center px-4 py-2.5 text-sm font-medium hover:text-primary transition-colors"
                >
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link
                  href="/products?featured=true"
                  className="inline-flex items-center px-4 py-2.5 text-sm font-medium hover:text-primary transition-colors"
                >
                  Nổi bật
                </Link>
              </li>
              <li>
                <Link
                  href="/tra-cuu-don-hang"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-emerald-800 hover:text-emerald-950 transition-colors"
                >
                  <Search className="h-3.5 w-3.5 text-emerald-600" />
                  Tra cứu đơn hàng
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t animate-slide-up">
            <div className="container mx-auto px-4 py-3 space-y-1">
              <Link
                href="/"
                className="block px-3 py-2 rounded-md hover:bg-accent text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Trang chủ
              </Link>
              <Link
                href="/products"
                className="block px-3 py-2 rounded-md hover:bg-accent text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tất cả sản phẩm
              </Link>
              <Link
                href="/tra-cuu-don-hang"
                className="block px-3 py-2 rounded-md hover:bg-accent text-sm text-emerald-800 font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tra cứu đơn hàng
              </Link>
              <Link
                href="/account/orders"
                className="block px-3 py-2 rounded-md hover:bg-accent text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Đơn hàng của tôi
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="block px-3 py-2 rounded-md hover:bg-accent text-sm pl-6"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
              <Link
                href="/admin"
                className="block px-3 py-2 rounded-md hover:bg-accent text-sm text-primary font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Quản trị
              </Link>
            </div>
          </div>
        )}
        {/* Floating Quick Cart Bar for Mobile */}
        {totalItems > 0 && (
          <div className="md:hidden fixed bottom-5 left-4 right-20 z-40 animate-slide-up">
            <Link
              href="/checkout"
              className="flex items-center justify-between bg-emerald-900/95 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-emerald-600/60 active:scale-95 transition-transform"
            >
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <ShoppingCart className="h-5 w-5 text-emerald-300" />
                  <span className="absolute -top-2 -right-2.5 h-4 min-w-4 px-1 bg-rose-500 text-[10px] font-extrabold rounded-full flex items-center justify-center ring-1 ring-white">
                    {totalItems}
                  </span>
                </div>
                <div className="text-left leading-tight">
                  <p className="text-[10px] text-emerald-300 font-semibold uppercase">Giỏ hàng</p>
                  <p className="text-xs font-bold font-mono text-emerald-100">{formatPrice(subtotal)}</p>
                </div>
              </div>
              <span className="text-xs font-bold bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-xl shadow-xs">
                Thanh toán →
              </span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
