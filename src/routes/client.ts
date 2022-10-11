import express from "express";
import { createClient, getClient } from "../db/client";

const clinetRoute = express.Router();

type CreateClientBody = {
  name: string;
  email: string;
};

clinetRoute.get("/:id", async (req, res) => {
  const client = await getClient(Number(req.params.id));
  res.json(client);
});

clinetRoute.post("/", async (req, res) => {
  const { name, email }: CreateClientBody = req.body;
  const client = await createClient(name, email);
  res.json(client);
});

export default clinetRoute;
