import express from "express";
import { createSeller, getSeller } from "../db/seller";

const sellerRoute = express.Router();

type CreateSellerBody = {
  name: string;
};

sellerRoute.get("/:id", async (req, res) => {
  const seller = await getSeller(Number(req.params.id));
  res.json(seller);
});

sellerRoute.post("/", async (req, res) => {
  const { name }: CreateSellerBody = req.body;
  const seller = await createSeller(name);
  res.json(seller);
});

export default sellerRoute;
