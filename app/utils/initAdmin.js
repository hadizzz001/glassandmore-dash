import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function initAdmin() {
  await prisma.user.upsert({
    where: { id: "admin-user-id" }, // fixed id to prevent duplicates
    update: {},
    create: {
      id: "admin-user-id",
      username: "admin",
      password: "admin",
    },
  });

  console.log("✅ Admin ensured (admin/admin)");
}
