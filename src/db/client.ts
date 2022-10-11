import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getClient = async (id: number) => {
  return await prisma.client.findUnique({
    where: {
      id,
    },
  });
};

export const createClient = async (name: string, email: string) => {
  return await prisma.client.create({
    data: {
      name,
      email,
    },
  });
};
