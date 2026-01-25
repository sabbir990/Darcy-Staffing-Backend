import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url'; // Required for DELETE logic in ES Modules
import { dirname } from 'path';
import Document from "../models/document.model";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const docRouter = Router();

// Storage logic
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Routes: Prefix in app.ts is "/documents", so these become /documents/ and /documents/upload
docRouter.get("/", async (req: Request, res: Response) => {
  try {
    const userId = "507f1f77bcf86cd799439011"; 
    const docs = await Document.find({ userId }).sort({ uploadedAt: -1 });
    res.json({ success: true, data: docs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

docRouter.post("/upload", upload.single("file"), async (req: Request, res: Response) => {
  try {
    const { notes } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const newDoc = await Document.create({
      userId: "507f1f77bcf86cd799439011",
      name: file.originalname,
      size: `${(file.size / 1024).toFixed(0)} KB`,
      type: path.extname(file.originalname).replace(".", "").toUpperCase() || "FILE",
      notes: notes,
      url: `/uploads/${file.filename}`, 
    });

    res.status(201).json({ success: true, data: newDoc });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add this to your doc.control.ts file
docRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 1. Find the document first to get the URL
    const doc = await Document.findById(id);
    if (!doc) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    // 2. Delete the actual file from the disk
    // doc.url is like "/uploads/123-file.png"
    const filePath = path.join(__dirname, "../..", doc.url); 
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // This deletes the physical file
    }

    // 3. Delete the record from MongoDB
    await Document.findByIdAndDelete(id);

    res.json({ success: true, message: "Document deleted successfully" });
  } catch (error: any) {
    console.error("Delete Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ... delete route

export default docRouter;