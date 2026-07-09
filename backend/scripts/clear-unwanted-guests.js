import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.guest.deleteMany({
    where: {
      name: {
        contains: "Guest",
      },
    },
  });

  console.log(`Au fost șterși ${result.count} invitați cu "Guest" în nume.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
