import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function initAdmin() {
  const existingAdmin = await prisma.user.findFirst();
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        username: "admin",
        password: "admin",
      },
    });

    console.log("✅ Default admin created: admin / admin");
  }
}
