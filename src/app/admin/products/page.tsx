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
import { Plus, Pencil, Trash2, Search, Leaf, AlertCircle } from "lucide-react";

export default function AdminProductsPage() {
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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
    origin: "",
    ingredients: "",
    weight: "500g",
    stock: "100",
    tags: "",
  });

  // Tải dữ liệu từ localStorage khi mở trang
  useEffect(() => {
    try {
      const saved = localStorage.getItem("thaoduocxanh-products");
      if (saved) {
        setProductList(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveProducts = (newList: Product[]) => {
    setProductList(newList);
    try {
      localStorage.setItem("thaoduocxanh-products", JSON.stringify(newList));
    } catch (e) {
      console.error(e);
    }
  };

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

  const resetForm = () => {
    setFormData({
      name: "",
      categoryId: "cat-2",
      price: "",
      originalPrice: "",
      imageUrl: "",
      shortDescription: "",
      description: "",
      usage: "",
      dosage: "",
      origin: "Việt Nam",
      ingredients: "100% thảo dược thiên nhiên",
      weight: "500g",
      stock: "100",
      tags: "",
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
      origin: product.origin,
      ingredients: product.ingredients || "",
      weight: product.weight,
      stock: product.stock.toString(),
      tags: product.tags.join(", "),
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
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
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80";

    const productData: Product = {
      id: editingProduct?.id || `prod-${Date.now()}`,
      name: formData.name,
      slug,
      categoryId: formData.categoryId,
      price: Number(formData.price) || 0,
      originalPrice: formData.originalPrice
        ? Number(formData.originalPrice)
        : undefined,
      images: [defaultImage],
      shortDescription: formData.shortDescription,
      description: formData.description,
      usage: formData.usage,
      dosage: formData.dosage,
      origin: formData.origin,
      ingredients: formData.ingredients,
      weight: formData.weight,
      stock: Number(formData.stock) || 0,
      rating: editingProduct?.rating || 5.0,
      reviewCount: editingProduct?.reviewCount || 1,
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      isFeatured: true,
      isNew: editingProduct ? editingProduct.isNew : true,
      createdAt:
        editingProduct?.createdAt || new Date().toISOString().slice(0, 10),
    };

    if (editingProduct) {
      saveProducts(
        productList.map((p) => (p.id === editingProduct.id ? productData : p))
      );
    } else {
      saveProducts([productData, ...productList]);
    }

    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa cây thuốc này khỏi danh sách?")) {
      saveProducts(productList.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Quản Lý Cây Thuốc & Dược Liệu
          </h1>
          <p className="text-muted-foreground text-sm">
            Hiện có <strong>{productList.length}</strong> bài thuốc / cây dược liệu trong hệ thống
          </p>
        </div>

        {/* Add Product Modal Trigger */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary hover:bg-primary/90 text-white gap-2 shadow-xs"
              onClick={openAddDialog}
            >
              <Plus className="h-4 w-4" />
              <span>Thêm Bài Thuốc Mới</span>
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">
                {editingProduct ? "Chỉnh Sửa Thông Tin Cây Thuốc" : "Thêm Cây Thuốc Mới"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>Tên cây thuốc / Bài thuốc *</Label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="VD: Cà Gai Leo Quảng Nam Sấy Khô"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Danh mục *</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(v) =>
                      setFormData({ ...formData, categoryId: v || "cat-2" })
                    }
                  >
                    <SelectTrigger className="mt-1">
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

                <div>
                  <Label>Xuất xứ vùng trồng</Label>
                  <Input
                    value={formData.origin}
                    onChange={(e) =>
                      setFormData({ ...formData, origin: e.target.value })
                    }
                    placeholder="VD: Quảng Nam, Việt Nam"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Giá bán (VNĐ) *</Label>
                  <Input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="95000"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Giá niêm yết cũ (nếu giảm giá)</Label>
                  <Input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, originalPrice: e.target.value })
                    }
                    placeholder="135000"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Số lượng tồn kho (gói/hộp) *</Label>
                  <Input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    placeholder="100"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Quy cách đóng gói / Khối lượng</Label>
                  <Input
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: e.target.value })
                    }
                    placeholder="500g hoặc 1kg"
                    className="mt-1"
                  />
                </div>

                <div className="col-span-2">
                  <Label>Link ảnh mẫu (URL Unsplash hoặc Web)</Label>
                  <Input
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    placeholder="https://images.unsplash.com/photo-..."
                    className="mt-1"
                  />
                </div>

                <div className="col-span-2">
                  <Label>Mô tả ngắn gọn (hiển thị trên thẻ)</Label>
                  <Textarea
                    value={formData.shortDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shortDescription: e.target.value,
                      })
                    }
                    placeholder="Tóm tắt 1-2 câu về tác dụng dược tính chính..."
                    rows={2}
                    className="mt-1"
                  />
                </div>

                <div className="col-span-2">
                  <Label>Công dụng & Chủ trị *</Label>
                  <Textarea
                    required
                    value={formData.usage}
                    onChange={(e) =>
                      setFormData({ ...formData, usage: e.target.value })
                    }
                    placeholder="Hạ men gan, mát gan, tiêu độc, kháng viêm..."
                    rows={3}
                    className="mt-1"
                  />
                </div>

                <div className="col-span-2">
                  <Label>Hướng dẫn cách dùng & Liều lượng *</Label>
                  <Textarea
                    required
                    value={formData.dosage}
                    onChange={(e) =>
                      setFormData({ ...formData, dosage: e.target.value })
                    }
                    placeholder="Cách sắc uống, liều gram, hãm trà hoặc ngâm rượu..."
                    rows={3}
                    className="mt-1"
                  />
                </div>

                <div className="col-span-2">
                  <Label>Tags phân loại (phân cách bằng dấu phẩy)</Label>
                  <Input
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    placeholder="giải độc gan, viêm gan, đau dạ dày"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
                  {editingProduct ? "Lưu Thay Đổi" : "Tạo Cây Thuốc Mới"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên cây thuốc, xuất xứ, công dụng..."
            className="pl-10 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v || "all")}>
          <SelectTrigger className="w-full sm:w-[200px] bg-white">
            <SelectValue placeholder="Tất cả danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả danh mục</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-accent/30">
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Cây Dược Liệu</TableHead>
              <TableHead>Danh Mục</TableHead>
              <TableHead className="text-right">Giá Bán</TableHead>
              <TableHead className="text-center">Tồn Kho</TableHead>
              <TableHead className="text-center">Đánh Giá</TableHead>
              <TableHead className="text-right">Thao Tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product, index) => {
              const cat = categories.find((c) => c.id === product.categoryId);
              const isLowStock = product.stock < 30;

              return (
                <TableRow key={product.id} className="hover:bg-accent/10">
                  <TableCell className="text-muted-foreground font-mono text-xs">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-accent/30 flex items-center justify-center shrink-0 overflow-hidden border">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Leaf className="h-6 w-6 text-primary/40" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">
                          {product.name}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                          <span>{product.weight}</span>
                          <span>•</span>
                          <span>{product.origin}</span>
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs font-medium">
                      {cat?.name || "Dược liệu"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <p className="font-bold text-sm text-primary">
                      {formatPrice(product.price)}
                    </p>
                    {product.originalPrice && (
                      <p className="text-xs text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={isLowStock ? "destructive" : "outline"}
                      className={`text-xs ${
                        isLowStock ? "bg-red-100 text-red-700 border-red-200" : "bg-green-50 text-green-700 border-green-200"
                      }`}
                    >
                      {isLowStock && <AlertCircle className="h-3 w-3 mr-1" />}
                      {product.stock} gói
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center text-sm font-medium">
                    ⭐ {product.rating}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                        title="Chỉnh sửa cây thuốc"
                        onClick={() => openEditDialog(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        title="Xóa khỏi danh sách"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
