import { Router } from "express";
import Conversation from "../models/message.model.js";

const msgRouter = Router();
const MOCK_USER = "507f1f77bcf86cd799439011";

// 1. Get all conversations for the user
msgRouter.get("/", async (req, res) => {
  const convs = await Conversation.find({ userId: MOCK_USER }).sort({ updatedAt: -1 });
  res.json({ success: true, data: convs });
});

// 2. Start a new conversation (The Modal)
msgRouter.post("/new", async (req, res) => {
  const { subject, text, sender } = req.body;
  const newConv = await Conversation.create({
    userId: MOCK_USER,
    subject,
    lastSender: sender || "Staff",
    messages: [{ 
      text, 
      sender: sender || "Staff" 
    }]
  });
  res.status(201).json({ success: true, data: newConv });
});

// 3. Add a reply (USE ONLY THIS VERSION)
msgRouter.post("/reply/:id", async (req, res) => {
  const { text, sender } = req.body;
  const updated = await Conversation.findByIdAndUpdate(
    req.params.id,
    { 
      $push: { messages: { text, sender, time: new Date() } },
      $set: { lastSender: sender } 
    },
    { new: true }
  );
  res.json({ success: true, data: updated });
});

export default msgRouter;