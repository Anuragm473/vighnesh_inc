import express from "express";
import { shortenUrl, redirectUrl, getUserUrls } from "../controllers/urlController";
import authMiddleware from "../middlewares/authMiddlewares";

const router = express.Router();

router.post("/shorten", authMiddleware, shortenUrl); // Shorten URL
router.get("/redirect/:shortUrl", redirectUrl); // Redirect short URL
router.get("/user/urls", authMiddleware, getUserUrls); // Get user URLs

export default router;
