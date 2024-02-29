import { Invoice, InvoiceItem, PrismaClient } from "@prisma/client";
import { getClientInventoryWithProducts } from "./inventory";
import { SALE_TYPES } from "../utils/enums";
const prisma = new PrismaClient();

const calculateSalePrice = (
  originalPrice: number,
  salePercent: number
): number => {
  if (typeof originalPrice !== "number" || typeof salePercent !== "number") {
    throw new Error("Both originalPrice and salePercent must be numbers");
  }

  if (salePercent < 0 || salePercent > 100) {
    throw new Error("Sale percentage must be between 0 and 100");
  }

  const discount: number = originalPrice * (salePercent / 100);
  const salePrice: number = originalPrice - discount;

  return salePrice;
};

export const createInvoice = async (clientId: number, sellerId: number) => {
  const client = await getClientInventoryWithProducts(clientId, sellerId);
  if (!client) return new Error("Client not found");
  const [inventory] = client.inventories;
  if (!inventory) return new Error("Inventory not found");

  let orderTotalWithoutSale = 0;
  let orderTotalWithoutLimitSale = 0;
  const items = inventory.items.map(
    ({ count, weight, product }): Omit<InvoiceItem, "id" | "invoiceId"> => {
      // get sales for item
      let individualSalePercent = 0;
      let individualSaleId = null;
      let normalSalePercent = 0;
      let normalSaleId = null;

      product.saleProducts.forEach(({ sale }) => {
        if (sale.type === SALE_TYPES.NORMAL && sale.sale > normalSalePercent) {
          normalSalePercent = sale.sale;
          normalSaleId = sale.id;
        }
        if (
          sale.type === SALE_TYPES.INDIVIDUAL &&
          sale.sale > individualSalePercent
        ) {
          individualSalePercent = sale.sale;
          individualSaleId = sale.id;
        }
      });

      // calculate product price
      let originalPrice = 0;
      let inventoryWeight = 0;
      if (product.weight) {
        inventoryWeight = product.weight * count;
        originalPrice = product.price * count;
      } else {
        if (!weight)
          throw new Error(
            "No weight provided for products that are sold by weighing!!"
          );
        inventoryWeight = weight * count;
        originalPrice = Math.round((inventoryWeight * product.price) / 1000);
      }

      const price = calculateSalePrice(
        originalPrice,
        individualSalePercent + normalSalePercent
      );

      orderTotalWithoutSale += originalPrice;
      orderTotalWithoutLimitSale += price;

      return {
        individualSaleId,
        individualSalePercent,
        normalSaleId,
        normalSalePercent,
        productId: product.id,
        productName: product.name,
        productDescription: product.description,
        productWeight: product.weight ?? 1000,
        productPrice: product.price,
        inventoryCount: count,
        inventoryWeight,
        originalPrice,
        price,
      };
    }
  );

  // get limit sale
  let limitSaleId = null;
  let limitSalePercent = 0;
  inventory.seller.sales.forEach((sale) => {
    if (
      sale.type === SALE_TYPES.LIMIT &&
      sale.sale > limitSalePercent &&
      orderTotalWithoutLimitSale > (sale.orderAmount ?? 0)
    ) {
      (limitSaleId = sale.id), (limitSalePercent = sale.sale);
    }
  });

  const orderTotal = calculateSalePrice(
    orderTotalWithoutLimitSale,
    limitSalePercent
  );

  return await prisma.invoice.create({
    data: {
      // client info
      clientId: client.id,
      clientName: client.name,
      clientEmail: client.email,
      // seller info
      sellerId: inventory.seller.id,
      sellerName: inventory.seller.name,
      // total price
      orderTotal,
      orderTotalWithoutLimitSale,
      orderTotalWithoutSale,
      // sale info
      limitSaleId,
      limitSalePercent,
      items: {
        create: items,
      },
    },
    include: {
      items: true,
    },
  });
};

export const getInvoice = async (id: number) => {
  return prisma.invoice.findUnique({
    where: {
      id,
    },
    include: {
      items: true,
      refunds: {
        include: {
          items: true,
        },
      },
    },
  });
};

export const createReturnInvoice = async (
  invoice: Invoice & { items: InvoiceItem[] },
  products: number[]
) => {
  let orderTotalWithoutLimitSale = 0;
  let orderTotalWithoutSale = 0;
  const items = invoice.items
    .filter(({ productId, originalPrice, price }) => {
      if (!products.includes(productId)) return false;
      // calculate price
      orderTotalWithoutSale -= originalPrice;
      orderTotalWithoutLimitSale -= price;
      return true;
    })
    .map(({ id, invoiceId, ...rest }) => rest);
  const orderTotal = calculateSalePrice(
    orderTotalWithoutLimitSale,
    invoice.limitSalePercent ?? 0
  );
  return await prisma.invoice.create({
    data: {
      ...invoice,
      // remove fields from order
      id: undefined,
      createdAt: undefined,
      // refund info
      refundInvoiceId: invoice.id,
      refund: true,

      // total price
      orderTotal,
      orderTotalWithoutLimitSale,
      orderTotalWithoutSale,
      items: {
        create: items,
      },
      refunds: undefined,
    },
    include: {
      items: true,
    },
  });
};
