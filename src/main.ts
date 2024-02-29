import express from "express";
import bodyParser from "body-parser";
import clinetRoute from "./routes/client";
import sellerRoute from "./routes/seller";
import productRoute from "./routes/product";
import saleRoute from "./routes/sale";
import inventoriesRoute from "./routes/inventories";
import invoiceRoute from "./routes/invoice";
export const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use("/client", clinetRoute);
app.use("/seller", sellerRoute);
app.use("/product", productRoute);
app.use("/sale", saleRoute);
app.use("/inventories", inventoriesRoute);
app.use("/invoice", invoiceRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
