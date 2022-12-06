import { Request, Response, NextFunction } from "express";
import fs from "fs/promises";
import jwt from "jsonwebtoken";
import path from "path";

export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // extracting token from request header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // when there is no token
  if (!token) {
    return res.status(401).json({
      message: "Token is missing",
    });
  }

  // reading the public key to verify token
  const publicKey = await fs.readFile(
    path.join(__dirname, "..", "..", "public.key"),
    "utf-8"
  );

  jwt.verify(token, publicKey, (err, user) => {
    if (err) {
      return res.status(403).json({
        message: "invalid token",
      });
    }
    // attaching user jwt payload to the request object
    req.user = user;
    next();
  });
}
