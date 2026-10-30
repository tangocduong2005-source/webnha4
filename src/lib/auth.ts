export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
  phone?: string | null;
}

export const AUTH_COOKIE_NAME = "caythuoconghan_session";

// Mã hóa thông tin phiên làm việc
export function encodeSession(user: AuthUser): string {
  const payload = {
    ...user,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 ngày
  };
  const json = JSON.stringify(payload);
  if (typeof Buffer !== "undefined") {
    return Buffer.from(json).toString("base64url");
  }
  return btoa(unescape(encodeURIComponent(json)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// Giải mã thông tin phiên làm việc
export function decodeSession(token: string): (AuthUser & { exp: number }) | null {
  try {
    if (!token) return null;
    let json = "";
    if (typeof Buffer !== "undefined") {
      json = Buffer.from(token, "base64url").toString("utf-8");
    } else {
      const base64 = token.replace(/-/g, "+").replace(/_/g, "/");
      json = decodeURIComponent(escape(atob(base64)));
    }
    const data = JSON.parse(json);
    if (!data || !data.email || !data.role) return null;
    if (data.exp && Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}

