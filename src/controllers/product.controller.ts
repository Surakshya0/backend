import { Request, Response } from "express";
import client from "../config/db.config";

// Create product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price } = req.body;
    const user = (req as any).user;

    const { rows } = await client.query(
      `INSERT INTO products (name, description, price, user_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, description, price, user?.userId || null]
    );

    return res.status(201).json({ msg: "Product created successfully", product: rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get all products (optional: only user’s products)
export const getProducts = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { rows } = await client.query(
      `SELECT * FROM products WHERE user_id = $1`,
      [user?.userId]
    );

    return res.status(200).json({ products: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Update product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;
    const user = (req as any).user;

    // Ensure user owns the product or is Admin
    const { rows: existing } = await client.query(
      `SELECT * FROM products WHERE id = $1`,
      [id]
    );

    if (!existing[0]) return res.status(404).json({ msg: "Product not found" });
    if (existing[0].user_id !== user.userId && user.role !== "Admin")
      return res.status(403).json({ msg: "Forbidden" });

    const { rows } = await client.query(
      `UPDATE products SET name=$1, description=$2, price=$3 WHERE id=$4 RETURNING *`,
      [name || existing[0].name, description || existing[0].description, price || existing[0].price, id]
    );

    return res.status(200).json({ msg: "Product updated", product: rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Delete product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;

    // Ensure user owns the product or is Admin
    const { rows: existing } = await client.query(
      `SELECT * FROM products WHERE id = $1`,
      [id]
    );

    if (!existing[0]) return res.status(404).json({ msg: "Product not found" });
    if (existing[0].user_id !== user.userId && user.role !== "Admin")
      return res.status(403).json({ msg: "Forbidden" });

    await client.query(`DELETE FROM products WHERE id = $1`, [id]);
    return res.status(200).json({ msg: "Product deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
};
