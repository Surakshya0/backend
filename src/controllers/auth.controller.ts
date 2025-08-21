import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import client from "../config/db.config"; 

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"; // yo chai stored in .env 

//  Login Controller
export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

     // 1. yeta chai lets check if user exists
    const { rows } = await client.query(
      "SELECT * FROM userdetail WHERE email = $1",
      [email]
    );
    const user = rows[0];
      //exist gardaina vanechai 
    if (!user) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // 2. aba lets compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // 3. lets generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" } // token chai only valid for 1 hour
    );

    // 4. Send response (excluding password)
    
    const { password: _, ...userData } = user;

    return res.status(200).json({
      msg: " Yayy Login successful",
      user: userData,
      accessToken: token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Shi.. Login failed" });
  }
};


