import { PrismaClient, Product } from "@prisma/client";
import { SALE_TYPES } from "../utils/enums";
const prisma = new PrismaClient();

export const getProduct = async (id: number) => {
  return await prisma.product.findUnique({
    where: {
      id,
    },
  });
};

export type NewProduct = Omit<Product, "id">;
export const createProduct = async (data: NewProduct) => {
  return await prisma.product.create({
    data,
  });
};

export const getProductWithSales = async (
  productId: number,
  clientId: number
) => {
  return await prisma.product.findUnique({
    where: { id: productId },
    include: {
      saleProducts: {
        include: {
          sale: {
            include: {
              saleClients: true,
            },
          },
        },
        where: {
          OR: [
            { sale: { type: SALE_TYPES.NORMAL } }, // Filter saleProducts where sale type is 'normal'
            { sale: { saleClients: { some: { clientId } } } }, // Filter saleProducts where one of the saleClients has clientId equal to id
          ],
        },
      },
    },
  });
};
