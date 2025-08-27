import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "xyz");
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ msg: "Invalid token" });
  }
};

export const authorize = (roles: string[]) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ): void | Response => {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({ msg: "Forbidden: insufficient permissions" });
    }

    next();
  };
};
