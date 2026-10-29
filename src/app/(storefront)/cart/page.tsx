"use client";

import Link from "next/link";
import { useCart } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  Leaf,
  ArrowRight,
  Truck,
  ArrowLeft,
} from "lucide-react";

export default function CartPage() {
  const {
    state,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    totalItems,
  } = useCart();

  const shippingFee = subtotal >= 300000 ? 0 : 30000;
  const total = subtotal + shippingFee;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingCart className="h-20 w-20 text-muted-foreground/20 mx-auto mb-6" />
        <h2 className="font-heading text-3xl font-bold mb-3">
          Giỏ hàng trống
        </h2>
        <p className="text-muted-foreground mb-6">
          Bạn chưa thêm sản phẩm nào vào giỏ hàng
        </p>
        <Link href="/products">
          <Button className="bg-primary hover:bg-primary/90">
            <Leaf className="h-4 w-4 mr-2" />
            Khám phá sản phẩm
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl font-bold mb-8">Giỏ Hàng</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {state.items.map((item) => (
            <div
              key={item.product.id}
              className="flex gap-4 p-4 bg-white rounded-xl border hover-lift"
            >
              {/* Image */}
              <div className="h-24 w-24 rounded-lg bg-gradient-to-br from-primary/5 to-primary/15 flex items-center justify-center shrink-0 overflow-hidden relative">
                {item.product.images?.[0] ? (
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Leaf className="h-10 w-10 text-primary/30" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.product.slug}`}
                  className="font-heading text-lg font-semibold hover:text-primary transition-colors"
                >
                  {item.product.name}
                </Link>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {item.product.weight} • {item.product.origin}
                </p>

                <div className="flex items-center justify-between mt-3">
                  {/* Quantity controls */}
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="font-bold text-primary">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(item.product.price)} / sản phẩm
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Remove */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => removeFromCart(item.product.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <div className="flex justify-between items-center pt-2">
            <Link href="/products">
              <Button variant="ghost" className="text-sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Tiếp tục mua sắm
              </Button>
            </Link>
            <Button
              variant="outline"
              className="text-sm text-destructive hover:text-destructive"
              onClick={clearCart}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa giỏ hàng
            </Button>
          </div>
        </div>

        {/* Summary */}
        <div>
          <div className="bg-white rounded-xl p-6 border sticky top-32">
            <h3 className="font-heading text-xl font-semibold mb-4">
              Tóm tắt đơn hàng
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Tạm tính ({totalItems} sản phẩm)
                </span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5" />
                  Phí vận chuyển
                </span>
                <span className="font-medium">
                  {shippingFee === 0 ? (
                    <span className="text-primary">Miễn phí</span>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>
              {subtotal < 300000 && (
                <p className="text-xs text-muted-foreground bg-accent/50 p-2 rounded">
                  Mua thêm{" "}
                  <span className="font-semibold text-primary">
                    {formatPrice(300000 - subtotal)}
                  </span>{" "}
                  để được miễn phí vận chuyển
                </p>
              )}
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between font-bold text-lg mb-6">
              <span>Tổng cộng</span>
              <span className="text-primary">{formatPrice(total)}</span>
            </div>

            <Link href="/checkout" className="block">
              <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-base font-semibold">
                Tiến hành thanh toán
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
