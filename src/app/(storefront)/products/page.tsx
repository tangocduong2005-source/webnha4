"use client";

import { useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@/types";
import ProductCard from "@/components/storefront/ProductCard";
import ProductFilter from "@/components/storefront/ProductFilter";
import { Leaf } from "lucide-react";

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "";
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const handleFilterChange = useCallback((products: Product[]) => {
    setFilteredProducts(products);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">
          Sản Phẩm Dược Liệu
        </h1>
        <p className="text-muted-foreground">
          Khám phá bộ sưu tập cây thuốc và dược liệu thiên nhiên chất lượng cao
        </p>
      </div>

      {/* Filter */}
      <ProductFilter
        initialSearch={initialSearch}
        initialCategory={initialCategory}
        onFilterChange={handleFilterChange}
      />

      {/* Product grid */}
      <div className="mt-6">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Leaf className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-heading text-xl font-semibold mb-2">
              Không tìm thấy sản phẩm
            </h3>
            <p className="text-muted-foreground">
              Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-accent rounded w-1/3" />
            <div className="h-4 bg-accent rounded w-1/2" />
            <div className="h-12 bg-accent rounded" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-accent rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
