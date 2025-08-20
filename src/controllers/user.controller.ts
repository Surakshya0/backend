import { Request, Response } from "express";
import client from "../config/db.config";

//  GET all users
export const getAllUsers = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const { rows, rowCount } = await client.query("SELECT * FROM userdetail");
    return res.status(200).json({
      msg: "Users fetched successfully",
      users: rows,
      totalCount: rowCount,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Database query failed" });
  }
};

//  ADD user
export const addUser = async (req: Request, res: Response): Promise<Response> => {
  const { username, address, contact, email, dob, gender, role, password } = req.body;

  try {
    const { rows } = await client.query(
      `INSERT INTO userdetail (username, address, contact, email, dob, gender, role, password) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [username, address, contact, email, dob, gender, role, password]
    );

    return res.status(201).json({ msg: "User added successfully", user: rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Insert failed" });
  }
};

//  UPDATE user
export const updateUser = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { username, address, contact, email, dob, gender, role, password } = req.body;

  try {
    const { rows } = await client.query(
      `UPDATE userdetail 
       SET username=$1, address=$2, contact=$3, email=$4, dob=$5, gender=$6, role=$7, password=$8 
       WHERE id=$9 RETURNING *`,
      [username, address, contact, email, dob, gender, role, password, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    return res.status(200).json({ msg: "User updated successfully", user: rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Update failed" });
  }
};

//  DELETE user
export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  try {
    const { rows } = await client.query("DELETE FROM userdetail WHERE id=$1 RETURNING *", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    return res.status(200).json({ msg: "User deleted successfully", user: rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Delete failed" });
  }
};
