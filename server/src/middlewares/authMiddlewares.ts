import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export interface AuthRequest extends Request {
  user?: any;
}

const authMiddleware:any = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

export default authMiddleware;
