import { NextFunction, Request, Response } from "express";

export async function checkIdExists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = req.query.id?.toString();

  if (!id) {
    return res.status(400).json({ message: "Id is missing" });
  }

  next();
}
