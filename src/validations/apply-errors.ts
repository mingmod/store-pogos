import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
const applyErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({ errors: errorMessages });
  }
  next();
};

export default applyErrors;
