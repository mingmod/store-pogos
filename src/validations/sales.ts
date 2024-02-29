import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { SALE_TYPES } from "../utils/enums";

export const validateCreateSale = [
  body("status").isBoolean(),
  body("type").isIn([
    SALE_TYPES.NORMAL,
    SALE_TYPES.INDIVIDUAL,
    SALE_TYPES.LIMIT,
  ]),
  body("sellerId").isInt().notEmpty(),
  body("sale").isInt({ min: 0, max: 99 }),
  body("orderAmount").optional().isInt(),

  // Custom validation for type-specific fields
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, products, clients, orderAmount } = req.body;
    if (type === SALE_TYPES.INDIVIDUAL) {
      if (!Array.isArray(clients) || clients.length === 0) {
        return res
          .status(400)
          .json({ error: "Clients array must not be empty" });
      }
    }

    if (type === SALE_TYPES.NORMAL || type === SALE_TYPES.INDIVIDUAL) {
      if (!Array.isArray(products) || products.length === 0) {
        return res
          .status(400)
          .json({ error: "Products array must not be empty" });
      }
    }

    if (type === SALE_TYPES.LIMIT && !Number.isInteger(orderAmount)) {
      return res
        .status(400)
        .json({ error: "Order Amount was required for limit sale" });
    }

    next();
  },
];
