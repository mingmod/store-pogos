import express, { Request, Response } from "express";
import { getSeller } from "../db/seller";
import { NewProduct, createProduct } from "../db/product";
import { validationResult } from "express-validator";
import { getClient } from "../db/client";
import { validateProduct } from "../validations/product";

const productRoute = express.Router();

productRoute.post("/", validateProduct, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, description, price, weight, sellerId }: NewProduct = req.body;

  try {
    // Check if seller with given ID exists
    const sellerExists = await getSeller(sellerId);
    if (!sellerExists) {
      return res.status(400).json({ error: "Seller not found" });
    }

    // Save product using Prisma
    /*
        This approach may provide more
        clarity by explicitly listing the
        properties you're interested in,
        while using req.body approach is more concise.
        There shouldn't be a significant difference in performance
      */
    const savedProduct = await createProduct({
      name,
      description,
      price,
      weight,
      sellerId,
    });
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error saving product:", error);
    res.status(500).json({ error: "Failed to save product" });
  }
});

export default productRoute;
