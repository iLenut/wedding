import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.guest.deleteMany();
  await prisma.table.deleteMany();

  const table1 = await prisma.table.create({
    data: {
      name: "Masa 1",
      capacity: 10,
      posX: 120,
      posY: 120,
    },
  });

  const table2 = await prisma.table.create({
    data: {
      name: "Masa 2",
      capacity: 10,
      posX: 420,
      posY: 120,
    },
  });

  await prisma.guest.createMany({
    data: [
      {
        name: "Ana Popescu",
        groupName: "Familia miresei",
        confirmed: true,
        advancePaid: true,
        menuType: "normal",
        tableId: table1.id,
      },
      {
        name: "Ion Ionescu",
        groupName: "Prieteni",
        confirmed: true,
        advancePaid: false,
        menuType: "normal",
        tableId: table1.id,
      },
      {
        name: "Maria Vlad",
        groupName: "Familia mirelui",
        confirmed: false,
        advancePaid: false,
        menuType: "vegetarian",
        tableId: null,
      },
      {
        name: "Andrei Moldovan",
        groupName: "Colegi",
        confirmed: true,
        advancePaid: true,
        menuType: "normal",
        tableId: table2.id,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
