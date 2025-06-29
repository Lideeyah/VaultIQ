-- CreateTable
CREATE TABLE "Asset" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fileUrl" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "score" REAL NOT NULL,
    "owner" TEXT NOT NULL
);
