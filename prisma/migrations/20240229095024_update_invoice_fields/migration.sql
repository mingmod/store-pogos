/*
  Warnings:

  - You are about to alter the column `productWeight` on the `InvoiceItem` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `originalPrice` to the `InvoiceItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `InvoiceItem` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_InvoiceItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "invoiceId" INTEGER NOT NULL,
    "individualSaleId" INTEGER,
    "individualSalePercent" INTEGER NOT NULL DEFAULT 0,
    "normalSaleId" INTEGER,
    "normalSalePercent" INTEGER NOT NULL DEFAULT 0,
    "productId" INTEGER NOT NULL,
    "productName" TEXT NOT NULL,
    "productDescription" TEXT,
    "productWeight" INTEGER,
    "productPrice" INTEGER NOT NULL,
    "inventoryCount" INTEGER NOT NULL,
    "inventoryWeight" INTEGER NOT NULL,
    "originalPrice" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    CONSTRAINT "InvoiceItem_individualSaleId_fkey" FOREIGN KEY ("individualSaleId") REFERENCES "Sale" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "InvoiceItem_normalSaleId_fkey" FOREIGN KEY ("normalSaleId") REFERENCES "Sale" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "InvoiceItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "InvoiceItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_InvoiceItem" ("id", "individualSaleId", "individualSalePercent", "inventoryCount", "inventoryWeight", "invoiceId", "normalSaleId", "normalSalePercent", "productDescription", "productId", "productName", "productPrice", "productWeight") SELECT "id", "individualSaleId", "individualSalePercent", "inventoryCount", "inventoryWeight", "invoiceId", "normalSaleId", "normalSalePercent", "productDescription", "productId", "productName", "productPrice", "productWeight" FROM "InvoiceItem";
DROP TABLE "InvoiceItem";
ALTER TABLE "new_InvoiceItem" RENAME TO "InvoiceItem";
CREATE TABLE "new_Invoice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clientId" INTEGER NOT NULL,
    "clientName" TEXT,
    "clientEmail" TEXT NOT NULL,
    "sellerId" INTEGER NOT NULL,
    "sellerName" TEXT NOT NULL,
    "limitSaleId" INTEGER,
    "limitSalePercent" INTEGER DEFAULT 0,
    "orderTotalWithoutLimitSale" INTEGER NOT NULL,
    "orderTotalWithoutSale" INTEGER NOT NULL,
    "orderTotal" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "refund" BOOLEAN NOT NULL DEFAULT false,
    "refundInvoiceId" INTEGER,
    CONSTRAINT "Invoice_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Invoice_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Invoice_limitSaleId_fkey" FOREIGN KEY ("limitSaleId") REFERENCES "Sale" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Invoice_refundInvoiceId_fkey" FOREIGN KEY ("refundInvoiceId") REFERENCES "Invoice" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Invoice" ("clientEmail", "clientId", "clientName", "createdAt", "id", "limitSaleId", "limitSalePercent", "orderTotal", "orderTotalWithoutLimitSale", "orderTotalWithoutSale", "refund", "refundInvoiceId", "sellerId", "sellerName") SELECT "clientEmail", "clientId", "clientName", "createdAt", "id", "limitSaleId", "limitSalePercent", "orderTotal", "orderTotalWithoutLimitSale", "orderTotalWithoutSale", "refund", "refundInvoiceId", "sellerId", "sellerName" FROM "Invoice";
DROP TABLE "Invoice";
ALTER TABLE "new_Invoice" RENAME TO "Invoice";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
