import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌿 Bắt đầu nạp dữ liệu chuẩn Đông Y vào MySQL database 'thaoduocxanh'...\n");

  // Xóa dữ liệu cũ
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  console.log("✅ Đã làm sạch các bảng.");

  // 1. Tạo danh mục
  await prisma.category.createMany({
    data: [
      {
        id: "cat-1",
        name: "Cây thuốc tươi",
        slug: "cay-thuoc-tuoi",
        description: "Các loại cây thuốc tươi sống, giữ nguyên dược tính tự nhiên, trồng theo phương pháp hữu cơ.",
        image: "/images/categories/cay-thuoc-tuoi.jpg",
      },
      {
        id: "cat-2",
        name: "Dược liệu khô",
        slug: "duoc-lieu-kho",
        description: "Dược liệu đã qua sơ chế, sấy khô đúng quy trình, bảo quản tốt, tiện lợi sử dụng.",
        image: "/images/categories/duoc-lieu-kho.jpg",
      },
      {
        id: "cat-3",
        name: "Trà thảo mộc",
        slug: "tra-thao-moc",
        description: "Trà túi lọc và trà lá từ các loại thảo mộc thiên nhiên, hỗ trợ sức khỏe hàng ngày.",
        image: "/images/categories/tra-thao-moc.jpg",
      },
      {
        id: "cat-4",
        name: "Thuốc nam gia truyền",
        slug: "thuoc-nam-gia-truyen",
        description: "Các bài thuốc nam gia truyền được truyền từ đời này sang đời khác, đã được kiểm chứng.",
        image: "/images/categories/thuoc-nam-gia-truyen.jpg",
      },
    ],
  });
  console.log("✅ Đã tạo 4 danh mục bài thuốc.");

  // 2. Tạo các cây thuốc mẫu
  const products = [
    {
      id: "prod-1",
      name: "Cà Gai Leo Sấy Khô Chuẩn GMP",
      slug: "ca-gai-leo",
      categoryId: "cat-2",
      price: 95000,
      originalPrice: 135000,
      images: [
        "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80",
      ],
      description: "Cà gai leo (Solanum procumbens Lour.) mọc hoang dã tại vùng miền Trung. Chứa Glycoalkaloid có tác dụng ức chế sự sao chép của virus viêm gan B, ngăn ngừa xơ gan và hạ men gan vượt trội.",
      usage: "Tăng cường chức năng giải độc gan, bảo vệ tế bào gan khỏi tác hại bia rượu. Hỗ trợ điều trị viêm gan B mãn tính, hạ men gan. Thanh nhiệt mát gan, giảm mề đay.",
      dosage: "Sắc uống: 35-50g cà gai leo khô sắc với 1.2 - 1.5 lít nước, đun sôi nhỏ lửa 15 phút. Uống chia nhiều lần trong ngày.",
      precautions: "Phụ nữ mang thai hoặc cho con bú dưới 6 tháng tuổi không dùng. Người huyết áp thấp nên uống sau khi ăn no kèm vài lát gừng.",
      origin: "Quảng Nam, Việt Nam",
      unit: "gói",
      stock: 120,
      isBestSeller: true,
      isActive: true,
    },
    {
      id: "prod-2",
      name: "Rễ & Thân Cây Đinh Lăng Lá Nhỏ Sao Vàng",
      slug: "dinh-lang",
      categoryId: "cat-1",
      price: 125000,
      originalPrice: 160000,
      images: [
        "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1000&q=80",
      ],
      description: "Đinh lăng lá nhỏ (Polyscias fruticosa) được ví như Nhân sâm của người nghèo. Chứa hơn 20 loại saponin triterpenic, bồi bổ khí huyết, tăng lực và tuần hoàn não.",
      usage: "Bồi bổ khí huyết, chống suy nhược mệt mỏi. Tăng tuần hoàn máu não, trị đau đầu tiền đình, mất ngủ kinh niên. Kích thích tiêu hóa, lợi sữa cho phụ nữ sau sinh.",
      dosage: "Sắc uống: 25-30g rễ sao vàng sắc 600ml nước còn 300ml. Ngâm rượu: 500g đinh lăng ngâm 4-5 lít rượu nếp, uống 1 ly mỗi bữa ăn.",
      precautions: "Không lạm dụng quá liều vì chứa saponin cao. Phụ nữ mang thai 3 tháng đầu không dùng.",
      origin: "Hải Hậu, Nam Định, Việt Nam",
      unit: "gói",
      stock: 85,
      isBestSeller: true,
      isActive: true,
    },
    {
      id: "prod-3",
      name: "Trà Dây Rừng Phấn Tuyết Sapa",
      slug: "tra-day",
      categoryId: "cat-3",
      price: 79000,
      originalPrice: 110000,
      images: [
        "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1000&q=80",
      ],
      description: "Trà dây (Ampelopsis cantoniensis) sinh trưởng vách đá núi cao Sapa. Phấn tuyết tự nhiên chứa hàm lượng Flavonoid cao kháng viêm và diệt xoắn khuẩn HP.",
      usage: "Hỗ trợ điều trị viêm loét dạ dày, trào ngược thực quản, tiêu diệt khuẩn HP. Cắt cơn đau rát thượng vị, giảm ợ chua, an thần giúp ngủ ngon.",
      dosage: "Hãm trà: 15-20g trà dây khô hãm 500ml nước sôi 10-15 phút. Thời điểm vàng: Uống sáng sớm trước ăn 30 phút.",
      precautions: "Không uống nước trà để qua đêm. Người thể hàn nên thêm lát gừng tươi.",
      origin: "Sapa, Lào Cai, Việt Nam",
      unit: "gói",
      stock: 210,
      isBestSeller: true,
      isActive: true,
    },
    {
      id: "prod-xao-tam-phan",
      name: "Rễ Xáo Tam Phân Hòn Hèo Khánh Hòa",
      slug: "xao-tam-phan",
      categoryId: "cat-4",
      price: 390000,
      originalPrice: 480000,
      images: [
        "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=1000&q=80",
      ],
      description: "Xáo tam phân (Paramignya trimera) núi Hòn Hèo. Viện Dược liệu chứng minh chiết xuất rễ có khả năng ức chế 5 dòng tế bào u xơ ác tính và tiêu độc gan mạnh mẽ.",
      usage: "Hỗ trợ phòng ngừa và ức chế tế bào ung thư. Giải độc gan cấp, hạ men gan, phục hồi xơ gan. Tăng cường miễn dịch cho người sau hóa trị/xạ trị.",
      dosage: "Sắc uống: 40-50g rễ sao vàng sắc với 1.5 lít nước cô cạn còn 800ml-1 lít, chia uống trong ngày.",
      precautions: "Tuyệt đối không dùng cho phụ nữ mang thai. Người suy thận nặng cần có chỉ định của bác sĩ.",
      origin: "Núi Hòn Hèo, Khánh Hòa, Việt Nam",
      unit: "gói",
      stock: 45,
      isBestSeller: true,
      isActive: true,
    },
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
      description: "Thảo dược trường thọ Giảo cổ lam 5 lá thu hái tại núi cao Hà Giang. Giảm cholesterol xấu, hạ huyết áp và hỗ trợ giảm cân.",
      usage: "Giảm mỡ máu, ổn định huyết áp và đường huyết. Chống oxy hóa, làm chậm lão hóa, nâng cao sức đề kháng.",
      dosage: "Hãm trà: 5-10g hãm với 300ml nước sôi 85°C. Uống 2-3 ấm mỗi ngày.",
      precautions: "Người huyết áp thấp uống sau khi ăn no. Không uống trước khi đi ngủ vì gây tỉnh táo.",
      origin: "Hà Giang, Việt Nam",
      unit: "gói",
      stock: 120,
      isBestSeller: false,
      isActive: true,
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
      description: "Cao Atiso nguyên chất Đà Lạt chứa Cynarin và Silymarin mát gan, lợi mật, đào thải độc tố cơ thể tự nhiên.",
      usage: "Mát gan, giải độc, hạ men gan. Giảm mụn nhọt, mẩn ngứa do nóng trong. Hỗ trợ tiêu hóa và giảm cholesterol.",
      dosage: "Hòa 1 thìa cà phê cao Atiso với 200ml nước ấm uống trước bữa ăn 30 phút.",
      precautions: "Không lạm dụng uống thay nước lọc. Người tắc ống dẫn mật cần hỏi ý kiến bác sĩ.",
      origin: "Đà Lạt, Lâm Đồng, Việt Nam",
      unit: "hộp",
      stock: 95,
      isBestSeller: false,
      isActive: true,
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
      description: "Lá đắng rừng Tây Nguyên thanh nhiệt, hỗ trợ hạ đường huyết cho người tiểu đường và điều hòa huyết áp.",
      usage: "Thanh nhiệt, giải độc cơ thể, hỗ trợ người tiểu đường, kích thích tiêu hóa.",
      dosage: "Sắc 20g khô hoặc hãm trà 10-15g uống trong ngày.",
      precautions: "Người huyết áp thấp dùng liều nhỏ. Phụ nữ có thai tham khảo ý kiến bác sĩ.",
      origin: "Đắk Lắk, Việt Nam",
      unit: "gói",
      stock: 80,
      isBestSeller: false,
      isActive: true,
    },
  ];

  for (const p of products) {
    await prisma.product.create({ data: p });
  }
  console.log(`✅ Đã tạo thành công ${products.length} cây thuốc trong MySQL.`);

  // 3. Tạo các đơn hàng mẫu
  await prisma.order.create({
    data: {
      orderCode: "DH-20241015-1001",
      customerName: "Nguyễn Văn An",
      customerPhone: "0912345678",
      customerEmail: "nguyenvanan@gmail.com",
      customerAddress: "123 Nguyễn Huệ, Quận 1, TP.HCM",
      totalAmount: 315000,
      status: "delivered",
      paymentMethod: "bank_transfer",
      paymentStatus: "paid",
      notes: "Giao vào buổi sáng",
      items: {
        create: [
          { productId: "prod-1", quantity: 2, price: 95000 },
          { productId: "prod-2", quantity: 1, price: 125000 },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      orderCode: "DH-20241016-1002",
      customerName: "Trần Thị Bích",
      customerPhone: "0987654321",
      customerEmail: "trantibich@gmail.com",
      customerAddress: "45 Trần Phú, Quận 5, TP.HCM",
      totalAmount: 469000,
      status: "confirmed",
      paymentMethod: "cod",
      paymentStatus: "unpaid",
      items: {
        create: [
          { productId: "prod-3", quantity: 1, price: 79000 },
          { productId: "prod-xao-tam-phan", quantity: 1, price: 390000 },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      orderCode: "DH-20241017-1003",
      customerName: "Lê Minh Hoàng",
      customerPhone: "0909123456",
      customerAddress: "78 Lê Lợi, Quận Hải Châu, Đà Nẵng",
      totalAmount: 220000,
      status: "pending",
      paymentMethod: "bank_transfer",
      paymentStatus: "unpaid",
      items: {
        create: [
          { productId: "prod-5", quantity: 1, price: 95000 },
          { productId: "prod-2", quantity: 1, price: 125000 },
        ],
      },
    },
  });

  console.log("✅ Đã tạo các đơn hàng mẫu trong MySQL.");
  console.log("\n🎉 HOÀN TẤT ĐỔ DỮ LIỆU VÀO MYSQL WORKBENCH THÀNH CÔNG!");
}

main()
  .catch((e) => {
    console.error("❌ Lỗi:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
