import express, { Request, Response } from "express";
import {
  getClientInventoryWithProducts,
  removeProductFromInventory,
  updateInventoryProduct,
} from "../db/inventory";
import {
  validateInventoryPay,
  validateInventoryUpdate,
} from "../validations/inventory";
import { getProductWithSales } from "../db/product";
import { createInvoice } from "../db/invoice";

const inventoriesRoute = express.Router();

inventoriesRoute.get("/:clientId", async (req, res) => {
  const client = await getClientInventoryWithProducts(
    Number(req.params.clientId)
  );
  res.json(client);
});

type UpdateInventoryRequest = {
  productId: number;
  clientId: number;
  weight?: number;
  count: number;
};

inventoriesRoute.put(
  "/update",
  validateInventoryUpdate,
  async (req: Request, res: Response) => {
    const { clientId, productId, count, weight }: UpdateInventoryRequest =
      req.body;
    try {
      const product = await getProductWithSales(productId, clientId);
      if (!product) return res.sendStatus(404);
      const client = await getClientInventoryWithProducts(
        clientId,
        product.sellerId
      );
      if (!client) return res.sendStatus(404);
      const [inventory] = client.inventories;
      if (!count) {
        // need to remove item from inventory or full inventory if it was empty
        await removeProductFromInventory(inventory, productId);
      } else {
        // add or update inventory item
        await updateInventoryProduct(
          inventory,
          product,
          clientId,
          count,
          weight
        );
      }
      return res.json(await getClientInventoryWithProducts(clientId));
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  }
);
type PayInventoryRequest = {
  sellerId: number;
  clientId: number;
};

inventoriesRoute.post(
  "/pay",
  validateInventoryPay,
  async (req: Request, res: Response) => {
    const { clientId, sellerId }: PayInventoryRequest = req.body;
    try {
      const client = await getClientInventoryWithProducts(clientId, sellerId);
      if (!client) return res.sendStatus(404);
      const invoice = await createInvoice(clientId, sellerId);
      return res.json(invoice);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  }
);

export default inventoriesRoute;
