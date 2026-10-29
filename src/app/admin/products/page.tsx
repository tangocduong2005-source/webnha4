"use client";

import { useState, useEffect } from "react";
import { products as initialProducts } from "@/data/products";
import { categories } from "@/data/categories";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Leaf,
  AlertCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function AdminProductsPage() {
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "cat-2",
    price: "",
    originalPrice: "",
    imageUrl: "",
    shortDescription: "",
    description: "",
    usage: "",
    dosage: "",
    precautions: "",
    origin: "Việt Nam",
    ingredients: "100% thảo dược thiên nhiên",
    weight: "500g",
    stock: "100",
    tags: "",
    isBestSeller: false,
  });

  const [_isLoading, setIsLoading] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/products");
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setProductList(json.data);
      } else {
        const saved = localStorage.getItem("thaoduocxanh-products");
        if (saved) setProductList(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Error fetching from MySQL:", e);
      const saved = localStorage.getItem("thaoduocxanh-products");
      if (saved) setProductList(JSON.parse(saved));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const filteredProducts = productList.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
      p.origin.toLowerCase().includes(search.toLowerCase());
    const matchCat =
      selectedCategory === "all" || p.categoryId === selectedCategory;
    return matchSearch && matchCat;
  });

  // Phân trang
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const resetForm = () => {
    setFormData({
      name: "",
      categoryId: "cat-2",
      price: "",
      originalPrice: "",
      imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1000&q=80",
      shortDescription: "",
      description: "",
      usage: "",
      dosage: "",
      precautions: "",
      origin: "Quảng Nam, Việt Nam",
      ingredients: "100% thảo dược thiên nhiên",
      weight: "500g",
      stock: "100",
      tags: "",
      isBestSeller: false,
    });
    setEditingProduct(null);
  };

  const openAddDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      categoryId: product.categoryId,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || "",
      imageUrl: product.images?.[0] || "",
      shortDescription: product.shortDescription,
      description: product.description,
      usage: product.usage,
      dosage: product.dosage,
      precautions: product.precautions || "",
      origin: product.origin,
      ingredients: product.ingredients || "",
      weight: product.weight,
      stock: product.stock.toString(),
      tags: product.tags.join(", "),
      isBestSeller: product.isBestSeller || false,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug =
      editingProduct?.slug ||
      formData.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9\s]/g, "")
        .trim()
        .replace(/\s+/g, "-");

    const defaultImage =
      formData.imageUrl.trim() ||
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1000&q=80";

    const payload = {
      name: formData.name,
      slug,
      categoryId: formData.categoryId,
      price: Number(formData.price) || 0,
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
      images: [defaultImage],
      shortDescription: formData.shortDescription,
      description: formData.description,
      usage: formData.usage,
      dosage: formData.dosage,
      precautions: formData.precautions,
      origin: formData.origin,
      ingredients: formData.ingredients,
      weight: formData.weight,
      stock: Number(formData.stock) || 0,
      isBestSeller: formData.isBestSeller,
    };

    try {
      if (editingProduct) {
        await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      await fetchProducts();
    } catch (err) {
      console.error("Lỗi lưu vào MySQL:", err);
    }

    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa cây thuốc này khỏi MySQL database?")) {
      try {
        await fetch(`/api/products/${id}`, { method: "DELETE" });
        await fetchProducts();
      } catch (err) {
        console.error("Lỗi xóa từ MySQL:", err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-stone-900 tracking-tight">
            Quản Lý Cây Thuốc & Bài Thuốc
          </h1>
          <p className="text-stone-500 text-sm mt-0.5">
            Tổng cộng <strong>{productList.length}</strong> bài thuốc đang kinh doanh trên hệ thống
          </p>
        </div>

        {/* Modal thêm bài thuốc mới */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold gap-2 shadow-xs rounded-xl h-10 px-5"
              onClick={openAddDialog}
            >
              <Plus className="h-4 w-4" />
              <span>Thêm Bài Thuốc Mới</span>
            </Button>
          </DialogTrigger>

          {/* Modal dạng Drawer rộng rãi 2 cột */}
          <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 rounded-3xl">
            <DialogHeader className="pb-3 border-b border-stone-200">
              <DialogTitle className="font-heading text-2xl font-bold text-stone-900 flex items-center gap-2">
                <Leaf className="h-6 w-6 text-emerald-800" />
                <span>{editingProduct ? "Chỉnh Sửa Dược Liệu" : "Thêm Bài Thuốc / Cây Thuốc Mới"}</span>
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* CỘT TRÁI: THÔNG TIN CƠ BẢN */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-wider border-b border-emerald-100 pb-1.5">
                    1. Thông Tin Cơ Bản & Phân Loại
                  </h3>

                  <div>
                    <Label className="text-xs font-semibold">Tên cây thuốc / Bài thuốc *</Label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="VD: Cà Gai Leo Quảng Nam"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-semibold">Danh mục dược liệu *</Label>
                    <Select
                      value={formData.categoryId}
                      onValueChange={(v) => setFormData({ ...formData, categoryId: v || "cat-2" })}
                    >
                      <SelectTrigger className="mt-1 bg-white">
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs font-semibold">Xuất xứ vùng trồng</Label>
                      <Input
                        value={formData.origin}
                        onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                        placeholder="Quảng Nam"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold">Khối lượng / Quy cách</Label>
                      <Input
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        placeholder="500g"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-semibold">Thành phần dược liệu</Label>
                    <Input
                      value={formData.ingredients}
                      onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                      placeholder="100% Cà gai leo tự nhiên sấy khô"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-semibold">Tags công dụng (phân cách bằng dấu phẩy)</Label>
                    <Input
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="giải độc gan, hạ men gan, tiêu viêm"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-semibold">Mô tả ngắn hiển thị trên thẻ</Label>
                    <Textarea
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      placeholder="Tóm tắt 1-2 câu về dược tính..."
                      rows={2}
                      className="mt-1"
                    />
                  </div>

                  <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs">
                    <input
                      type="checkbox"
                      id="bestSeller"
                      checked={formData.isBestSeller}
                      onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                      className="h-4 w-4 rounded text-amber-600 focus:ring-amber-500"
                    />
                    <label htmlFor="bestSeller" className="font-semibold text-amber-900 cursor-pointer">
                      Gắn nhãn &ldquo;Sản Phẩm Bán Chạy&rdquo; ngoài trang chủ
                    </label>
                  </div>
                </div>

                {/* CỘT PHẢI: GIÁ, HÌNH ẢNH & Y HỌC */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-wider border-b border-emerald-100 pb-1.5">
                    2. Giá Cả, Tồn Kho & Y Lý Đông Y
                  </h3>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label className="text-xs font-semibold">Giá bán (₫) *</Label>
                      <Input
                        type="number"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="95000"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold">Giá cũ (₫)</Label>
                      <Input
                        type="number"
                        value={formData.originalPrice}
                        onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                        placeholder="135000"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold">Tồn kho (gói) *</Label>
                      <Input
                        type="number"
                        required
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        placeholder="100"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-semibold">Link ảnh mẫu (URL Unsplash hoặc CDN)</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1"
                      />
                      {formData.imageUrl && (
                        <div className="h-10 w-10 rounded-lg overflow-hidden border shrink-0">
                          <img
                            src={formData.imageUrl}
                            alt="preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-semibold">Công dụng & Chủ trị *</Label>
                    <Textarea
                      required
                      value={formData.usage}
                      onChange={(e) => setFormData({ ...formData, usage: e.target.value })}
                      placeholder="Mát gan, giải độc, hạ men gan..."
                      rows={2}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-semibold">Cách dùng & Liều lượng *</Label>
                    <Textarea
                      required
                      value={formData.dosage}
                      onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                      placeholder="Sắc 35-50g với 1.5L nước..."
                      rows={2}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-semibold">Lưu ý & Đối tượng dùng</Label>
                    <Textarea
                      value={formData.precautions}
                      onChange={(e) => setFormData({ ...formData, precautions: e.target.value })}
                      placeholder="Phụ nữ mang thai không nên dùng..."
                      rows={2}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-semibold">Mô tả dược tính chi tiết</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Chi tiết nguồn gốc, nghiên cứu khoa học..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="rounded-xl"
                >
                  Hủy Bỏ
                </Button>
                <Button type="submit" className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl px-6">
                  {editingProduct ? "Lưu Cập Nhật" : "Tạo Mới Cây Thuốc"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <Input
            placeholder="Tìm theo tên cây thuốc, vùng xuất xứ, công dụng..."
            className="pl-10 bg-white border-stone-200 rounded-xl"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <Select
          value={selectedCategory}
          onValueChange={(v) => {
            setSelectedCategory(v || "all");
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-[220px] bg-white border-stone-200 rounded-xl">
            <SelectValue placeholder="Tất cả danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả danh mục ({productList.length})</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Table with Pagination */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden">
        <Table>
          <TableHeader className="bg-stone-50 border-b border-stone-200">
            <TableRow>
              <TableHead className="w-12 text-center">#</TableHead>
              <TableHead>Dược Liệu</TableHead>
              <TableHead>Danh Mục</TableHead>
              <TableHead className="text-right">Giá Bán</TableHead>
              <TableHead className="text-center">Tồn Kho</TableHead>
              <TableHead className="text-center">Đánh Giá</TableHead>
              <TableHead className="text-right">Thao Tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product, index) => {
                const cat = categories.find((c) => c.id === product.categoryId);
                const isLowStock = product.stock < 30;

                return (
                  <TableRow key={product.id} className="hover:bg-stone-50/70 transition-colors">
                    <TableCell className="text-stone-400 font-mono text-xs text-center">
                      {(currentPage - 1) * pageSize + index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-stone-100 flex items-center justify-center shrink-0 overflow-hidden border border-stone-200">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Leaf className="h-6 w-6 text-emerald-800/40" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-sm text-stone-900">
                              {product.name}
                            </p>
                            {product.isBestSeller && (
                              <Badge className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0 border-none font-semibold">
                                Hot
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-stone-500 flex items-center gap-2 mt-0.5">
                            <span>{product.weight}</span>
                            <span>•</span>
                            <span>{product.origin}</span>
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs font-medium border-stone-300">
                        {cat?.name || "Dược liệu"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <p className="font-bold text-sm text-emerald-900">
                        {formatPrice(product.price)}
                      </p>
                      {product.originalPrice && (
                        <p className="text-xs text-stone-400 line-through">
                          {formatPrice(product.originalPrice)}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={isLowStock ? "destructive" : "outline"}
                        className={`text-xs ${
                          isLowStock
                            ? "bg-rose-100 text-rose-800 border-rose-200"
                            : "bg-emerald-50 text-emerald-800 border-emerald-200 font-medium"
                        }`}
                      >
                        {isLowStock && <AlertCircle className="h-3 w-3 mr-1" />}
                        {product.stock} gói
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-sm font-semibold text-stone-800">
                      ⭐ {product.rating}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/products/${product.slug}`} target="_blank">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-stone-500 hover:text-emerald-800"
                            title="Xem trang sản phẩm"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-emerald-800 hover:bg-emerald-100/50"
                          title="Sửa bài thuốc"
                          onClick={() => openEditDialog(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-rose-600 hover:bg-rose-100/50"
                          title="Xóa bài thuốc"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-stone-500">
                  Không tìm thấy bài thuốc nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination Bar */}
        <div className="px-6 py-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>
            Hiển thị <strong>{paginatedProducts.length}</strong> trên <strong>{filteredProducts.length}</strong> bài thuốc
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-semibold text-stone-800">
              Trang {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
