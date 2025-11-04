import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function PATCH(request: Request) {
  const { username, password } = await request.json();

  await prisma.user.update({
    where: { id: "admin-user-id" }, // ALWAYS update same user
    data: {
      username,
      password,
    },
  });

  return new Response(JSON.stringify({ message: "✅ Updated Successfully" }), {
    status: 200,
  });
}
