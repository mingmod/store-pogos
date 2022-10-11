import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getSeller = async (id: number) => {
  return await prisma.seller.findUnique({
    where: {
      id,
    },
  });
};

export const createSeller = async (name: string) => {
  return await prisma.seller.create({
    data: {
      name,
    },
  });
};
