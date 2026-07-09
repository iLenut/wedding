-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Guest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "groupName" TEXT,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "advancePaid" BOOLEAN NOT NULL DEFAULT false,
    "menuType" TEXT,
    "notes" TEXT,
    "attending" BOOLEAN NOT NULL DEFAULT true,
    "tableId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Guest_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Table" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Guest" ("advancePaid", "confirmed", "createdAt", "groupName", "id", "menuType", "name", "notes", "tableId") SELECT "advancePaid", "confirmed", "createdAt", "groupName", "id", "menuType", "name", "notes", "tableId" FROM "Guest";
DROP TABLE "Guest";
ALTER TABLE "new_Guest" RENAME TO "Guest";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
