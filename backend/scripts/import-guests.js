import XLSX from "xlsx";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const filePath = process.argv[2] || "imports/invitati.xlsx";

function normalize(value) {
  if (value === undefined || value === null) return "";
  return String(value).trim();
}

function isRealPlusOne(value) {
  const text = normalize(value).toLowerCase();
  return text && text !== "-" && text !== "—";
}

async function createGuest({ name, tag, notes }) {
  await prisma.guest.create({
    data: {
      name,
      groupName: tag || null,
      confirmed: false,
      advancePaid: false,
      menuType: "normal",
      notes: notes || null,
      tableId: null,
    },
  });
}

async function main() {
  await prisma.guest.deleteMany();

  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const range = XLSX.utils.decode_range(sheet["!ref"]);

  let imported = 0;
  let skipped = 0;

  for (let rowIndex = range.s.r; rowIndex <= range.e.r; rowIndex++) {
    const prenume = normalize(
      sheet[XLSX.utils.encode_cell({ r: rowIndex, c: 1 })]?.v,
    ); // B
    const nume = normalize(
      sheet[XLSX.utils.encode_cell({ r: rowIndex, c: 2 })]?.v,
    ); // C
    const plusOne = normalize(
      sheet[XLSX.utils.encode_cell({ r: rowIndex, c: 3 })]?.v,
    ); // D
    const invitedBy = normalize(
      sheet[XLSX.utils.encode_cell({ r: rowIndex, c: 5 })]?.v,
    ); // F
    const participantiRaw = normalize(
      sheet[XLSX.utils.encode_cell({ r: rowIndex, c: 7 })]?.v,
    ); // H

    if (!prenume && !nume) {
      skipped++;
      continue;
    }

    if (prenume.toLowerCase() === "prenume" || nume.toLowerCase() === "nume") {
      skipped++;
      continue;
    }

    const participanti = Number(participantiRaw) || 0;
    const tag = invitedBy || null;

    const tata = prenume;
    const mama = isRealPlusOne(plusOne) ? plusOne : "";

    await createGuest({
      name: `${prenume} ${nume}`.trim(),
      tag,
      notes: `Familie: ${nume}`,
    });

    imported++;

    if (isRealPlusOne(plusOne)) {
      await createGuest({
        name: `${plusOne} ${nume}`.trim(),
        tag,
        notes: `Familie: ${nume}`,
      });

      imported++;
    }

    const adulti = isRealPlusOne(plusOne) ? 2 : 1;
    const copii = Math.max(0, participanti - adulti);

    for (let i = 1; i <= copii; i++) {
      await createGuest({
        name: `${nume} ${tata}${mama ? " " + mama : ""} - copil ${i}`,
        tag,
        notes: `Copil familie ${nume}`,
      });

      imported++;
    }
  }

  console.log("Import finalizat.");
  console.log(`Invitați importați: ${imported}`);
  console.log(`Rânduri ignorate: ${skipped}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
