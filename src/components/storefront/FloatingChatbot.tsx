"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Leaf,
  Phone,
  Sparkles,
  Bot,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  action?: {
    type: "call" | "link";
    label: string;
    target: string;
  };
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "welcome-1",
    sender: "bot",
    text: "Kính chào quý khách! Tôi là **Dược Sĩ AI - Cây Thuốc Ông Han** 🌿.\n\nTôi có thể giúp quý khách tìm hiểu nguyên nhân bệnh, tư vấn bài thuốc Đông y và hướng dẫn cách sử dụng cây thuốc nam hiệu quả. Quý khách đang quan tâm đến vấn đề sức khỏe nào?",
    timestamp: "Vừa xong",
  },
];

const SUGGESTED_CHIPS = [
  { label: "Bài thuốc mất ngủ", query: "Bài thuốc mất ngủ" },
  { label: "Trà giải độc gan", query: "Trà giải độc gan" },
  { label: "Thảo dược trị đau khớp", query: "Thảo dược trị đau khớp" },
  { label: "Liên hệ hotline", query: "Liên hệ hotline tư vấn" },
];

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [unreadCount, setUnreadCount] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0);
      setShowTooltip(false);
    }
  }, [isOpen, messages, isTyping]);

  // Sinh câu trả lời thông minh theo phong cách Dược sĩ Đông Y
  const generateBotReply = (userQuery: string): { text: string; action?: Message["action"] } => {
    const q = userQuery.toLowerCase();

    // 1. Mất ngủ
    if (q.includes("mất ngủ") || q.includes("khó ngủ") || q.includes("ngủ kém") || q.includes("thao thức")) {
      return {
        text: "Chào bạn! Trong Đông y, chứng mất ngủ (*thất miên*) thường do **Tâm tỳ lưỡng hư** hoặc **Can hỏa nhiễu tâm**, khiến thần trí không yên.\n\n🌿 **Bài thuốc Đông y khuyên dùng:**\n• **Cao Lạc Tiên & Lá Vông Nem**: Giúp định tâm, an thần, hỗ trợ đi vào giấc ngủ tự nhiên sâu giấc.\n• **Trà Tâm Sen & Táo Nhân sao vàng**: Thanh nhiệt tâm hỏa, giảm căng thẳng lo âu.\n\n☕ **Cách dùng:** Uống 1 tách trà thảo mộc ấm trước khi ngủ 30-45 phút.\n\n📞 *Nếu mất ngủ kinh niên lâu năm, bạn nên bốc thuốc theo thể trạng riêng. Gọi ngay Hotline **0964001203** để Dược sĩ Cây Thuốc Ông Han tư vấn trực tiếp!*",
        action: {
          type: "call",
          label: "Gọi tư vấn mất ngủ: 0964001203",
          target: "tel:0964001203",
        },
      };
    }

    // 2. Giải độc gan
    if (q.includes("gan") || q.includes("giải độc") || q.includes("men gan") || q.includes("nóng trong") || q.includes("mụn") || q.includes("rượu")) {
      return {
        text: "Chào bạn! Tạng Can (gan) chủ sơ tiết và bài độc. Khi gan tích nhiệt do bia rượu, thức khuya hoặc ăn đồ cay nóng sẽ gây men gan tăng, nóng trong, nổi mẩn ngứa và mệt mỏi.\n\n🌿 **Dược liệu đặc trị giải độc gan:**\n• **Cà Gai Leo Quảng Nam**: 'Khắc tinh' của men gan cao và viêm gan, bảo vệ màng tế bào gan tối ưu.\n• **Diệp Hạ Châu (Chó đẻ)** & **Actiso**: Tiêu độc tán ứ, mát gan, hạ men gan và lợi mật.\n• **Trà Giảo Cổ Lam**: Hỗ trợ đào thải mỡ gan, thanh lọc cơ thể.\n\n☕ **Cách dùng:** Sắc hoặc hãm 30-40g thảo dược khô với 1.5L nước nóng uống thay nước lọc trong ngày.",
        action: {
          type: "call",
          label: "Tư vấn bài thuốc gan: 0964001203",
          target: "tel:0964001203",
        },
      };
    }

    // 3. Đau khớp, xương khớp
    if (q.includes("khớp") || q.includes("xương") || q.includes("lưng") || q.includes("thoái hóa") || q.includes("tê bì") || q.includes("gout") || q.includes("mỏi")) {
      return {
        text: "Chào bạn! Đau nhức xương khớp trong Đông y gọi là chứng **'Phong Hàn Thấp Tý'**. Gió lạnh và ẩm thấp ứ trệ kinh lạc làm khí huyết không thông sinh đau nhức.\n\n🌿 **Bài thuốc cây thảo dược hỗ trợ:**\n• **Dây Đau Xương & Cốt Toái Bổ**: Khu phong trừ thấp, mạnh gân hoạt cốt, giảm đau lưng mỏi gối.\n• **Cây Ngũ Gia Bì & Hy Thiêm**: Tăng tuần hoàn máu đến khớp, tiêu viêm sưng tự nhiên.\n• **Ngâm chân nước lá lốt, gừng và muối ấm**: Thực hiện 15 phút mỗi tối trước khi ngủ.\n\n📍 *Đối với ca thoái hóa cột sống hoặc thoát vị nặng, mời bạn ghé nhà thuốc tại **Thôn Lễ Thần, xã Thái Ninh, tỉnh Hưng Yên** để bốc thuốc thang điều trị dứt điểm!*",
        action: {
          type: "call",
          label: "Hotline xương khớp: 0964001203",
          target: "tel:0964001203",
        },
      };
    }

    // 4. Dạ dày, trào ngược
    if (q.includes("dạ dày") || q.includes("bao tử") || q.includes("trào ngược") || q.includes("ợ chua") || q.includes("viêm loét")) {
      return {
        text: "Chào bạn! Bệnh dạ dày thường do 'Can khí phạm Vị' hoặc 'Tỳ vị hư hàn' do căng thẳng, áp lực và ăn uống không điều độ.\n\n🌿 **Bài thuốc thảo dược quý:**\n• **Lá Khôi Nhung**: Thảo dược đầu bảng giúp trung hòa acid dịch vị, cắt cơn đau cồn cào và ợ chua.\n• **Chè Dây Rừng**: Ức chế vi khuẩn HP, làm lành và se vết loét niêm mạc dạ dày.\n• **Nghệ Vàng & Mật Ong Rừng**: Tái tạo màng nhầy, kháng khuẩn.\n\n☕ **Cách dùng:** Uống nước lá khôi hoặc trà chè dây ấm trước bữa ăn 30 phút.",
        action: {
          type: "call",
          label: "Hotline dạ dày: 0964001203",
          target: "tel:0964001203",
        },
      };
    }

    // 5. Hotline & Địa chỉ
    if (q.includes("hotline") || q.includes("liên hệ") || q.includes("sđt") || q.includes("địa chỉ") || q.includes("ở đâu") || q.includes("mua ở") || q.includes("bác sĩ")) {
      return {
        text: "Dạ, thông tin liên hệ chính thức của nhà thuốc **Cây Thuốc Ông Han**:\n\n📞 **Hotline / Zalo tư vấn:** 0964001203 (Trực 24/7)\n📧 **Email:** tangocduong2005@gmail.com\n📍 **Địa chỉ nhà thuốc:** Thôn Lễ Thần, xã Thái Ninh, tỉnh Hưng Yên\n\n👨‍⚕️ *Quý khách có thể đến bắt mạch bốc thuốc trực tiếp hoặc gọi điện để được gửi thuốc thang thảo dược tận nhà, kiểm tra hàng rồi mới thanh toán!*",
        action: {
          type: "call",
          label: "Gọi ngay Dược Sĩ: 0964001203",
          target: "tel:0964001203",
        },
      };
    }

    // Default Fallback
    return {
      text: `Dạ, cảm ơn câu hỏi của bạn về "${userQuery}".\n\nTheo nguyên lý Đông y, mỗi thể trạng người bệnh (hàn, nhiệt, hư, thực) sẽ cần gia giảm các vị thuốc quân-thần-tá-sứ sao cho tương thích nhất.\n\n🌿 Nhà thuốc **Cây Thuốc Ông Han** luôn sẵn sàng tư vấn chi tiết cho bạn qua số **0964001203** hoặc bạn có thể chọn các câu hỏi gợi ý bên dưới để tìm bài thuốc chuẩn nhé!`,
      action: {
        type: "call",
        label: "Gọi tư vấn trực tiếp: 0964001203",
        target: "tel:0964001203",
      },
    };
  };

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isTyping) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Giả lập độ trễ phản hồi của AI (800ms)
    setTimeout(() => {
      const reply = generateBotReply(text);
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: reply.text,
        timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        action: reply.action,
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 850);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const resetChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <>
      {/* Cửa sổ Chat AI Floating Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Cửa sổ tư vấn Dược Sĩ AI"
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 h-[520px] max-h-[82vh] rounded-2xl shadow-2xl border border-slate-200 bg-white flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header Cửa sổ Chat */}
          <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white px-4 py-3 flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-emerald-100/20 border border-white/30 flex items-center justify-center text-white shrink-0">
                  <Leaf className="h-5 w-5 text-emerald-300" />
                </div>
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 border-2 border-emerald-900 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                  <span>Dược Sĩ AI</span>
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-normal">
                    Đông Y
                  </span>
                </h3>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 inline-block" />
                  Cây Thuốc Ông Han • Đang trực tuyến
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={resetChat}
                title="Làm mới cuộc trò chuyện"
                className="h-8 w-8 rounded-lg flex items-center justify-center text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Thu nhỏ cửa sổ"
                className="h-8 w-8 rounded-lg flex items-center justify-center text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
              >
                <ChevronDown className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Vùng Tin Nhắn Cuộn */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/60 text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 shadow-2xs whitespace-pre-line leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-emerald-600 text-white rounded-tr-xs"
                      : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs"
                  }`}
                >
                  {/* Format nội dung in đậm nếu có */}
                  {msg.text.split("\n").map((line, idx) => (
                    <p key={idx} className={idx > 0 ? "mt-1.5" : ""}>
                      {line}
                    </p>
                  ))}

                  {/* Nút thao tác nhanh đính kèm (nếu có) */}
                  {msg.action && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100">
                      <a
                        href={msg.action.target}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold border border-emerald-200 transition-colors"
                      >
                        <Phone className="h-3.5 w-3.5 text-emerald-600" />
                        <span>{msg.action.label}</span>
                      </a>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {/* Hiệu ứng Đang gõ... */}
            {isTyping && (
              <div className="flex items-start gap-2">
                <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-xs px-4 py-3 shadow-2xs flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-600 animate-bounce" />
                  <span className="h-2 w-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="h-2 w-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-xs text-slate-400 ml-1.5 font-medium">
                    Dược sĩ đang phân tích bài thuốc...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Thanh Gợi Ý Câu Hỏi Nhanh (Suggested Chips) */}
          <div className="bg-white px-3 py-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
            {SUGGESTED_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(chip.query)}
                className="whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100 hover:border-emerald-300 transition-all shrink-0 active:scale-95"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Ô Nhập Liệu & Gửi Tin Nhắn */}
          <div className="p-3 bg-white border-t border-slate-200 shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Hỏi về bệnh, vị thuốc nam..."
                className="flex-1 h-10 px-3.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-400 transition-all"
              />
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                title="Gửi tin nhắn"
                className="h-10 w-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs active:scale-95"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-1.5">
              Cây Thuốc Ông Han • Hotline: 0964001203 • Thôn Lễ Thần, Hưng Yên
            </p>
          </div>
        </div>
      )}

      {/* Floating Trigger Button (Góc dưới bên phải) */}
      <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3">
        {/* Tooltip Chào Mừng Thu Hút Chú Ý */}
        {!isOpen && showTooltip && (
          <div className="hidden sm:flex items-center gap-2 bg-white text-slate-800 px-3.5 py-2 rounded-2xl shadow-xl border border-emerald-100 text-xs font-medium animate-in fade-in slide-in-from-right-4 duration-300 relative">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>
              <strong>Dược Sĩ AI</strong> tư vấn bài thuốc miễn phí 👋
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="text-slate-400 hover:text-slate-600 ml-1"
              title="Đóng thông báo"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-r border-b border-emerald-100 rotate-[-45deg]" />
          </div>
        )}

        {/* Nút Tròn Nổi Bật */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Đóng chat" : "Mở chat tư vấn Dược Sĩ AI"}
          className={`relative h-14 w-14 rounded-full shadow-2xl flex items-center justify-center text-white transition-all transform hover:scale-105 active:scale-95 duration-200 ${
            isOpen
              ? "bg-slate-800 hover:bg-slate-900 rotate-90"
              : "bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-600/30"
          }`}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <>
              <MessageSquare className="h-6 w-6" />
              {/* Badge Thông Báo Xanh / Đỏ */}
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 text-[10px] text-white font-bold items-center justify-center">
                    {unreadCount}
                  </span>
                </span>
              )}
            </>
          )}
        </button>
      </div>
    </>
  );
}

