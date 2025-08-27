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

//  GET all users with pagination ra search
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { search } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 3; // default 3 per page
    const offset = (page - 1) * limit;

    // Base query
    let whereClause = "";
    const values: any[] = [];

    if (search) {
      whereClause = `WHERE username ILIKE $1 OR email ILIKE $1`;
      values.push(`%${search}%`);
    }

    // Count query (for pagination )
    const countQuery = `
      SELECT COUNT(*) FROM userdetail
      ${whereClause};
    `;
    const countResult = await client.query(countQuery, values);
    const totalCount = parseInt(countResult.rows[0].count);

    // Data query
    const userQuery = `
      SELECT * FROM userdetail
      ${whereClause}
      ORDER BY id ASC
      LIMIT $${values.length + 1} OFFSET $${values.length + 2};
    `;
    values.push(limit, offset);

    const { rows } = await client.query(userQuery, values);

    return res.status(200).json({
      msg: "Users fetched successfully",
      users: rows,
      pagination: {
        totalCount, // filtered correctly current page ma jati cha teti dekhaucha
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
  const {
    username,
    address,
    contact,
    email,
    dob,
    gender,
    role,
    password,
  }: UserInput = req.body;

  try {
    // Validate required fields (must be non-empty strings)
    const missing: string[] = [];
    if (typeof username !== "string" || username.trim() === "") missing.push("username");
    if (typeof email !== "string" || email.trim() === "") missing.push("email");
    if (typeof password !== "string" || password.trim() === "") missing.push("password");

    if (missing.length > 0) {
      return res
        .status(400)
        .json({ error: `${missing.join(", ")} ${missing.length === 1 ? "is" : "are"} required` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { rows } = await client.query(
      `INSERT INTO userdetail (username, address, contact, email, dob, gender, role, password) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, username, address, contact, email, dob, gender, role`,
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
  const {
    username,
    address,
    contact,
    email,
    dob,
    gender,
    role,
    password,
  }: Partial<UserInput> = req.body;

  try {
    // Fetch existing user to preserve current password if not updating it
    const existingUserResult = await client.query(
      `SELECT password FROM userdetail WHERE id=$1`,
      [id]
    );

    if (existingUserResult.rows.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    let hashedPassword = existingUserResult.rows[0].password as string;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const { rows } = await client.query(
      `UPDATE userdetail 
       SET username=$1, address=$2, contact=$3, email=$4, dob=$5, gender=$6, role=$7, password=$8 
       WHERE id=$9
       RETURNING id, username, address, contact, email, dob, gender, role`,
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

