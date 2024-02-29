import {
  Inventory,
  InventoryItem,
  PrismaClient,
  Product,
} from "@prisma/client";
import { SALE_TYPES } from "../utils/enums";
import { getProductWithSales } from "./product";

const prisma = new PrismaClient();

export const getClientInventoryWithProducts = async (
  id: number,
  sellerId?: number
) => {
  // if seller id present need to get inventory connected with that seller
  const sellerQuery = sellerId
    ? {
        where: {
          sellerId: sellerId,
        },
      }
    : {};
  return await prisma.client.findUnique({
    where: {
      id,
    },
    include: {
      inventories: {
        include: {
          seller: {
            include: {
              sales: {
                where: {
                  type: SALE_TYPES.LIMIT,
                },
              },
            },
          },
          items: {
            include: {
              product: {
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
                        { sale: { saleClients: { some: { clientId: id } } } }, // Filter saleProducts where one of the saleClients has clientId equal to id
                      ],
                    },
                  },
                },
              },
            },
            orderBy: { createdAt: "asc" },
          },
        },
        ...sellerQuery,
      },
    },
  });
};

export const removeInventoryItem = async (
  inventoryId: number,
  productId: number
) => {
  return await prisma.inventoryItem.delete({
    where: {
      inventoryId_productId: {
        inventoryId,
        productId,
      },
    },
  });
};

export const removeInventory = async (id: number) => {
  // Delete the inventory item along with its associated items
  await prisma.inventory.delete({
    where: {
      id,
    },
  });
};

export const removeProductFromInventory = (
  inventoryWithItems: (Inventory & { items: InventoryItem[] }) | undefined,
  id: number
) => {
  // inventory not founded
  if (!inventoryWithItems) return Promise.resolve();
  // inventory have no items, removing it
  if (inventoryWithItems.items.length === 0)
    return removeInventory(inventoryWithItems.id);
  const itemToRemove = inventoryWithItems.items.find(
    ({ productId }) => productId === id
  );
  // item was already missing in inventory
  if (!itemToRemove) return Promise.resolve();
  // invenotry have a lot of items need to remove one of them
  if (inventoryWithItems.items.length > 1) {
    return removeInventoryItem(itemToRemove.inventoryId, id);
  }
  // need to remove invenotry with last item
  return removeInventory(inventoryWithItems.id);
};

export const createInventoryWithItems = async (
  clientId: number,
  sellerId: number,
  items: Omit<InventoryItem, "inventoryId" | "createdAt" | "updatedAt">[]
) => {
  return prisma.inventory.create({
    data: {
      active: true,
      clientId,
      sellerId,
      items: {
        create: items,
      },
    },
    include: {
      items: true,
    },
  });
};

export const createInventoryItem = async (
  data: Omit<InventoryItem, "createdAt" | "updatedAt">
) => {
  console.log("createInventoryItem");
  return await prisma.inventoryItem.create({
    data,
  });
};

export const updateInventoryItem = async (
  inventoryId: number,
  productId: number,
  data: Omit<InventoryItem, "createdAt" | "updatedAt">
) => {
  console.log("updateInventoryItem");
  return await prisma.inventoryItem.update({
    where: {
      inventoryId_productId: {
        inventoryId,
        productId,
      },
    },
    data,
  });
};

export const updateInventoryProduct = (
  inventoryWithItems: (Inventory & { items: InventoryItem[] }) | undefined,
  product: Product,
  clientId: number,
  count: number,
  weight?: number
) => {
  // no inventory need to a create a new one
  if (!inventoryWithItems)
    return createInventoryWithItems(clientId, product.sellerId, [
      { count, weight: weight ?? null, productId: product.id },
    ]);

  const inventoryItem = inventoryWithItems.items.find(
    ({ productId }) => productId === product.id
  );

  const updateData = {
    count,
    weight: weight ?? null,
    productId: product.id,
    inventoryId: inventoryWithItems.id,
  };

  if (!inventoryItem) return createInventoryItem(updateData);

  return updateInventoryItem(
    inventoryItem.inventoryId,
    inventoryItem.productId,
    updateData
  );
};
