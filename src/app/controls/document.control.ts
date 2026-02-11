import { Router } from "express";
import multer from "multer";
import Document from "../models/document.model.js";
import userModel from "../models/user.model.js";

const docRouter = Router();
const upload = multer({ dest: "uploads/" }); // Files will go here

// 1. GET ALL DOCUMENTS
docRouter.get("/", async (req, res) => {
  try {
    const { email } = req.query; // We will pass the email as a query param

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required to filter documents" });
    }

    // First, find the User associated with that email
    // Note: Ensure you import your User model at the top
    const user = await userModel.findOne({ email }); 

    if (!user) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    // Now find only the documents belonging to that User's ID
    const docs = await Document.find({ userId: user._id }).sort({ createdAt: -1 });
    
    res.json({ success: true, data: docs });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
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