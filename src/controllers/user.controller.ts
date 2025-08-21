import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import client from "../config/db.config";

// Enums
type Gender = "Male" | "Female" | "Other";
type Role = "Admin" | "User" | "Guest";

// DTO
interface UserInput {
  username: string;
  address: string;
  contact: string;
  email: string;
  dob: string;
  gender: Gender;
  role: Role;
  password: string;
}

//  GET all users with pagination (3 per page)
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 3;
    const offset = (page - 1) * limit;

    const totalResult = await client.query("SELECT COUNT(*) FROM userdetail");
    const totalCount = parseInt(totalResult.rows[0].count);

    const { rows } = await client.query(
      "SELECT * FROM userdetail ORDER BY id LIMIT $1 OFFSET $2",
      [limit, offset]
    );

    return res.status(200).json({
      msg: "Users fetched successfully",
      users: rows,
      pagination: {
        totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Database query failed" });
  }
};

//  ADD user
export const addUser = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { username, address, contact, email, dob, gender, role, password }: UserInput =
    req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const { rows } = await client.query(
      `INSERT INTO userdetail (username, address, contact, email, dob, gender, role, password) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [username, address, contact, email, dob, gender, role, hashedPassword]
    );

    return res
      .status(201)
      .json({ msg: "User added successfully", user: rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Insert failed" });
  }
};

// UPDATE user
export const updateUser = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { id } = req.params;
  const { username, address, contact, email, dob, gender, role, password }: UserInput =
    req.body;

  try {
    let hashedPassword = password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const { rows } = await client.query(
      `UPDATE userdetail 
       SET username=$1, address=$2, contact=$3, email=$4, dob=$5, gender=$6, role=$7, password=$8 
       WHERE id=$9 RETURNING *`,
      [username, address, contact, email, dob, gender, role, hashedPassword, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    return res
      .status(200)
      .json({ msg: "User updated successfully", user: rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Update failed" });
  }
};

// DELETE user
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { id } = req.params;

  try {
    const { rows } = await client.query(
      "DELETE FROM userdetail WHERE id=$1 RETURNING *",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    return res
      .status(200)
      .json({ msg: "User deleted successfully", user: rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Delete failed" });
  }
};
