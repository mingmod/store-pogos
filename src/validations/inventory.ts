import { body } from "express-validator";
import applyErrors from "./apply-errors";

export const validateInventoryUpdate = [
  body("weight")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Weight must be a non-negative integer"),
  body("count")
    .isInt({ min: 0 })
    .withMessage("Count must be a positive integer"),
  body("productId").isInt().withMessage("productId is required"),
  body("clientId").isInt().withMessage("clientId is required"),
  applyErrors,
];

export const validateInventoryPay = [
  body("sellerId").isInt().withMessage("sellerId is required"),
  body("clientId").isInt().withMessage("clientId is required"),
  applyErrors,
];
