import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔐 Đang tạo tài khoản mẫu trong MySQL...");

  const admin = await prisma.user.upsert({
    where: { email: "admin@caythuoconghan.vn" },
    update: {
      role: "ADMIN",
      password: "Admin@123456",
      name: "Dược Sĩ Quản Trị - Cây Thuốc Ông Han",
    },
    create: {
      email: "admin@caythuoconghan.vn",
      name: "Dược Sĩ Quản Trị - Cây Thuốc Ông Han",
      password: "Admin@123456",
      phone: "0964001203",
      role: "ADMIN",
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "khachhang@caythuoconghan.vn" },
    update: {
      role: "USER",
      password: "User@123456",
      name: "Khách Hàng Thân Thiết",
    },
    create: {
      email: "khachhang@caythuoconghan.vn",
      name: "Khách Hàng Thân Thiết",
      password: "User@123456",
      phone: "0912345678",
      role: "USER",
    },
  });

  console.log("✅ Đã tạo tài khoản ADMIN:", admin.email, "role:", admin.role);
  console.log("✅ Đã tạo tài khoản USER:", user.email, "role:", user.role);
}

main()
  .catch((e) => {
    console.error("Lỗi:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

