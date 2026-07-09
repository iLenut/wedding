import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.guest.deleteMany();

  console.log("Invitații au fost șterși.");
  console.log(`Total șterși: ${result.count}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
