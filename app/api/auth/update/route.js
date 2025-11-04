import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/constants";

const prisma = new PrismaClient();

export async function PATCH(request) {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const payload = verify(token, process.env.JWT_SECRET);

  const { username, password } = await request.json();

  const data = {};
  if (username) data.username = username;
  if (password) data.password = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: payload.userId },
    data,
  });

  return NextResponse.json({ message: "Updated successfully" }, { status: 200 });
}
