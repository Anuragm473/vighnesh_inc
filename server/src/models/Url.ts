import mongoose from "mongoose";

export interface IUrl extends Document {
  originalUrl: string;
  shortUrl: string;
  userId: mongoose.Schema.Types.ObjectId;
  visits: number;
  qrCode:string
}


const UrlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  qrCode: { type: String }, // QR Code URL
  visits: { type: Number, default: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model("Url", UrlSchema);
