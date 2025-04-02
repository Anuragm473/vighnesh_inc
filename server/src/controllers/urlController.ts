import { Request, Response } from "express";
import shortid from "shortid";
import qrcode from "qrcode";
import Url from "../models/Url";
import {AuthRequest} from "../middlewares/authMiddlewares";


export const shortenUrl:any = async (req: AuthRequest, res: Response) => {
    try {
        const { originalUrl, name } = req.body;
        const shortUrl = name;
    
        // Check if a URL with the same shortUrl already exists
        const existingUrl = await Url.findOne({ shortUrl });
        if (existingUrl) {
          return res.status(400).json({ message: "Short URL name already taken. Please choose another." });
        }
    
        // Generate QR code
        const qrCode = await qrcode.toDataURL(originalUrl);
    
        // Save new URL entry
        const url = new Url({ originalUrl, shortUrl, qrCode, userId: req.user.id });
        await url.save();
    
        res.json(url);
      } catch (error) {
        console.error("Error shortening URL:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
};

export const redirectUrl:any= async (req: Request, res: Response) => {
    try {
      const { shortUrl } = req.params;
  
      const urlData= await Url.findOne({ shortUrl });
      if (!urlData) {
        return res.status(404).json({ message: "URL not found" });
      }
  
      urlData.visits += 1; // Increase visit count
      await urlData.save();
  
      res.send(urlData.originalUrl);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };
  

  export const getUserUrls = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
  
      const urls = await Url.find({ userId });
  
      res.status(200).json({ urls });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };
  
