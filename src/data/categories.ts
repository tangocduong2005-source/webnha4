import { Category } from "@/types";

export const categories: Category[] = [
  {
    id: "cat-1",
    name: "Cây thuốc tươi",
    slug: "cay-thuoc-tuoi",
    description:
      "Các loại cây thuốc tươi sống, giữ nguyên dưỡng chất tự nhiên, trồng theo phương pháp hữu cơ.",
    icon: "Sprout",
    image: "/images/categories/cay-thuoc-tuoi.jpg",
    productCount: 12,
  },
  {
    id: "cat-2",
    name: "Dược liệu khô",
    slug: "duoc-lieu-kho",
    description:
      "Dược liệu đã qua sơ chế, sấy khô đúng quy trình, bảo quản tốt, tiện lợi sử dụng.",
    icon: "Leaf",
    image: "/images/categories/duoc-lieu-kho.jpg",
    productCount: 18,
  },
  {
    id: "cat-3",
    name: "Trà thảo mộc",
    slug: "tra-thao-moc",
    description:
      "Trà túi lọc và trà lá từ các loại thảo mộc thiên nhiên, hỗ trợ sức khỏe hàng ngày.",
    icon: "Coffee",
    image: "/images/categories/tra-thao-moc.jpg",
    productCount: 10,
  },
  {
    id: "cat-4",
    name: "Thuốc nam gia truyền",
    slug: "thuoc-nam-gia-truyen",
    description:
      "Các bài thuốc nam gia truyền được truyền từ đời này sang đời khác, đã được kiểm chứng.",
    icon: "FlaskConical",
    image: "/images/categories/thuoc-nam-gia-truyen.jpg",
    productCount: 8,
  },
];
