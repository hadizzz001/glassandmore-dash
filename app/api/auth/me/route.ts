import { PrismaClient } from "@prisma/client";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/constants";

const prisma = new PrismaClient();

export async function GET() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const payload = verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    return NextResponse.json({ user: { username: user.username } }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ message: "Token invalid" }, { status: 401 });
  }
}
