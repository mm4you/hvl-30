import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

// Allowed admin credentials
const VALID_PASSWORDS = new Set([
  "082206009329@",
  "hvl30",
  "2026",
  "mck",
]);

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { password?: string };
    const password = body.password?.trim();

    if (!password) {
      return NextResponse.json({ success: false, message: "Thiếu mật khẩu" }, { status: 400 });
    }

    if (VALID_PASSWORDS.has(password) || VALID_PASSWORDS.has(password.toLowerCase())) {
      // Return a signed or timestamped auth token
      const token = btoa(`hvl_admin_${Date.now()}_${Math.random()}`);
      return NextResponse.json({ success: true, token });
    }

    return NextResponse.json({ success: false, message: "Mật khẩu không chính xác" }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, message: "Lỗi xử lý xác thực" }, { status: 500 });
  }
}
