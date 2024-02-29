import { body } from "express-validator";
import applyErrors from "./apply-errors";

export const validateInvoiceRefund = [
  body("invoiceId").isInt().withMessage("orderId is required"),
  body("products")
    .isArray({ min: 1 }) // Ensure products is an array with at least one item
    .withMessage("At least one product is required")
    .custom((value: any[]) => {
      // Custom validation to check each item in the products array
      for (const product of value) {
        if (!Number.isInteger(product)) {
          throw new Error("Each productId must be a number");
        }
      }
      return true;
    }),
  applyErrors,
];
