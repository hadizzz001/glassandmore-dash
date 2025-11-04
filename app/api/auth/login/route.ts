import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { serialize } from "cookie";
import { sign } from "jsonwebtoken";
import { NextResponse } from "next/server";
import { COOKIE_NAME } from "../../../constants";

const prisma = new PrismaClient();
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function POST(request) {
  const { username, password } = await request.json();

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const passwordValid = await bcrypt.compare(password, user.password);
  if (!passwordValid) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const token = sign(
    {
      userId: user.id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: MAX_AGE }
  );

  const serialized = serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: MAX_AGE,
    path: "/",
  });

  return new Response(JSON.stringify({ message: "Success" }), {
    status: 200,
    headers: { "Set-Cookie": serialized },
  });
}
