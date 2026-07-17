import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";

import { saveAs } from "file-saver";

function getGuestFullName(guest) {
  const firstName =
    guest.firstName || guest.firstname || guest.first_name || guest.name || "";

  const lastName =
    guest.lastName || guest.lastname || guest.last_name || guest.surname || "";

  const fullName = `${firstName} ${lastName}`.trim();

  return fullName || guest.fullName || "Invitat fără nume";
}

function getGuestSpecifications(guest) {
  /*
   * Sunt verificate mai multe denumiri posibile ale câmpului.
   * Păstrează sau modifică lista în funcție de structura obiectului guest.
   */
  const specifications =
    guest.specifications ||
    guest.specificatii ||
    guest.specification ||
    guest.menu ||
    guest.menuType ||
    guest.menu_type ||
    guest.notes ||
    guest.observations ||
    guest.observatii ||
    "";

  return String(specifications).trim() || "-";
}

function sortGuests(guests) {
  return [...guests].sort((guestA, guestB) =>
    getGuestFullName(guestA).localeCompare(getGuestFullName(guestB), "ro", {
      sensitivity: "base",
    }),
  );
}

function createHeaderCell(text, width) {
  return new TableCell({
    width: {
      size: width,
      type: WidthType.PERCENTAGE,
    },
    shading: {
      fill: "E2E8F0",
    },
    margins: {
      top: 120,
      bottom: 120,
      left: 140,
      right: 140,
    },
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text,
            bold: true,
            size: 22,
          }),
        ],
      }),
    ],
  });
}

function createBodyCell(text, width, alignment = AlignmentType.LEFT) {
  return new TableCell({
    width: {
      size: width,
      type: WidthType.PERCENTAGE,
    },
    margins: {
      top: 100,
      bottom: 100,
      left: 140,
      right: 140,
    },
    children: [
      new Paragraph({
        alignment,
        children: [
          new TextRun({
            text: String(text),
            size: 21,
          }),
        ],
      }),
    ],
  });
}

export async function exportTablesToWord(tables) {
  try {
    if (!Array.isArray(tables) || tables.length === 0) {
      alert("Nu există mese de exportat.");
      return;
    }

    const sortedTables = [...tables].sort((tableA, tableB) =>
      String(tableA.name || "").localeCompare(String(tableB.name || ""), "ro", {
        numeric: true,
        sensitivity: "base",
      }),
    );

    const totalGuests = sortedTables.reduce(
      (total, table) =>
        total + (Array.isArray(table.guests) ? table.guests.length : 0),
      0,
    );

    if (totalGuests === 0) {
      alert("Nu există invitați așezați la mese.");
      return;
    }

    const documentChildren = [
      new Paragraph({
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: {
          after: 120,
        },
        children: [
          new TextRun({
            text: "Lista invitaților pe mese",
            bold: true,
            size: 36,
          }),
        ],
      }),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: {
          after: 400,
        },
        children: [
          new TextRun({
            text: `${sortedTables.length} mese • ${totalGuests} invitați`,
            color: "64748B",
            size: 22,
          }),
        ],
      }),
    ];

    sortedTables.forEach((table, tableIndex) => {
      const tableName = table.name || `Masa ${tableIndex + 1}`;
      const guests = sortGuests(
        Array.isArray(table.guests) ? table.guests : [],
      );

      documentChildren.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          spacing: {
            before: tableIndex === 0 ? 0 : 350,
            after: 140,
          },
          children: [
            new TextRun({
              text: tableName,
              bold: true,
              size: 28,
            }),
          ],
        }),

        new Paragraph({
          spacing: {
            after: 160,
          },
          children: [
            new TextRun({
              text: `${guests.length} din ${table.capacity || 0} locuri ocupate`,
              color: "64748B",
              italics: true,
              size: 20,
            }),
          ],
        }),
      );

      const rows = [
        new TableRow({
          tableHeader: true,
          children: [
            createHeaderCell("Nr.", 10),
            createHeaderCell("Nume și prenume", 50),
            createHeaderCell("Specificații meniu / altele", 40),
          ],
        }),
      ];

      if (guests.length === 0) {
        rows.push(
          new TableRow({
            children: [
              createBodyCell("-", 10, AlignmentType.CENTER),
              createBodyCell("Nu există invitați la această masă", 50),
              createBodyCell("-", 40),
            ],
          }),
        );
      } else {
        guests.forEach((guest, guestIndex) => {
          rows.push(
            new TableRow({
              children: [
                createBodyCell(guestIndex + 1, 10, AlignmentType.CENTER),
                createBodyCell(getGuestFullName(guest), 50),
                createBodyCell(getGuestSpecifications(guest), 40),
              ],
            }),
          );
        });
      }

      documentChildren.push(
        new Table({
          width: {
            size: 100,
            type: WidthType.PERCENTAGE,
          },

          columnWidths: [1000, 5000, 4000],

          borders: {
            top: {
              style: BorderStyle.SINGLE,
              size: 1,
              color: "CBD5E1",
            },
            bottom: {
              style: BorderStyle.SINGLE,
              size: 1,
              color: "CBD5E1",
            },
            left: {
              style: BorderStyle.SINGLE,
              size: 1,
              color: "CBD5E1",
            },
            right: {
              style: BorderStyle.SINGLE,
              size: 1,
              color: "CBD5E1",
            },
            insideHorizontal: {
              style: BorderStyle.SINGLE,
              size: 1,
              color: "E2E8F0",
            },
            insideVertical: {
              style: BorderStyle.SINGLE,
              size: 1,
              color: "E2E8F0",
            },
          },

          rows,
        }),
      );
    });

    const document = new Document({
      creator: "Wedding Seating Planner",
      title: "Lista invitaților pe mese",
      description:
        "Lista invitaților grupați pe mese și specificațiile acestora",
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 900,
                right: 900,
                bottom: 900,
                left: 900,
              },
            },
          },
          children: documentChildren,
        },
      ],
    });

    const blob = await Packer.toBlob(document);

    const currentDate = new Date()
      .toLocaleDateString("ro-RO")
      .replaceAll(".", "-")
      .replaceAll("/", "-");

    saveAs(blob, `lista-invitati-mese-${currentDate}.docx`);
  } catch (error) {
    console.error("Eroare la generarea documentului Word:", error);

    alert(
      "Documentul Word nu a putut fi generat. Verifică consola pentru detalii.",
    );
  }
}
