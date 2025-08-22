
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import client from "../config/db.config";

const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";

// LOGIN ONLY
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const { rows } = await client.query(
      "SELECT * FROM userdetail WHERE email = $1",
      [email]
    );

    if (rows.length === 0) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err });
  }
};
