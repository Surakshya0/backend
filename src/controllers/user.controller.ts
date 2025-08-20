import { Request, Response } from "express";
import client from "../config/db.config"; // 👈 removed `.js`

// GET all users
export const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
  console.log("Get request received", req.query);
  try {
    const { rows, rowCount } = await client.query("SELECT * FROM userdetail");
    return res.status(200).json({
      msg: "User fetched successfully",
      user: rows,
      totalCount: rowCount,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Database query failed" });
  }
};

// ADD a new user
export const addUser = async (req: Request, res: Response): Promise<Response> => {
  const { username, address, contact, email } = req.body as {
    username: string;
    address: string;
    contact: string;
    email: string;
  };

  try {
    const { rows } = await client.query(
      "INSERT INTO userdetail (username, address, contact, email) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, address, contact, email]
    );
    return res.status(200).json({ msg: "User added successfully", user: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Insert failed" });
  }
};

// UPDATE user
export const updateUser = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { username, address, contact, email } = req.body as {
    username: string;
    address: string;
    contact: string;
    email: string;
  };

  try {
    const { rows } = await client.query(
      "UPDATE userdetail SET username=$1, address=$2, contact=$3, email=$4 WHERE id=$5 RETURNING *",
      [username, address, contact, email, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    return res.status(200).json({
      msg: "User updated successfully",
      user: rows[0],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Update failed" });
  }
};

// DELETE user
export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  try {
    // Check if user exists
    const userExist = await client.query("SELECT * FROM userdetail WHERE id=$1", [id]);

    if (!userExist || userExist.rows.length < 1) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Delete user
    const { rows } = await client.query(
      "DELETE FROM userdetail WHERE id=$1 RETURNING *",
      [id]
    );

    return res.status(200).json({
      msg: "User deleted successfully",
      user: rows[0],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Delete failed" });
  }
};