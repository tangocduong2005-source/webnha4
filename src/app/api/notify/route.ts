import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { orderNumber, customer, items, total, paymentMethod, note } = data;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // Định dạng tin nhắn gửi về Telegram
    const itemsText = items
      .map(
        (item: { productName: string; quantity: number; price: number }) =>
          `• ${item.productName} x${item.quantity}: ${(
            item.price * item.quantity
          ).toLocaleString("vi-VN")}₫`
      )
      .join("\n");

    const paymentText =
      paymentMethod === "bank_transfer"
        ? "Chuyển khoản VietQR"
        : paymentMethod === "momo"
        ? "Ví MoMo"
        : "Thanh toán khi nhận hàng (COD)";

    const message = `🌿 *ĐƠN HÀNG MỚI TỪ THẢO DƯỢC XANH* 🌿
━━━━━━━━━━━━━━━━━━
🆔 *Mã đơn:* \`${orderNumber}\`
👤 *Khách hàng:* ${customer.fullName}
📞 *Số điện thoại:* ${customer.phone}
📍 *Địa chỉ:* ${customer.address}, ${customer.ward}, ${customer.district}, ${customer.city}
${note ? `📝 *Ghi chú:* ${note}\n` : ""}
📦 *Danh sách cây thuốc:*
${itemsText}

💰 *Tổng thanh toán:* *${Number(total).toLocaleString("vi-VN")}₫*
💳 *Hình thức:* ${paymentText}
⏰ *Thời gian:* ${new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}`;

    let telegramSent = false;

    if (botToken && chatId) {
      try {
        const teleRes = await fetch(
          `https://api.telegram.org/bot${botToken}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: message,
              parse_mode: "Markdown",
            }),
          }
        );
        telegramSent = teleRes.ok;
      } catch (err) {
        console.error("Telegram notification error:", err);
      }
    }

    return NextResponse.json({
      success: true,
      telegramSent,
      hasCredentials: Boolean(botToken && chatId),
      messageText: message,
    });
  } catch (error) {
    console.error("Error in notify API:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
