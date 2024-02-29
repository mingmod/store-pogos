import express, { Request, Response } from "express";
import { getSeller } from "../db/seller";
import { getClient } from "../db/client";
import { validateCreateSale } from "../validations/sales";
import { NewSale, createSale } from "../db/sale";

const saleRoute = express.Router();

saleRoute.get("/:id", async (req: Request, res: Response) => {
  const client = await getClient(Number(req.params.id));
  res.json(client);
});

saleRoute.post("/", validateCreateSale, async (req: Request, res: Response) => {
  // Destructure sale data from request body
  const newSaleData: NewSale = req.body;
  try {
    // Check if seller with given ID exists
    const sellerExists = await getSeller(newSaleData.sellerId);
    if (!sellerExists) {
      return res.status(400).json({ error: "Seller not found" });
    }
    // Create the sale in the database
    const sale = await createSale(newSaleData);

    return res.status(201).json(sale);
  } catch (error) {
    console.error("Error creating sale:", error);
    return res.status(500).json({ error: "Could not create sale" });
  }
});

export default saleRoute;
