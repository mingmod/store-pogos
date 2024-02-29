import express, { Request, Response } from "express";
import { validateInvoiceRefund } from "../validations/invoice";
import { createReturnInvoice, getInvoice } from "../db/invoice";

const invoiceRoute = express.Router();

type RefundInvoiceRequest = {
  invoiceId: number;
  products: number[];
};
invoiceRoute.post(
  "/refund",
  validateInvoiceRefund,
  async (req: Request, res: Response) => {
    const { invoiceId, products }: RefundInvoiceRequest = req.body;
    const invoice = await getInvoice(invoiceId);
    if (!invoice) return res.sendStatus(404);
    // check for double return
    const doubeRefundProducts: number[] = [];
    if (invoice.refunds.length) {
      invoice.refunds.forEach(({ items }) => {
        items.forEach(({ productId }) => {
          if (products.includes(productId)) {
            doubeRefundProducts.push(productId);
          }
        });
      });
    }
    if (doubeRefundProducts.length)
      return res.status(400).json({
        errors: doubeRefundProducts.map(
          (id) => `Product: ${id} already refunded`
        ),
      });
    try {
      const returnInvoice = await createReturnInvoice(invoice, products);
      return res.json(returnInvoice);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  }
);

export default invoiceRoute;
