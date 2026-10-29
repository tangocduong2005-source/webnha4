import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌿 Bắt đầu đổ dữ liệu mẫu vào MySQL...\n");

  // ============ Xóa dữ liệu cũ (nếu có) ============
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  console.log("✅ Đã xóa sạch dữ liệu cũ.");

  // ============ 1. TẠO DANH MỤC ============
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        id: "cat-1",
        name: "Cây thuốc tươi",
        slug: "cay-thuoc-tuoi",
        description: "Các loại cây thuốc tươi sống, giữ nguyên dưỡng chất tự nhiên, trồng theo phương pháp hữu cơ.",
        image: "/images/categories/cay-thuoc-tuoi.jpg",
      },
    }),
    prisma.category.create({
      data: {
        id: "cat-2",
        name: "Dược liệu khô",
        slug: "duoc-lieu-kho",
        description: "Dược liệu đã qua sơ chế, sấy khô đúng quy trình, bảo quản tốt, tiện lợi sử dụng.",
        image: "/images/categories/duoc-lieu-kho.jpg",
      },
    }),
    prisma.category.create({
      data: {
        id: "cat-3",
        name: "Trà thảo mộc",
        slug: "tra-thao-moc",
        description: "Trà túi lọc và trà lá từ các loại thảo mộc thiên nhiên, hỗ trợ sức khỏe hàng ngày.",
        image: "/images/categories/tra-thao-moc.jpg",
      },
    }),
    prisma.category.create({
      data: {
        id: "cat-4",
        name: "Thuốc nam gia truyền",
        slug: "thuoc-nam-gia-truyen",
        description: "Các bài thuốc nam gia truyền được truyền từ đời này sang đời khác, đã được kiểm chứng.",
        image: "/images/categories/thuoc-nam-gia-truyen.jpg",
      },
    }),
  ]);
  console.log(`✅ Đã tạo ${categories.length} danh mục sản phẩm.`);

  // ============ 2. TẠO SẢN PHẨM ============
  const products = await Promise.all([
    // --- Cà Gai Leo ---
    prisma.product.create({
      data: {
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
        description: `Cà gai leo (tên khoa học: Solanum procumbens Lour.), hay còn gọi là cà quánh, cà gai dây, là loại cây thảo leo mọc hoang dã nhiều tại các tỉnh miền Trung và vùng đồi núi thấp Việt Nam.

Từ ngàn xưa trong dân gian, cà gai leo đã nổi tiếng với công năng giải rượu tức thì và giải độc gan nhanh chóng. Viện Dược liệu Trung ương và nhiều công trình nghiên cứu khoa học cấp nhà nước đã chứng minh hoạt chất Glycoalkaloid trong cà gai leo có tác dụng ức chế sự sao chép của virus viêm gan B, ngăn ngừa xơ gan và hạ men gan vượt trội.

Sản phẩm được thu hoạch từ vùng nguyên liệu sạch, chọn lọc kỹ lưỡng cả thân lá rễ, rửa sạch, băm nhỏ và sấy khô lạnh theo tiêu chuẩn GMP, giữ trọn 100% hoạt chất và hương thơm thảo mộc tự nhiên.`,
        usage: "Tăng cường chức năng giải độc gan, bảo vệ tế bào gan khỏi tác hại của bia rượu, thuốc tây. Hỗ trợ điều trị viêm gan virus B mãn tính, men gan tăng cao (AST, ALT). Hỗ trợ làm chậm quá trình tiến triển xơ gan. Thanh nhiệt, mát gan, giảm mề đay, mẩn ngứa do nóng trong.",
        dosage: "Cách sắc uống: Dùng 35 - 50g cà gai leo khô rửa sạch, cho vào ấm cùng 1.2 - 1.5 lít nước sạch. Đun sôi rồi hạ nhỏ lửa liu riu trong 10 - 15 phút.\nCách hãm trà: Lấy 30g hãm với 1 lít nước sôi trong bình giữ nhiệt 20 phút.\nLiều dùng: Uống chia làm nhiều lần trong ngày, dùng đều đặn 2-3 tháng.",
        precautions: "• Phụ nữ có thai và cho con bú dưới 6 tháng tuổi không nên dùng.\n• Trẻ nhỏ dưới 6 tuổi cần tham vấn ý kiến thầy thuốc.\n• Người huyết áp quá thấp nên uống sau khi ăn no.",
        origin: "Quảng Nam, Việt Nam",
        unit: "gói",
        stock: 120,
        isBestSeller: true,
        isActive: true,
      },
    }),
    // --- Đinh Lăng ---
    prisma.product.create({
      data: {
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
        description: `Đinh lăng lá nhỏ (Polyscias fruticosa) được mệnh danh là "Nhân sâm của người nghèo" bởi công dụng bồi bổ sinh lực tuyệt vời.

Rễ đinh lăng chứa hơn 20 loại saponin triterpenic, cùng vitamin B1, B2, B6, vitamin C và nhiều loại acid amin thiết yếu.

Sản phẩm được khai thác từ cây đinh lăng lá nhỏ trên 5 năm tuổi tại Hải Hậu (Nam Định), sao vàng hạ thổ theo phương pháp cổ truyền.`,
        usage: "Bồi bổ khí huyết, tăng lực, chống suy nhược cơ thể. Tăng cường tuần hoàn máu não, hỗ trợ điều trị đau đầu, chóng mặt, mất ngủ. Kích thích tiêu hóa, lợi sữa cho phụ nữ sau sinh.",
        dosage: "Sắc nước uống: 25-30g rễ sao vàng sắc với 600ml nước, cạn còn 300ml, chia 2-3 lần/ngày.\nNgâm rượu: 500g đinh lăng ngâm 4-5 lít rượu nếp 40 độ, sau 45 ngày dùng được.",
        precautions: "• Lạm dụng liều quá mức có thể gây say xẩm, tiêu chảy.\n• Phụ nữ 3 tháng đầu thai kỳ không nên uống.\n• Người đang sốt cao nên hoãn dùng.",
        origin: "Hải Hậu, Nam Định, Việt Nam",
        unit: "gói",
        stock: 85,
        isBestSeller: true,
        isActive: true,
      },
    }),
    // --- Trà Dây ---
    prisma.product.create({
      data: {
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
        description: `Trà dây (Ampelopsis cantoniensis Planch.) là loại dây leo hoang dã sinh trưởng ở vùng núi cao 1.000m - 1.500m quanh năm sương mù tại Sapa, Hoàng Liên Sơn.

Điểm đặc trưng là lớp phấn trắng tự nhiên bám trên lá - kết tinh enzym quý giá từ quá trình ủ men cổ truyền.

Hoạt chất Flavonoid và Myricetin có tính kháng viêm cực mạnh, ức chế xoắn khuẩn HP dạ dày, điều hòa dịch vị acid.`,
        usage: "Hỗ trợ điều trị viêm loét dạ dày - tá tràng, trào ngược GERD. Tiêu diệt xoắn khuẩn HP. Giảm ợ chua, ợ hơi, đầy trướng bụng. Thanh nhiệt, mát gan, an thần.",
        dosage: "Hãm trà: 15-20g trà dây hãm 500-600ml nước sôi 95-100°C, đậy nắp 10-15 phút.\nThời điểm vàng: Uống sáng sớm trước ăn 30 phút.",
        precautions: "• Không uống nước trà dây để qua đêm.\n• Người thể hàn nên pha thêm gừng nướng.\n• Không hãm quá 60g/ngày đối với người mới dùng.",
        origin: "Sapa, Lào Cai, Việt Nam",
        unit: "gói",
        stock: 210,
        isBestSeller: true,
        isActive: true,
      },
    }),
    // --- Xáo Tam Phân ---
    prisma.product.create({
      data: {
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
        description: `Xáo tam phân (Paramignya trimera) thuộc họ Cam (Rutaceae), phân bố đặc hữu tại vùng núi Hòn Hèo, Khánh Hòa.

Rễ chứa Courmarin, Triterpenoid, Saponin, Alkaloid và Flavonoid. Nghiên cứu chứng minh khả năng ức chế 5 dòng tế bào ung thư ác tính: gan (Hep-G2), đại tràng (HTC116), vú (MDA MB231), buồng trứng (OVCAR-8) và cổ tử cung (Hela).

Rễ khai thác từ gốc lâu năm bám vào vách đá núi Hòn Hèo, thái lát sao vàng hạ thổ kỹ lưỡng.`,
        usage: "Hỗ trợ phòng ngừa và ức chế tế bào ung thư. Giải độc gan, hạ men gan, hỗ trợ phục hồi xơ gan. Tăng cường miễn dịch, bồi bổ sức khỏe trong phác đồ xạ trị, hóa trị. Tiêu viêm, giảm đau xương khớp.",
        dosage: "Sắc thuốc: 40-50g sao vàng sắc 1.5 lít nước, cô cạn còn 800ml-1 lít. Uống ấm trong ngày.\nNgâm rượu: 1kg rễ ngâm 5 lít rượu nếp 40 độ, 2-3 tháng. Dùng 20-30ml/ngày.",
        precautions: "• Tuyệt đối không dùng cho phụ nữ mang thai.\n• Cách thời điểm truyền hóa chất ít nhất 2 giờ.\n• Người suy thận nặng cần phác đồ từ bác sĩ.",
        origin: "Núi Hòn Hèo, Ninh Hòa, Khánh Hòa, Việt Nam",
        unit: "gói",
        stock: 45,
        isBestSeller: true,
        isActive: true,
      },
    }),
    // --- Giảo Cổ Lam ---
    prisma.product.create({
      data: {
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
        description: `Giảo cổ lam (Gynostemma pentaphyllum) - "Thảo dược trường thọ". Chứa hơn 100 loại saponin (gypenoside), nhiều loại tương tự saponin Nhân sâm.

Thu hái tại vùng núi Hà Giang, loại 5 lá dược tính cao nhất.`,
        usage: "Giảm mỡ máu, cholesterol xấu. Hạ huyết áp, ổn định đường huyết. Chống oxy hóa, làm chậm lão hóa. Tăng miễn dịch, giảm stress. Hỗ trợ giảm cân an toàn.",
        dosage: "Hãm trà: 5-10g hãm 200-300ml nước sôi 85°C, đậy 5-7 phút. 2-3 ấm/ngày.\nSắc uống: 20-30g sắc 1 lít nước, nhỏ lửa 15 phút. Chia uống trong ngày.",
        precautions: "• Người huyết áp thấp nên uống sau ăn no.\n• Tránh uống buổi tối trước khi ngủ vì tăng tỉnh táo.",
        origin: "Hà Giang, Việt Nam",
        unit: "gói",
        stock: 120,
        isBestSeller: false,
        isActive: true,
      },
    }),
    // --- Cao Atiso ---
    prisma.product.create({
      data: {
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
        description: `Atiso (Cynara scolymus) trồng tại Đà Lạt. Chứa Cynarin, Silymarin, Inulin bảo vệ gan, lợi mật, giảm cholesterol.

Chiết xuất từ hoa, lá và thân cây Atiso theo công nghệ hiện đại, giữ nguyên hoạt chất.`,
        usage: "Mát gan, lợi mật, hỗ trợ chức năng gan. Thanh nhiệt, giải độc cơ thể. Giảm cholesterol, hỗ trợ tiêu hóa. Lợi tiểu, tốt cho người bị mụn nhọt.",
        dosage: "Cao Atiso: 1-2 thìa cà phê hòa 200ml nước ấm. 2-3 lần/ngày, trước ăn 30 phút.\nTrà Atiso: 1 túi hãm 200ml nước sôi, đợi 5 phút.",
        precautions: "• Không lạm dụng thay nước lọc vì tính lợi tiểu mạnh.\n• Người tắc ống dẫn mật cần hỏi ý kiến chuyên môn.",
        origin: "Đà Lạt, Lâm Đồng, Việt Nam",
        unit: "hộp",
        stock: 95,
        isBestSeller: false,
        isActive: true,
      },
    }),
    // --- Lá Đắng ---
    prisma.product.create({
      data: {
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
        description: `Lá đắng (Vernonia amygdalina) hay Kim thất tai, phổ biến ở Tây Nguyên. Chứa flavonoid, saponin, tannin.

Có khả năng hỗ trợ hạ đường huyết, điều hòa huyết áp và giảm cholesterol hiệu quả.`,
        usage: "Thanh nhiệt, giải độc cơ thể. Hỗ trợ hạ đường huyết cho người tiểu đường. Điều hòa huyết áp, giảm cholesterol. Hỗ trợ tiêu hóa.",
        dosage: "Nấu canh: 100-150g lá tươi nấu canh.\nSắc uống: 50g tươi (20g khô) sắc 500ml nước, 2 lần/ngày.\nHãm trà: 10-15g lá khô hãm nước sôi.",
        precautions: "• Người huyết áp thấp dùng liều nhỏ.\n• Phụ nữ mang thai tham khảo ý kiến bác sĩ.",
        origin: "Đắk Lắk, Tây Nguyên, Việt Nam",
        unit: "gói",
        stock: 80,
        isBestSeller: false,
        isActive: true,
      },
    }),
  ]);
  console.log(`✅ Đã tạo ${products.length} sản phẩm cây thuốc.`);

  // ============ 3. TẠO ĐƠN HÀNG MẪU ============
  const order1 = await prisma.order.create({
    data: {
      orderCode: "DH-20241015",
      customerName: "Nguyễn Văn An",
      customerPhone: "0912345678",
      customerEmail: "nguyenvanan@gmail.com",
      customerAddress: "123 Nguyễn Huệ, Quận 1, TP.HCM",
      totalAmount: 315000,
      status: "delivered",
      paymentMethod: "bank_transfer",
      paymentStatus: "paid",
      notes: "Giao buổi sáng",
      items: {
        create: [
          { productId: "prod-1", quantity: 2, price: 95000 },
          { productId: "prod-2", quantity: 1, price: 125000 },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      orderCode: "DH-20241016",
      customerName: "Trần Thị Bích",
      customerPhone: "0987654321",
      customerEmail: "tranthebich@gmail.com",
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

  const order3 = await prisma.order.create({
    data: {
      orderCode: "DH-20241017",
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

  const order4 = await prisma.order.create({
    data: {
      orderCode: "DH-20241018",
      customerName: "Phạm Thị Lan",
      customerPhone: "0976543210",
      customerAddress: "12 Bà Triệu, Quận Hoàn Kiếm, Hà Nội",
      totalAmount: 170000,
      status: "shipping",
      paymentMethod: "momo",
      paymentStatus: "paid",
      items: {
        create: [
          { productId: "prod-5", quantity: 1, price: 95000 },
          { productId: "prod-6", quantity: 1, price: 75000 },
        ],
      },
    },
  });

  console.log(`✅ Đã tạo 4 đơn hàng mẫu.`);
  console.log("\n🎉 Hoàn tất đổ dữ liệu vào MySQL thành công!");
  console.log("   Bạn có thể mở MySQL Workbench để kiểm tra database 'thaoduocxanh'.\n");
}

main()
  .catch((e) => {
    console.error("❌ Lỗi khi seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

