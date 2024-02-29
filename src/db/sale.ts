import { PrismaClient, Sale } from "@prisma/client";
const prisma = new PrismaClient();

export const getSale = async (id: number) => {
  return await prisma.sale.findUnique({
    where: {
      id,
    },
  });
};

export type NewSale = Omit<Sale, "id"> & {
  products: number[];
  clients: number[];
};
export const createSale = async ({
  status,
  type,
  sellerId,
  products,
  clients,
  orderAmount,
  sale,
}: NewSale) => {
  return await prisma.sale.create({
    data: {
      status,
      type,
      sale,
      sellerId,
      orderAmount,
      // Optionally associate products and clients with the sale through intermediary tables
      saleProducts: {
        create: products ? products.map((productId) => ({ productId })) : [],
      },
      saleClients: {
        create: clients ? clients.map((clientId) => ({ clientId })) : [],
      },
    },
    include: {
      saleProducts: true,
      saleClients: true,
    },
  });
};
