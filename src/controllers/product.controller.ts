import { Request, Response } from "express";
import client from "../config/db.config";


//  CREATE Product

export const addProduct = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, description, price } = req.body;
    const userId = (req as any).user.id; // from JWT middleware

    if (!name || !price) {
      return res.status(400).json({ msg: "Name and price are required" });
    }

    const { rows } = await client.query(
      `INSERT INTO product (name, description, price, user_id) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, description, price, userId]
    );

    return res.status(201).json({
      msg: "Product created successfully",
      product: rows[0],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Failed to create product" });
  }
};


//  GET All Products (public)

export const getAllProducts = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const { rows } = await client.query(
      `SELECT p.*, u.username 
       FROM product p
       JOIN userdetail u ON p.user_id = u.id
       ORDER BY p.id ASC`
    );

    return res.status(200).json({
      msg: "Products fetched successfully",
      products: rows,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Failed to fetch products" });
  }
};


//  GET Logged-in User’s Products

export const getMyProducts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = (req as any).user.id;

    const { rows } = await client.query(
      `SELECT * FROM product WHERE user_id = $1 ORDER BY id ASC`,
      [userId]
    );

    return res.status(200).json({
      msg: "Your products fetched successfully",
      products: rows,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Failed to fetch user products" });
  }
};


//  UPDATE Product (only owner)

export const updateProduct = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;
    const userId = (req as any).user.id;

    const { rows } = await client.query(
      `UPDATE product 
       SET name = $1, description = $2, price = $3 
       WHERE id = $4 AND user_id = $5 
       RETURNING *`,
      [name, description, price, id, userId]
    );

    if (rows.length === 0) {
      return res.status(403).json({ msg: "Not authorized or product not found" });
    }

    return res.status(200).json({
      msg: "Product updated successfully",
      product: rows[0],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Failed to update product" });
  }
};


//  DELETE Product (only owner)

export const deleteProduct = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const { rows } = await client.query(
      `DELETE FROM product 
       WHERE id = $1 AND user_id = $2 
       RETURNING *`,
      [id, userId]
    );

    if (rows.length === 0) {
      return res.status(403).json({ msg: "Not authorized or product not found" });
    }

    return res.status(200).json({
      msg: "Product deleted successfully",
      product: rows[0],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Failed to delete product" });
  }
};
