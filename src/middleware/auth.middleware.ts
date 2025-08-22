import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET: string = process.env.JWT_SECRET || "mysecretkey";

interface AuthRequest extends Request {
  user?: { userId: number; role: string };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Token missing" });
    return;
  }

  try {
    // ✅ force TypeScript to know token is string
    const decoded = jwt.verify(token as string, JWT_SECRET) as JwtPayload;

    if (!decoded || typeof decoded !== "object" || !decoded.userId || !decoded.role) {
      res.status(403).json({ message: "Invalid token payload" });
      return;
    }

    req.user = {
      userId: decoded.userId as number,
      role: decoded.role as string,
    };

    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: "Forbidden: You don’t have permission" });
      return;
    }

    next();
  };
};
