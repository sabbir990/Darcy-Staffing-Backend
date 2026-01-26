import { Router } from "express";
import multer from "multer";
import Document from "../models/document.model.js";

const docRouter = Router();
const upload = multer({ dest: "uploads/" }); // Files will go here

// 1. GET ALL DOCUMENTS
docRouter.get("/", async (req, res) => {
  const userId = "507f1f77bcf86cd799439011"; // Use your mock ID for now
  const docs = await Document.find({ userId }).sort({ createdAt: -1 });
  res.json({ success: true, data: docs });
});

// 2. UPLOAD DOCUMENT
docRouter.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { notes } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const newDoc = await Document.create({
      userId: "507f1f77bcf86cd799439011",
      name: file.originalname,
      size: `${(file.size / 1024).toFixed(0)} KB`,
      type: file.mimetype.split("/")[1].toUpperCase(),
      notes: notes,
      url: `/uploads/${file.filename}` // In production, this would be an S3 URL
    });

    res.status(201).json({ success: true, data: newDoc });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default docRouter;