import { body } from "express-validator";
import applyErrors from "./apply-errors";

export const validateProduct = [
  body("name")
    .isLength({ min: 3, max: 255 })
    .withMessage("Name must be between 3 and 255 characters"),
  body("description")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Description must be at most 1000 characters"),
  body("price")
    .isInt({ min: 0 })
    .withMessage("Price must be a non-negative integer"),
  body("weight")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Weight must be a non-negative integer"),
  body("sellerId").isInt().withMessage("Invalid seller ID"),
  applyErrors,
];
