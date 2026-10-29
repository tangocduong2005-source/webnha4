"use client";

import { useCart } from "@/lib/store";
import CheckoutForm from "@/components/storefront/CheckoutForm";
import { ShoppingCart, Leaf } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const { totalItems } = useCart();

  if (totalItems === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingCart className="h-20 w-20 text-muted-foreground/20 mx-auto mb-6" />
        <h2 className="font-heading text-3xl font-bold mb-3">
          Giỏ hàng trống
        </h2>
        <p className="text-muted-foreground mb-6">
          Thêm sản phẩm vào giỏ hàng trước khi thanh toán
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
      <h1 className="font-heading text-3xl font-bold mb-8">Thanh Toán</h1>
      <CheckoutForm />
    </div>
  );
}
