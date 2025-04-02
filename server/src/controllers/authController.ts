import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User, { IUser } from "../models/User";

const generateToken = (userId: string, res: Response) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const register:any = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user: any = await User.create({ name, email, password: hashedPassword });

    generateToken(user._id.toString(), res);
    res.status(201).json({ message: "User registered", user: { id: user._id, name, email } });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const login:any = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    generateToken(user._id.toString(), res);
    res.status(200).json({ message: "Login successful", user: { id: user._id, name: user.username, email } });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};
