"use client";

import { useState, useEffect } from "react";
import { categories as initialCategories } from "@/data/categories";
import { Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, FolderTree } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categoryList, setCategoryList] = useState<Category[]>(initialCategories);
  const [currentUser, setCurrentUser] = useState<{ role: string } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const isAdmin = currentUser?.role === "ADMIN";

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.user) setCurrentUser(d.user);
      })
      .catch(() => {});
  }, []);

  const resetForm = () => {
    setFormData({ name: "", description: "" });
    setEditingCategory(null);
  };

  const openAddDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = formData.name
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "-");

    if (editingCategory) {
      setCategoryList((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? { ...c, name: formData.name, slug, description: formData.description }
            : c
        )
      );
    } else {
      const newCategory: Category = {
        id: `cat-${Date.now()}`,
        name: formData.name,
        slug,
        description: formData.description,
        icon: "Leaf",
        image: "",
        productCount: 0,
      };
      setCategoryList((prev) => [...prev, newCategory]);
    }
    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc muốn xóa danh mục này?")) {
      setCategoryList((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Quản Lý Danh Mục</h1>
          <p className="text-muted-foreground">
            {categoryList.length} danh mục
          </p>
        </div>
        {isAdmin ? (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold"
                onClick={openAddDialog}
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm danh mục
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-heading text-xl">
                  {editingCategory ? "Sửa danh mục" : "Thêm danh mục mới"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Tên danh mục *</Label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="VD: Cây thuốc tươi"
                  />
                </div>
                <div>
                  <Label>Mô tả</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Mô tả danh mục"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button type="submit" className="bg-emerald-700 hover:bg-emerald-800 text-white">
                    {editingCategory ? "Cập nhật" : "Thêm mới"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        ) : (
          <Badge variant="outline" className="text-xs text-stone-500 py-1.5 px-3">
            🔒 Chỉ Xem (Cần quyền ADMIN để thêm)
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoryList.map((category) => (
          <Card key={category.id} className="hover-lift">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FolderTree className="h-6 w-6 text-primary" />
                </div>
                {isAdmin && (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openEditDialog(category)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>
              <h3 className="font-heading text-lg font-semibold">
                {category.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {category.description}
              </p>
              <p className="text-xs text-primary font-medium mt-3">
                {category.productCount} sản phẩm
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
