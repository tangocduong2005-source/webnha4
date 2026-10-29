import { Product } from "@/types";

/**
 * File dữ liệu mẫu chi tiết cho 4 loại cây lá thuốc Nam quý chuẩn Đông Y:
 * 1. Cà gai leo (Solanum procumbens) - Thảo dược vàng bảo vệ và giải độc gan
 * 2. Đinh lăng (Polyscias fruticosa) - "Nam dương sâm", bồi bổ khí huyết, an thần
 * 3. Trà dây (Ampelopsis cantoniensis) - Khắc tinh của viêm loét dạ dày, diệt khuẩn HP
 * 4. Xáo tam phân (Paramignya trimera) - "Thần dược" Hòn Hèo, ức chế khối u, tiêu độc
 */

export const medicinalHerbs: Product[] = [
  {
    id: "prod-1",
    name: "Cà Gai Leo Sấy Khô Chuẩn GMP",
    slug: "ca-gai-leo",
    categoryId: "cat-2", // Dược liệu khô
    price: 95000,
    originalPrice: 135000,
    images: [
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80",
    ],
    shortDescription:
      "Cà gai leo tự nhiên vùng Quảng Nam, chứa hàm lượng Glycoalkaloid cao giúp giải độc gan, hạ men gan và hỗ trợ điều trị viêm gan B.",
    description: `Cà gai leo (tên khoa học: Solanum procumbens Lour.), hay còn gọi là cà quánh, cà gai dây, là loại cây thảo leo mọc hoang dã nhiều tại các tỉnh miền Trung và vùng đồi núi thấp Việt Nam.

Từ ngàn xưa trong dân gian, cà gai leo đã nổi tiếng với công năng giải rượu tức thì và giải độc gan nhanh chóng. Viện Dược liệu Trung ương và nhiều công trình nghiên cứu khoa học cấp nhà nước đã chứng minh hoạt chất Glycoalkaloid trong cà gai leo có tác dụng ức chế sự sao chép của virus viêm gan B, ngăn ngừa xơ gan và hạ men gan vượt trội.

Sản phẩm được thu hoạch từ vùng nguyên liệu sạch, chọn lọc kỹ lưỡng cả thân lá rễ, rửa sạch, băm nhỏ và sấy khô lạnh theo tiêu chuẩn GMP, giữ trọn 100% hoạt chất và hương thơm thảo mộc tự nhiên.`,
    usage:
      "Tăng cường chức năng giải độc gan, bảo vệ tế bào gan khỏi tác hại của bia rượu, thuốc tây. Hỗ trợ điều trị viêm gan virus B mãn tính, men gan tăng cao (AST, ALT). Hỗ trợ làm chậm quá trình tiến triển xơ gan. Thanh nhiệt, mát gan, giảm mề đay, mẩn ngứa do nóng trong.",
    dosage:
      "Cách sắc uống: Dùng 35 - 50g cà gai leo khô rửa sạch, cho vào ấm cùng 1.2 - 1.5 lít nước sạch. Đun sôi rồi hạ nhỏ lửa liu riu trong 10 - 15 phút cho hoạt chất hòa tan đều.\nCách hãm trà: Lấy 30g hãm với 1 lít nước sôi trong bình giữ nhiệt 20 phút là dùng được.\nLiều dùng: Uống chia làm nhiều lần trong ngày, nên uống trước bữa ăn 30 phút hoặc sau ăn 1 giờ. Dùng đều đặn 2-3 tháng để thấy kết quả rõ rệt.",
    precautions:
      "• Phụ nữ có thai và phụ nữ đang cho con bú dưới 6 tháng tuổi không nên tự ý dùng.\n• Trẻ nhỏ dưới 6 tuổi gan chưa phát triển hoàn thiện cần tham vấn ý kiến thầy thuốc.\n• Người có cơ địa huyết áp quá thấp nên uống sau khi ăn no và cho thêm 2-3 lát gừng tươi ấm.\n• Không uống thuốc sắc để qua đêm ở nhiệt độ phòng vì dễ bị ôi thiu.",
    origin: "Quảng Nam, Việt Nam",
    ingredients: "100% thân, cành và rễ cà gai leo nguyên chất sấy khô",
    weight: "500g",
    stock: 120,
    rating: 4.9,
    reviewCount: 184,
    tags: [
      "giải độc gan",
      "hạ men gan",
      "viêm gan B",
      "bảo vệ gan",
      "mát gan",
      "giải rượu",
    ],
    isFeatured: true,
    isBestSeller: true,
    isNew: false,
    createdAt: "2024-03-01",
  },
  {
    id: "prod-2",
    name: "Rễ & Thân Cây Đinh Lăng Lá Nhỏ Sao Vàng",
    slug: "dinh-lang",
    categoryId: "cat-1", // Cây thuốc tươi / Dược liệu khô
    price: 125000,
    originalPrice: 160000,
    images: [
      "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1000&q=80",
    ],
    shortDescription:
      "Nam dương sâm quý của người Việt - Bổ khí huyết, tăng cường tuần hoàn máu não, giảm suy nhược thần kinh và bồi bổ thể lực.",
    description: `Đinh lăng lá nhỏ (tên khoa học: Polyscias fruticosa (L.) Harms) được Hải Thượng Lãn Ông Lê Hữu Trác mệnh danh là "Nhân sâm của người nghèo" bởi công dụng bồi bổ sinh lực tuyệt vời không thua kém sâm quý.

Các phân tích dược tính hiện đại chỉ ra trong rễ đinh lăng chứa hơn 20 loại saponin triterpenic (tương tự như saponin trong nhân sâm Triều Tiên), cùng vitamin B1, B2, B6, vitamin C và nhiều loại acid amin thiết yếu như lysine, cysteine, methionine.

Sản phẩm được khai thác từ cây đinh lăng lá nhỏ trên 5 năm tuổi tại vùng đất Hải Hậu (Nam Định), rễ củ rửa sạch đất cát, thái lát tròn và sao vàng hạ thổ theo đúng phương pháp cổ truyền, mang lại hương vị thơm nồng dễ chịu.`,
    usage:
      "Bồi bổ khí huyết, tăng lực, chống suy nhược cơ thể và mệt mỏi kéo dài. Tăng cường tuần hoàn máu não, hỗ trợ điều trị đau đầu, chóng mặt, tiền đình, mất ngủ kinh niên. Kích thích tiêu hóa, giúp ăn ngon ngủ sâu. Lợi sữa, thông tia sữa cho phụ nữ sau sinh. Tăng cường sức đề kháng và độ dẻo dai cơ bắp.",
    dosage:
      "Sắc nước uống: Dùng 25 - 30g rễ hoặc thân đinh lăng sao vàng, cho vào nồi với 600ml nước, sắc cạn còn 300ml, chia làm 2 - 3 lần uống trong ngày sau khi ăn.\nNgâm rượu bổ: 500g đinh lăng khô sao vàng ngâm cùng 4 - 5 lít rượu nếp ngon 40 độ trong bình thủy tinh. Sau 45 ngày là có thể dùng, mỗi bữa cơm uống 1 chén hạt mít (15-20ml).",
    precautions:
      "• Trong rễ đinh lăng có hàm lượng saponin cao, nếu lạm dụng liều lượng quá mức có thể gây say xẩm, mệt mỏi, tiêu chảy.\n• Phụ nữ đang trong 3 tháng đầu thai kỳ không nên uống.\n• Người đang sốt cao hoặc viêm nhiễm cấp tính nên hoãn dùng cho đến khi hết sốt.",
    origin: "Hải Hậu, Nam Định, Việt Nam",
    ingredients: "100% rễ và gốc thân đinh lăng nếp lá nhỏ sao vàng hạ thổ",
    weight: "500g",
    stock: 85,
    rating: 4.8,
    reviewCount: 142,
    tags: [
      "bổ khí huyết",
      "tăng thể lực",
      "trị mất ngủ",
      "tuần hoàn não",
      "lợi sữa",
      "bồi bổ",
    ],
    isFeatured: true,
    isBestSeller: true,
    isNew: false,
    createdAt: "2024-03-05",
  },
  {
    id: "prod-3",
    name: "Trà Dây Rừng Phấn Tuyết Sapa",
    slug: "tra-day",
    categoryId: "cat-3", // Trà thảo mộc
    price: 79000,
    originalPrice: 110000,
    images: [
      "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1000&q=80",
    ],
    shortDescription:
      "Thảo dược tự nhiên vùng núi cao Sapa, kháng khuẩn HP, trung hòa acid dịch vị, cắt cơn đau dạ dày và làm lành niêm mạc loét.",
    description: `Trà dây (tên khoa học: Ampelopsis cantoniensis Planch.), hay còn gọi là chè dây, thau rả, bạch liễm rừng, là một loại dây leo hoang dã sinh trưởng ở các vách đá vùng núi cao từ 1.000m - 1.500m quanh năm sương mù mờ ảo như Sapa, Hoàng Liên Sơn.

Điểm đặc trưng của trà dây chất lượng thượng hạng là lớp phấn trắng mốc tự nhiên bám đều trên cánh lá. Đây không phải mốc hỏng mà là kết tinh enzym quý giá sinh ra trong quá trình ủ men lá tươi cổ truyền của đồng bào vùng cao.

Thành phần hoạt chất nổi bật gồm hàm lượng Flavonoid và Myricetin rất cao, có tính kháng viêm cực mạnh, ức chế và triệt tiêu xoắn khuẩn Helicobacter pylori (HP) dạ dày, điều hòa dịch vị acid và thúc đẩy sẹo loét nhanh liền.`,
    usage:
      "Hỗ trợ điều trị viêm loét dạ dày - tá tràng, trào ngược dạ dày thực quản (GERD). Tiêu diệt và đào thải xoắn khuẩn HP (Helicobacter pylori). Giảm nhanh triệu chứng nóng rát thượng vị, ợ chua, ợ hơi, đầy trướng bụng khó tiêu. Thanh nhiệt, giải độc cơ thể, mát gan, an thần giúp ngủ sâu giấc.",
    dosage:
      "Cách hãm trà: Lấy khoảng 15 - 20g trà dây khô cho vào ấm trà hoặc bình giữ nhiệt. Tráng nhanh qua một lượt nước sôi rồi gạn bỏ. Rót 500ml - 600ml nước sôi 95-100°C vào, đậy nắp kín trong 10-15 phút là thưởng thức được.\nThời điểm vàng: Uống vào buổi sáng sớm trước khi ăn sáng 30 phút là thời điểm vi khuẩn HP bám trơ trên niêm mạc dễ bị tiêu diệt nhất. Có thể uống thay trà uống hàng ngày, nước trà có vị ngọt thanh hậu dịu mát.",
    precautions:
      "• Không uống nước trà dây đã để qua đêm vì dễ biến chất gây đau bụng lạnh.\n• Người có thể hàn, thường xuyên đi ngoài phân lỏng nên pha thêm vài lát gừng nướng.\n• Không nên hãm quá đặc vượt quá 60g/ngày đối với người mới bắt đầu dùng.",
    origin: "Sapa, Lào Cai, Việt Nam",
    ingredients: "100% búp và lá chè dây tuyết rừng tự nhiên sấy khô",
    weight: "500g",
    stock: 210,
    rating: 4.9,
    reviewCount: 226,
    tags: [
      "đau dạ dày",
      "viêm loét",
      "kháng HP",
      "trào ngược",
      "thanh nhiệt",
      "an thần",
    ],
    isFeatured: true,
    isBestSeller: true,
    isNew: false,
    createdAt: "2024-03-10",
  },
  {
    id: "prod-xao-tam-phan",
    name: "Rễ Xáo Tam Phân Hòn Hèo Khánh Hòa",
    slug: "xao-tam-phan",
    categoryId: "cat-4", // Thuốc nam gia truyền / Dược liệu khô
    price: 390000,
    originalPrice: 480000,
    images: [
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=1000&q=80",
    ],
    shortDescription:
      "Dược liệu thần dược vùng núi Hòn Hèo - Giàu hoạt chất Courmarin & Triterpenoid ức chế tế bào ác tính, giải độc gan mạnh mẽ.",
    description: `Xáo tam phân (tên khoa học: Paramignya trimera (Oliv.) Guillaum), thuộc họ Cam (Rutaceae), là loài cây thân gỗ leo có gai dài, phân bố đặc hữu tại vùng núi rừng Hòn Hèo (xã Ninh Vân, thị xã Ninh Hòa, tỉnh Khánh Hòa). Cây còn được người dân địa phương trân trọng gọi là "Cây thần dược".

Theo kết quả nghiên cứu công bố của Viện Dược liệu (Bộ Y tế), rễ xáo tam phân chứa hàm lượng đậm đặc các nhóm hoạt chất quý gồm: Courmarin, Triterpenoid, Saponin, Alkaloid và Flavonoid. Nghiên cứu thực nghiệm chứng minh chiết xuất rễ xáo tam phân có khả năng ức chế mạnh 5 dòng tế bào ung thư ác tính: ung thư gan (Hep-G2), ung thư đại tràng (HTC116), ung thư vú (MDA MB231), ung thư buồng trứng (OVCAR-8) và ung thư cổ tử cung (Hela), đồng thời có độc tính cấp rất thấp, an toàn cho người dùng.

Sản phẩm được khai thác từ những gốc rễ xáo tam phân lâu năm bám sâu vào vách đá núi Hòn Hèo, rễ có mùi thơm tinh dầu thảo mộc đặc trưng, vị hơi đắng chát sau ngọt nhẹ. Rễ đã được rửa sạch bùn đất, thái lát mỏng đều tay và sao vàng hạ thổ kỹ lưỡng.`,
    usage:
      "Hỗ trợ phòng ngừa và ức chế sự sinh sôi, di căn của các khối u, tế bào ung thư. Giải độc gan cấp và mãn tính, hạ men gan đột biến, hỗ trợ phục hồi xơ gan, gan nhiễm mỡ. Tăng cường hệ thống miễn dịch tự nhiên, bồi bổ sức khỏe cho người suy kiệt hoặc đang trong phác đồ xạ trị, hóa trị. Tiêu viêm, kháng khuẩn, giảm đau nhức xương khớp và chống viêm sưng nội tạng.",
    dosage:
      "Cách sắc thuốc uống hằng ngày:\n- Nước đầu: Lấy 40 - 50g rễ xáo tam phân đã sao vàng hạ thổ, rửa sơ qua rồi cho vào ấm đất/nồi sắc cùng 1.5 lít nước sạch. Đun sôi kỹ đến khi nước cô cạn lại còn khoảng 800ml - 1 lít. Rót ra bình giữ nhiệt để uống ấm trong ngày.\n- Nước hai: Giữ lại bã thuốc, tiếp tục thêm 1 lít nước sạch và sắc lại cô cạn còn 500ml để uống tiếp.\nCách ngâm rượu: 1kg rễ xáo tam phân khô sao vàng ngâm cùng 5 lít rượu nếp 40 độ trong bình thủy tinh từ 2-3 tháng. Mỗi ngày dùng 1-2 chén nhỏ (20-30ml) trước bữa ăn.",
    precautions:
      "• Tuyệt đối không dùng cho phụ nữ mang thai hoặc đang có dự định mang thai.\n• Bệnh nhân đang truyền hóa chất hoặc xạ trị nên uống cách thời điểm truyền thuốc ít nhất 2 giờ.\n• Người có tiền sử suy thận nặng cần có phác đồ chỉ định từ bác sĩ y học cổ truyền.",
    origin: "Núi Hòn Hèo, Ninh Hòa, Khánh Hòa, Việt Nam",
    ingredients: "100% rễ xáo tam phân tự nhiên vùng Hòn Hèo thái lát sao vàng",
    weight: "250g",
    stock: 45,
    rating: 5.0,
    reviewCount: 98,
    tags: [
      "ức chế u bướu",
      "giải độc gan",
      "xơ gan",
      "thần dược",
      "tăng miễn dịch",
      "kháng viêm",
    ],
    isFeatured: true,
    isBestSeller: true,
    isNew: true,
    createdAt: "2024-03-12",
  },
];
