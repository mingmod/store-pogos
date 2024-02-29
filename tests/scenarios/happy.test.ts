// __tests__/api.test.ts

import request from "supertest";
import { app } from "../../src/main";
import { generateRandomUser } from "../utils/random-user-generator";
import { generateRandomName } from "../utils/random-name-generator";

describe("Happy case, check whole platform functionality", () => {
  const state = {
    sellerId: "",
    clientId: "",
    productEggs: "",
    productCarrots: "",
    productRice: "",
    productCheese: "",
    invoiceId: "",
  };

  it("Create a new Seller", async () => {
    const { fullname: name } = generateRandomName();
    const response = await request(app).post("/seller").send({ name });
    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
    expect(response.body).toEqual({
      id: expect.any(Number),
      name,
    });
    console.log(
      `New Seller created Successfully: #${response.body.id} - ${response.body.name}`
    );
    state.sellerId = response.body.id;
  });

  it("Create a new Client", async () => {
    const newUserData = generateRandomUser();
    const response = await request(app).post("/client").send(newUserData);
    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
    expect(response.body).toEqual({
      id: expect.any(Number),
      name: newUserData.name,
      email: newUserData.email,
    });
    console.log(
      `New Client created Successfully: #${response.body.id} - ${response.body.name} ${response.body.email}`
    );
    state.clientId = response.body.id;
  });

  it("Create a product Eggs", async () => {
    const productEggs = {
      name: "Eggstatic Delights 6pcs",
      description:
        "Get cracking with Eggstatic Delights - the egg-ceptional choice for all your culinary adventures! From fluffy omelets to decadent cakes, these eggs are your ticket to egg-squisite dishes that'll have your taste buds dancing with joy. 🍳🎉",
      price: 400,
      // if weight defined it wil be piece item
      weight: 300,
      sellerId: state.sellerId,
    };
    const response = await request(app).post("/product").send(productEggs);
    expect(response.statusCode).toBe(201);
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
    expect(response.body).toEqual({
      id: expect.any(Number),
      ...productEggs,
    });
    state.productEggs = response.body.id;
  });

  it("Create a product Carrots", async () => {
    const productCarrots = {
      name: "CrunchiCarrots",
      description: "Get ready to crunch and munch with CrunchiCarrots! 🥕✨",
      price: 600,
      // weight: undefined means it will be dynamic and price for 1000g
      sellerId: state.sellerId,
    };
    const response = await request(app).post("/product").send(productCarrots);
    expect(response.statusCode).toBe(201);
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
    expect(response.body).toEqual({
      id: expect.any(Number),
      weight: null,
      ...productCarrots,
    });
    state.productCarrots = response.body.id;
  });

  it("Create a product Rice", async () => {
    const productRice = {
      name: "ChuckleGrains Basmati Rice",
      description:
        "Each grain of this rice is infused with happiness and laughter. 🍚😄",
      price: 500,
      // weight: undefined means it will be dynamic and price for 1000g
      sellerId: state.sellerId,
    };
    const response = await request(app).post("/product").send(productRice);
    expect(response.statusCode).toBe(201);
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
    expect(response.body).toEqual({
      id: expect.any(Number),
      weight: null,
      ...productRice,
    });
    state.productRice = response.body.id;
  });

  it("Create a product Chicken", async () => {
    const productChicken = {
      name: "Cluck-licious Chicken",
      description:
        "Get ready to elevate your dishes to new heights with the savory goodness of Cluck-licious Chicken - because every meal deserves a little cluck! 🍗👌",
      price: 1200,
      // weight: undefined means it will be dynamic and price for 1000g
      sellerId: state.sellerId,
    };
    const response = await request(app).post("/product").send(productChicken);
    expect(response.statusCode).toBe(201);
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
    expect(response.body).toEqual({
      id: expect.any(Number),
      weight: null,
      ...productChicken,
    });
  });

  it("Create a product Cheese", async () => {
    const productCheese = {
      name: "CheesyGlee",
      description:
        "Say cheese and welcome to the world of CheesyGlee - where every bite brings a smile to your face! Crafted with love and care, our cheese is a delightful symphony of flavors, guaranteed to satisfy your cravings. 🧀😊",
      price: 2000,
      // weight: undefined means it will be dynamic and price for 1000g
      sellerId: state.sellerId,
    };
    const response = await request(app).post("/product").send(productCheese);
    expect(response.statusCode).toBe(201);
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
    expect(response.body).toEqual({
      id: expect.any(Number),
      weight: null,
      ...productCheese,
    });
    state.productCheese = response.body.id;
  });

  it("Create a Normal sale", async () => {
    const data = {
      sale: 10, // 10% sale for all customers
      status: true,
      type: "normal",
      sellerId: state.sellerId,
      products: [state.productCarrots, state.productCheese, state.productEggs],
    };

    const response = await request(app).post("/sale").send(data);
    expect(response.statusCode).toBe(201);
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
    expect(response.body).toEqual({
      ...data,
      id: expect.any(Number),
      orderAmount: null,
      saleClients: expect.any(Array),
      saleProducts: expect.any(Array),
      products: undefined,
    });
    expect(response.body.saleClients).toHaveLength(0);
    expect(response.body.saleProducts).toHaveLength(data.products.length);
  });

  it("Create a Individual sale", async () => {
    const data = {
      sale: 20, // 20% sale for single customer
      status: true,
      type: "individual",
      sellerId: state.sellerId,
      products: [state.productEggs, state.productRice],
      clients: [state.clientId],
    };

    const response = await request(app).post("/sale").send(data);
    expect(response.statusCode).toBe(201);
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
    expect(response.body).toEqual({
      ...data,
      id: expect.any(Number),
      orderAmount: null,
      saleClients: expect.any(Array),
      saleProducts: expect.any(Array),
      products: undefined,
      clients: undefined,
    });
    expect(response.body.saleClients).toHaveLength(1);
    expect(response.body.saleProducts).toHaveLength(data.products.length);
  });

  it("Create a Limit sale", async () => {
    const data = {
      sale: 5, // 5% sale for all orders with total price more than 1000cents
      orderAmount: 1000,
      status: true,
      type: "limit",
      sellerId: state.sellerId,
    };

    const response = await request(app).post("/sale").send(data);
    expect(response.statusCode).toBe(201);
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
    expect(response.body).toEqual({
      ...data,
      id: expect.any(Number),
      saleClients: expect.any(Array),
      saleProducts: expect.any(Array),
    });
    expect(response.body.saleClients).toHaveLength(0);
    expect(response.body.saleProducts).toHaveLength(0);
  });

  it("Check client empty inventories list", async () => {
    const response = await request(app).get("/inventories/" + state.clientId);
    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
    expect(response.body).toEqual({
      id: state.clientId,
      email: expect.any(String),
      name: expect.any(String),
      inventories: [],
    });
  });

  it("Add Eggs to inventory", async () => {
    const data = {
      productId: state.productEggs,
      clientId: state.clientId,
      count: 2,
    };
    const response = await request(app).put("/inventories/update").send(data);
    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
    expect(response.body).toEqual({
      id: state.clientId,
      email: expect.any(String),
      name: expect.any(String),
      inventories: expect.any(Array),
    });
    expect(response.body.inventories[0].items[0]).toEqual({
      ...data,
      weight: null,
      updatedAt: expect.any(String),
      createdAt: expect.any(String),
      inventoryId: expect.any(Number),
      product: expect.any(Object),
      clientId: undefined,
    });
  });

  it("Add Carrots to inventory", async () => {
    const data = {
      productId: state.productCarrots,
      clientId: state.clientId,
      count: 1,
      weight: 1000,
    };
    const response = await request(app).put("/inventories/update").send(data);
    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
    expect(response.body).toEqual({
      id: state.clientId,
      email: expect.any(String),
      name: expect.any(String),
      inventories: expect.any(Array),
    });
    expect(response.body.inventories[0].items[1]).toEqual({
      ...data,
      updatedAt: expect.any(String),
      createdAt: expect.any(String),
      inventoryId: expect.any(Number),
      product: expect.any(Object),
      clientId: undefined,
    });
  });

  it("Update inventory Carrots", async () => {
    const data = {
      productId: state.productCarrots,
      clientId: state.clientId,
      count: 1,
      weight: 1500,
    };
    const response = await request(app).put("/inventories/update").send(data);
    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
    expect(response.body).toEqual({
      id: state.clientId,
      email: expect.any(String),
      name: expect.any(String),
      inventories: expect.any(Array),
    });
    expect(response.body.inventories[0].items[1]).toEqual({
      ...data,
      updatedAt: expect.any(String),
      createdAt: expect.any(String),
      inventoryId: expect.any(Number),
      product: expect.any(Object),
      clientId: undefined,
    });
  });

  it("Remove inventory Carrots", async () => {
    const data = {
      productId: state.productCarrots,
      clientId: state.clientId,
      count: 0,
    };
    const response = await request(app).put("/inventories/update").send(data);
    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
    expect(response.body).toEqual({
      id: state.clientId,
      email: expect.any(String),
      name: expect.any(String),
      inventories: expect.any(Array),
    });
    expect(response.body.inventories[0].items[1]).toBeFalsy();
  });

  it("Remove inventory Eggs", async () => {
    const data = {
      productId: state.productEggs,
      clientId: state.clientId,
      count: 0,
    };
    const response = await request(app).put("/inventories/update").send(data);
    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
    expect(response.body).toEqual({
      id: state.clientId,
      email: expect.any(String),
      name: expect.any(String),
      inventories: [],
    });
  });

  it("Add Eggs to inventory", async () => {
    const data = {
      productId: state.productEggs,
      clientId: state.clientId,
      count: 2,
    };
    const response = await request(app).put("/inventories/update").send(data);
    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
    expect(response.body).toEqual({
      id: state.clientId,
      email: expect.any(String),
      name: expect.any(String),
      inventories: expect.any(Array),
    });
    expect(response.body.inventories[0].items[0]).toEqual({
      ...data,
      weight: null,
      updatedAt: expect.any(String),
      createdAt: expect.any(String),
      inventoryId: expect.any(Number),
      product: expect.any(Object),
      clientId: undefined,
    });
  });

  it("Add Carrots to inventory", async () => {
    const data = {
      productId: state.productCarrots,
      clientId: state.clientId,
      count: 1,
      weight: 1000,
    };
    const response = await request(app).put("/inventories/update").send(data);
    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
    expect(response.body).toEqual({
      id: state.clientId,
      email: expect.any(String),
      name: expect.any(String),
      inventories: expect.any(Array),
    });
    expect(response.body.inventories[0].items[1]).toEqual({
      ...data,
      updatedAt: expect.any(String),
      createdAt: expect.any(String),
      inventoryId: expect.any(Number),
      product: expect.any(Object),
      clientId: undefined,
    });
  });

  it("Add Cheese to inventory", async () => {
    const data = {
      productId: state.productCheese,
      clientId: state.clientId,
      count: 1,
      weight: 500,
    };
    const response = await request(app).put("/inventories/update").send(data);
    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
    expect(response.body).toEqual({
      id: state.clientId,
      email: expect.any(String),
      name: expect.any(String),
      inventories: expect.any(Array),
    });
    expect(response.body.inventories[0].items[2]).toEqual({
      ...data,
      updatedAt: expect.any(String),
      createdAt: expect.any(String),
      inventoryId: expect.any(Number),
      product: expect.any(Object),
      clientId: undefined,
    });
  });
  it("Add Rice to inventory", async () => {
    const data = {
      productId: state.productRice,
      clientId: state.clientId,
      count: 1,
      weight: 400,
    };
    const response = await request(app).put("/inventories/update").send(data);
    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
    expect(response.body).toEqual({
      id: state.clientId,
      email: expect.any(String),
      name: expect.any(String),
      inventories: expect.any(Array),
    });
    expect(response.body.inventories[0].items[3]).toEqual({
      ...data,
      updatedAt: expect.any(String),
      createdAt: expect.any(String),
      inventoryId: expect.any(Number),
      product: expect.any(Object),
      clientId: undefined,
    });
  });
  it("Pay for all items in inventory (Create Invoice)", async () => {
    const response = await request(app).post("/inventories/pay").send({
      clientId: state.clientId,
      sellerId: state.sellerId,
    });
    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );

    expect(response.body).toEqual({
      id: expect.any(Number),
      clientId: state.clientId,
      clientName: expect.any(String),
      clientEmail: expect.any(String),
      sellerId: state.sellerId,
      sellerName: expect.any(String),
      limitSaleId: expect.any(Number),
      limitSalePercent: 5,
      orderTotalWithoutLimitSale: 2160,
      orderTotalWithoutSale: 2600,
      orderTotal: 2052,
      createdAt: expect.any(String),
      refund: false,
      refundInvoiceId: null,
      items: expect.any(Array),
    });
    console.log("Invoice created successfully", response.body);
    state.invoiceId = response.body.id;
  });

  it("Return some Items (Create Return Invoice)", async () => {
    const response = await request(app)
      .post("/invoice/refund")
      .send({
        invoiceId: state.invoiceId,
        products: [state.productEggs, state.productCheese],
      });
    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );

    expect(response.body).toEqual({
      id: expect.any(Number),
      clientId: state.clientId,
      clientName: expect.any(String),
      clientEmail: expect.any(String),
      sellerId: state.sellerId,
      sellerName: expect.any(String),
      limitSaleId: expect.any(Number),
      limitSalePercent: 5,
      orderTotalWithoutLimitSale: -1460,
      orderTotalWithoutSale: -1800,
      orderTotal: -1387,
      createdAt: expect.any(String),
      refund: true,
      refundInvoiceId: state.invoiceId,
      items: expect.any(Array),
    });

    console.log("Return Invoice created successfully", response.body);
  });

  it("Return same Items again (Create Return Invoice)", async () => {
    const response = await request(app)
      .post("/invoice/refund")
      .send({
        invoiceId: state.invoiceId,
        products: [state.productEggs, state.productCheese, state.productRice],
      });
    expect(response.statusCode).toBe(400);
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );

    expect(response.body).toEqual({
      errors: [
        `Product: ${state.productEggs} already refunded`,
        `Product: ${state.productCheese} already refunded`,
      ],
    });

    console.log("Return Invoice created successfully", response.body);
  });
});
