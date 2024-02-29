-- CreateTable
CREATE TABLE "Invoice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clientId" INTEGER NOT NULL,
    "clientName" TEXT NOT NULL,
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

-- CreateTable
CREATE TABLE "InvoiceItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "invoiceId" INTEGER NOT NULL,
    "individualSaleId" INTEGER,
    "individualSalePercent" INTEGER NOT NULL DEFAULT 0,
    "normalSaleId" INTEGER,
    "normalSalePercent" INTEGER NOT NULL DEFAULT 0,
    "productId" INTEGER NOT NULL,
    "productName" TEXT NOT NULL,
    "productDescription" TEXT NOT NULL,
    "productWeight" TEXT NOT NULL,
    "productPrice" INTEGER NOT NULL,
    "inventoryCount" INTEGER NOT NULL,
    "inventoryWeight" INTEGER NOT NULL,
    CONSTRAINT "InvoiceItem_individualSaleId_fkey" FOREIGN KEY ("individualSaleId") REFERENCES "Sale" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "InvoiceItem_normalSaleId_fkey" FOREIGN KEY ("normalSaleId") REFERENCES "Sale" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "InvoiceItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "InvoiceItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
