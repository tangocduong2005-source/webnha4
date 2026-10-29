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

              {/* Cart */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    id="cart-button"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {totalItems > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-destructive text-white animate-scale-in">
                        {totalItems}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle className="font-heading text-xl">
                      Giỏ hàng ({totalItems})
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 flex flex-col h-[calc(100vh-12rem)]">
                    {state.items.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <ShoppingCart className="h-16 w-16 text-muted-foreground/30 mb-4" />
                        <p className="text-muted-foreground">
                          Giỏ hàng trống
                        </p>
                        <Link href="/products">
                          <Button className="mt-4" variant="outline">
                            Xem sản phẩm
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                          {state.items.map((item) => (
                            <div
                              key={item.product.id}
                              className="flex gap-3 p-3 rounded-lg bg-accent/30"
                            >
                              <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden relative">
                                {item.product.images?.[0] ? (
                                  <img
                                    src={item.product.images[0]}
                                    alt={item.product.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Leaf className="h-8 w-8 text-primary/40" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm truncate">
                                  {item.product.name}
                                </h4>
                                <p className="text-sm text-primary font-semibold">
                                  {formatPrice(item.product.price)}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() =>
                                      updateQuantity(
                                        item.product.id,
                                        item.quantity - 1
                                      )
                                    }
                                  >
                                    -
                                  </Button>
                                  <span className="text-sm w-6 text-center">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() =>
                                      updateQuantity(
                                        item.product.id,
                                        item.quantity + 1
                                      )
                                    }
                                  >
                                    +
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 ml-auto text-destructive hover:text-destructive"
                                    onClick={() =>
                                      removeFromCart(item.product.id)
                                    }
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="border-t pt-4 mt-4 space-y-3">
                          <div className="flex justify-between font-semibold text-lg">
                            <span>Tạm tính:</span>
                            <span className="text-primary">
                              {formatPrice(subtotal)}
                            </span>
                          </div>
                          <Link href="/cart" className="block">
                            <Button variant="outline" className="w-full">
                              Xem giỏ hàng
                            </Button>
                          </Link>
                          <Link href="/checkout" className="block">
                            <Button className="w-full bg-primary hover:bg-primary/90">
                              Thanh toán
                            </Button>
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
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
      </div>
    </header>
  );
}
