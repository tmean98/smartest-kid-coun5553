import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { passcode } = (await req.json()) as { passcode: string };
  const correct = process.env.APP_PASSCODE;

  if (!correct) {
    return NextResponse.json(
      { error: "Passcode not configured" },
      { status: 500 }
    );
  }

  if (passcode !== correct) {
    return NextResponse.json({ error: "Wrong passcode" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("sk-auth", "true", {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });

  return response;
}
