"use client";

import { useState, useMemo, useEffect } from "react";
import { products as fallbackProducts, allTags } from "@/data/products";
import { categories } from "@/data/categories";
import { Product } from "@/types";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductFilterProps {
  initialSearch?: string;
  initialCategory?: string;
  onFilterChange: (filtered: Product[]) => void;
}

export default function ProductFilter({
  initialSearch = "",
  initialCategory = "",
  onFilterChange,
}: ProductFilterProps) {
  const [productList, setProductList] = useState<Product[]>(fallbackProducts);
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setProductList(json.data);
        }
      })
      .catch((e) => console.error("Lỗi tải cây thuốc từ MySQL:", e));
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...productList];

    // Search
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(query) ||
          p.shortDescription?.toLowerCase().includes(query) ||
          p.usage?.toLowerCase().includes(query) ||
          (p.tags || []).some((t) => t.toLowerCase().includes(query))
      );
    }

    // Category
    if (selectedCategory) {
      const cat = categories.find((c) => c.slug === selectedCategory);
      if (cat) {
        result = result.filter((p) => p.categoryId === cat.id);
      }
    }

    // Tags
    if (selectedTags.length > 0) {
      result = result.filter((p) =>
        selectedTags.some((tag) => (p.tags || []).includes(tag))
      );
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
      default:
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    onFilterChange(result);
    return result;
  }, [productList, search, selectedCategory, selectedTags, sortBy, onFilterChange]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearAll = () => {
    setSearch("");
    setSelectedCategory("");
    setSelectedTags([]);
    setSortBy("newest");
  };

  const hasActiveFilters =
    search || selectedCategory || selectedTags.length > 0;

  return (
    <div className="space-y-4">
      {/* Search and Sort row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên, công dụng (VD: giải độc, mát gan)..."
            className="pl-10 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={() => setSearch("")}
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={(val) => setSortBy(val ?? "newest")}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mới nhất</SelectItem>
              <SelectItem value="name">Tên A-Z</SelectItem>
              <SelectItem value="price-asc">Giá tăng dần</SelectItem>
              <SelectItem value="price-desc">Giá giảm dần</SelectItem>
              <SelectItem value="rating">Đánh giá cao</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            className="bg-white"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Lọc
          </Button>
        </div>
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="bg-white rounded-xl p-4 border space-y-4 animate-slide-up">
          {/* Category */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Danh mục</h4>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedCategory === "" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory("")}
              >
                Tất cả
              </Badge>
              {categories.map((cat) => (
                <Badge
                  key={cat.id}
                  variant={
                    selectedCategory === cat.slug ? "default" : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(cat.slug)}
                >
                  {cat.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Tags / Công dụng */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Công dụng</h4>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active filters bar */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Đang lọc:</span>
          {search && (
            <Badge variant="secondary" className="gap-1">
              &quot;{search}&quot;
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setSearch("")}
              />
            </Badge>
          )}
          {selectedCategory && (
            <Badge variant="secondary" className="gap-1">
              {categories.find((c) => c.slug === selectedCategory)?.name}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setSelectedCategory("")}
              />
            </Badge>
          )}
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleTag(tag)}
              />
            </Badge>
          ))}
          <button
            className="text-sm text-destructive hover:underline"
            onClick={clearAll}
          >
            Xóa tất cả
          </button>
        </div>
      )}

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Tìm thấy{" "}
        <span className="font-semibold text-foreground">
          {filteredProducts.length}
        </span>{" "}
        sản phẩm
      </p>
    </div>
  );
}
