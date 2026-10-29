import { Product, Review } from "@/types";
import { medicinalHerbs } from "./medicinal-herbs";

export { medicinalHerbs };

const otherProducts: Product[] = [
  {
    id: "prod-5",
    name: "Giảo Cổ Lam 5 Lá Hà Giang",
    slug: "giao-co-lam",
    categoryId: "cat-3",
    price: 95000,
    originalPrice: 130000,
    images: [
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
    ],
    shortDescription:
      "Thảo dược trường thọ - Giảm mỡ máu, hạ huyết áp, ổn định đường huyết và chống oxy hóa tế bào.",
    description: `Giảo cổ lam (Gynostemma pentaphyllum) được mệnh danh là "Thảo dược trường thọ" hay "Cỏ trường sinh". Đây là loại dược liệu quý được sử dụng rộng rãi trong y học cổ truyền Trung Hoa và Việt Nam hàng nghìn năm.

Giảo cổ lam chứa hơn 100 loại saponin (gypenoside), trong đó nhiều loại tương tự saponin trong Nhân sâm. Ngoài ra còn chứa flavonoid, polysaccharide, amino acid, vitamin và khoáng chất thiết yếu.

Các nghiên cứu lâm sàng tại nhiều quốc gia đã chứng minh Giảo cổ lam có tác dụng giảm cholesterol, hạ huyết áp, chống oxy hóa và tăng cường miễn dịch. Sản phẩm sử dụng Giảo cổ lam 5 lá (loại dược tính cao nhất), thu hái tại vùng núi Hà Giang.`,
    usage:
      "Giảm mỡ máu, cholesterol xấu (LDL). Hạ huyết áp, ổn định đường huyết. Chống oxy hóa, làm chậm quá trình lão hóa. Tăng cường miễn dịch, giảm stress. Hỗ trợ giảm cân an toàn.",
    dosage:
      "Hãm trà: 5-10g Giảo cổ lam khô hãm với 200-300ml nước sôi 85°C, đậy nắp 5-7 phút. Uống 2-3 ấm/ngày. Có thể hãm lại 2-3 lần.\nSắc uống: 20-30g sắc với 1 lít nước, đun sôi nhỏ lửa 15 phút. Chia uống trong ngày.",
    origin: "Hà Giang, Việt Nam",
    ingredients: "100% Giảo cổ lam 5 lá tự nhiên",
    weight: "250g",
    stock: 120,
    rating: 4.9,
    reviewCount: 203,
    tags: [
      "giảm mỡ máu",
      "hạ huyết áp",
      "chống lão hóa",
      "giảm cân",
      "tăng miễn dịch",
    ],
    precautions: "• Người huyết áp thấp nên uống sau khi ăn no, không uống lúc bụng đói.\n• Tránh uống vào buổi tối trước khi đi ngủ vì Giảo cổ lam tăng tỉnh táo, có thể khó ngủ.",
    isFeatured: true,
    isNew: false,
    createdAt: "2024-01-05",
  },
  {
    id: "prod-6",
    name: "Cao Atiso Đà Lạt Chuẩn Dược Liệu",
    slug: "atiso-da-lat",
    categoryId: "cat-4",
    price: 75000,
    originalPrice: 100000,
    images: [
      "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
    ],
    shortDescription:
      "Đặc sản Đà Lạt - Mát gan, lợi mật, thanh nhiệt, giải độc cơ thể tự nhiên và giảm mụn nhọt.",
    description: `Atiso (Cynara scolymus) là loại dược liệu nổi tiếng được trồng nhiều tại Đà Lạt, Lâm Đồng. Với khí hậu mát mẻ quanh năm, Đà Lạt tạo điều kiện lý tưởng cho cây Atiso phát triển và cho dược tính cao nhất.

Atiso chứa nhiều Cynarin, Silymarin, Inulin, cùng các vitamin A, B, C và khoáng chất. Cynarin là hoạt chất đặc trưng có tác dụng bảo vệ gan, lợi mật, giảm cholesterol. Inulin là prebiotic tốt cho hệ tiêu hóa.

Sản phẩm là cao Atiso được chiết xuất từ hoa, lá và thân cây Atiso Đà Lạt theo công nghệ hiện đại, đảm bảo giữ nguyên hoạt chất.`,
    usage:
      "Mát gan, lợi mật, hỗ trợ chức năng gan. Thanh nhiệt, giải độc cơ thể. Giảm cholesterol, hỗ trợ tiêu hóa. Lợi tiểu, hỗ trợ giảm phù nề. Tốt cho người bị mụn nhọt, nóng trong.",
    dosage:
      "Cao Atiso: Hòa 1-2 thìa cà phê cao Atiso với 200ml nước ấm. Uống 2-3 lần/ngày, trước bữa ăn 30 phút.\nTrà Atiso: Hãm 1 túi trà với 200ml nước sôi, đợi 5 phút. Uống 2-3 lần/ngày.",
    origin: "Đà Lạt, Lâm Đồng, Việt Nam",
    ingredients: "Cao chiết xuất Atiso (hoa, lá, thân), đường phèn, bột Atiso",
    weight: "500g",
    stock: 95,
    rating: 4.7,
    reviewCount: 178,
    tags: ["mát gan", "lợi mật", "thanh nhiệt", "giải độc", "giảm cholesterol"],
    precautions: "• Không nên lạm dụng uống quá nhiều thay nước lọc vì tính lợi tiểu mạnh có thể gây mất điện giải.\n• Người bị tắc ống dẫn mật cần hỏi ý kiến chuyên môn.",
    isFeatured: true,
    isNew: false,
    createdAt: "2024-02-01",
  },
  {
    id: "prod-4",
    name: "Lá Đắng Rừng Tây Nguyên (Vernonia amygdalina)",
    slug: "la-dang",
    categoryId: "cat-1",
    price: 45000,
    originalPrice: 60000,
    images: [
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=800&q=80",
    ],
    shortDescription:
      "Thanh nhiệt giải độc, hạ đường huyết, hỗ trợ người tiểu đường và huyết áp cao.",
    description: `Lá đắng (Vernonia amygdalina) hay còn gọi là cây Lá đắng, Kim thất tai, là loại cây phổ biến ở vùng Tây Nguyên và Đông Nam Bộ. Cây được đồng bào dân tộc sử dụng trong bữa ăn hàng ngày như một loại rau có tính dược liệu.

Lá đắng chứa nhiều chất chống oxy hóa, flavonoid, saponin, tannin, và các vitamin khoáng chất. Đặc biệt, các nghiên cứu cho thấy Lá đắng có khả năng hỗ trợ hạ đường huyết, điều hòa huyết áp và giảm cholesterol hiệu quả.`,
    usage:
      "Thanh nhiệt, giải độc cơ thể. Hỗ trợ hạ đường huyết cho người tiểu đường. Điều hòa huyết áp, giảm cholesterol xấu. Hỗ trợ tiêu hóa, kích thích ăn ngon.",
    dosage:
      "Nấu canh: Dùng 100-150g lá tươi nấu canh với thịt hoặc tôm.\nSắc uống: 50g lá tươi (hoặc 20g khô) sắc với 500ml nước, uống 2 lần/ngày.\nHãm trà: 10-15g lá khô hãm nước sôi, uống thay trà.",
    origin: "Đắk Lắk, Tây Nguyên, Việt Nam",
    ingredients: "100% Lá đắng tươi hữu cơ sấy sạch",
    weight: "500g",
    stock: 80,
    rating: 4.5,
    reviewCount: 67,
    tags: ["thanh nhiệt", "hạ đường huyết", "tiểu đường", "huyết áp", "giải độc"],
    isFeatured: false,
    isNew: true,
    createdAt: "2024-03-05",
  },
];

// Danh sách toàn bộ sản phẩm (4 loại cây lá thuốc chính đặt hàng đầu)
export const products: Product[] = [...medicinalHerbs, ...otherProducts];

export const reviews: Review[] = [
  {
    id: "rev-1",
    productId: "prod-1",
    userName: "Nguyễn Văn An",
    rating: 5,
    comment:
      "Dùng Cà gai leo được 2 tháng, men gan từ 80 đã giảm về mức bình thường 32. Sản phẩm rất thơm và sạch, đóng gói hút chân không cẩn thận.",
    date: "2024-03-15",
  },
  {
    id: "rev-2",
    productId: "prod-1",
    userName: "Trần Thị Bích",
    rating: 5,
    comment:
      "Chồng tôi hay phải tiếp khách uống bia rượu, tối nào về cũng uống 1 cốc cà gai leo ấm, sáng hôm sau dậy không bị đau đầu mệt mỏi.",
    date: "2024-03-10",
  },
  {
    id: "rev-3",
    productId: "prod-3",
    userName: "Lê Minh Hoàng",
    rating: 5,
    comment:
      "Bị đau dạ dày và khuẩn HP dương tính 3 năm nay, uống trà dây Sapa mỗi sáng trước ăn 30 phút, đi xét nghiệm lại HP đã về âm tính, hết ợ chua!",
    date: "2024-02-28",
  },
  {
    id: "rev-4",
    productId: "prod-2",
    userName: "Võ Đình Tùng",
    rating: 5,
    comment:
      "Rễ đinh lăng sao vàng rất thơm, ngâm 1 bình rượu nếp 5 lít uống mỗi bữa cơm 1 ly thấy ăn ngon, đêm ngủ một mạch tới sáng, người nhẹ nhõm hẳn.",
    date: "2024-03-18",
  },
  {
    id: "rev-5",
    productId: "prod-xao-tam-phan",
    userName: "Bác sĩ Phạm Văn Thuận",
    rating: 5,
    comment:
      "Rễ xáo tam phân Hòn Hèo chuẩn xịn, lát thái mỏng vàng ươm, mùi thơm thảo mộc đặc trưng. Tôi mua cho người nhà đang điều trị khối u uống sắc nước hằng ngày, chỉ số men gan và thể lực cải thiện rõ rệt.",
    date: "2024-03-24",
  },
  {
    id: "rev-6",
    productId: "prod-xao-tam-phan",
    userName: "Trần Mai Phương",
    rating: 5,
    comment:
      "Dược liệu quý chất lượng cao, đúng gốc Khánh Hòa. Sắc uống vị đắng thanh sau đó ngọt hậu, rất yên tâm khi mua tại Cây Thuốc Ông Han.",
    date: "2024-03-20",
  },
  {
    id: "rev-7",
    productId: "prod-5",
    userName: "Phạm Thị Lan",
    rating: 5,
    comment:
      "Giảo cổ lam rất tốt cho sức khỏe. Uống hàng ngày thay trà, mỡ máu giảm rõ rệt.",
    date: "2024-03-20",
  },
  {
    id: "rev-8",
    productId: "prod-6",
    userName: "Hoàng Thị Mai",
    rating: 5,
    comment:
      "Atiso Đà Lạt chính gốc, uống mát gan lắm. Đóng gói đẹp, giao hàng nhanh.",
    date: "2024-03-12",
  },
];

// Toàn bộ tags tổng hợp từ các cây thuốc và dược liệu
export const allTags = Array.from(
  new Set(products.flatMap((product) => product.tags))
);
