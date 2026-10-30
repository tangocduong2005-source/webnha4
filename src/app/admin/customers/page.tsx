"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  lastOrderCode: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setCustomers(json.data);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        console.error("Lỗi lấy danh sách khách hàng:", e);
        setIsLoading(false);
      });
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const filteredCustomers = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      (c.name || "").toLowerCase().includes(q) ||
      (c.phone || "").includes(q) ||
      (c.email || "").toLowerCase().includes(q) ||
      (c.address || "").toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / pageSize));
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-stone-900 tracking-tight">
            Quản Lý Khách Hàng
          </h1>
          <p className="text-stone-500 text-sm mt-0.5">
            Danh sách khách đã đặt mua cây thuốc & dược liệu trên toàn quốc ({customers.length} khách hàng)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 border-none font-semibold">
            {customers.reduce((acc, c) => acc + c.totalOrders, 0)} Tổng lượt đặt
          </Badge>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <Input
            placeholder="Tìm theo tên, SĐT, email hoặc địa chỉ khách..."
            className="pl-10 bg-white border-stone-200 rounded-xl"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden">
        <Table>
          <TableHeader className="bg-stone-50 border-b border-stone-200">
            <TableRow>
              <TableHead>Khách Hàng</TableHead>
              <TableHead>Liên Hệ</TableHead>
              <TableHead>Địa Chỉ Nhận Hàng</TableHead>
              <TableHead className="text-center">Số Đơn Mua</TableHead>
              <TableHead className="text-right">Tổng Tiền Đã Mua</TableHead>
              <TableHead className="text-right">Tương Tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-stone-500">
                  Đang tải danh sách khách hàng...
                </TableCell>
              </TableRow>
            ) : paginatedCustomers.length > 0 ? (
              paginatedCustomers.map((customer) => (
                <TableRow key={customer.id} className="hover:bg-stone-50/70 transition-colors">
                  {/* Name */}
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                        {customer.name ? customer.name.slice(0, 2).toUpperCase() : "KH"}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-stone-900">{customer.name}</p>
                        <p className="text-[11px] text-stone-500">
                          Đơn gần nhất: <span className="font-mono text-emerald-700 font-semibold">{customer.lastOrderCode}</span>
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Contact */}
                  <TableCell>
                    <div className="space-y-0.5 text-xs text-stone-600">
                      <p className="flex items-center gap-1.5 font-semibold text-stone-800">
                        <Phone className="h-3 w-3 text-emerald-600" />
                        <span>{customer.phone}</span>
                      </p>
                      {customer.email && (
                        <p className="flex items-center gap-1.5 text-stone-500 text-[11px]">
                          <Mail className="h-3 w-3" />
                          <span className="truncate max-w-[160px]">{customer.email}</span>
                        </p>
                      )}
                    </div>
                  </TableCell>

                  {/* Address */}
                  <TableCell className="max-w-[240px]">
                    <p className="text-xs text-stone-600 truncate flex items-start gap-1">
                      <MapPin className="h-3.5 w-3.5 text-stone-400 shrink-0 mt-0.5" />
                      <span title={customer.address}>{customer.address}</span>
                    </p>
                  </TableCell>

                  {/* Orders Count */}
                  <TableCell className="text-center">
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200 font-bold">
                      {customer.totalOrders} đơn
                    </Badge>
                  </TableCell>

                  {/* Total Spent */}
                  <TableCell className="text-right font-extrabold text-sm text-emerald-900">
                    {formatPrice(customer.totalSpent)}
                  </TableCell>

                  {/* Action */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={`https://zalo.me/${customer.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Mở Zalo khách hàng"
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2.5 text-xs text-[#0068FF] border-[#0068FF]/30 hover:bg-[#0068FF]/10 gap-1 rounded-lg"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>Zalo</span>
                        </Button>
                      </a>

                      <a href={`tel:${customer.phone}`} title="Gọi điện">
                        <Button
                          size="sm"
                          className="h-8 px-2.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg gap-1"
                        >
                          <Phone className="h-3.5 w-3.5" />
                          <span>Gọi</span>
                        </Button>
                      </a>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-stone-500">
                  Không tìm thấy khách hàng nào phù hợp.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination Bar */}
        <div className="px-6 py-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>
            Hiển thị <strong>{paginatedCustomers.length}</strong> trên <strong>{filteredCustomers.length}</strong> khách hàng
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
