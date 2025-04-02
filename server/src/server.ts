import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import urlRoutes from "./routes/urlRoutes";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser()); // Parse cookies
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true })); // Allow credentials
app.use(helmet());

// Rate limiter to prevent abuse
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

app.use("/api/auth", authRoutes);
app.use("/api/url", urlRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
