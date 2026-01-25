import { Router } from "express";
import Conversation from "../models/message.model";

const msgRouter = Router();
const MOCK_USER = "507f1f77bcf86cd799439011";

// 1. Get all conversations for the user
msgRouter.get("/", async (req, res) => {
  const convs = await Conversation.find({ userId: MOCK_USER }).sort({ updatedAt: -1 });
  res.json({ success: true, data: convs });
});

// 2. Start a new conversation (The Modal)
msgRouter.post("/new", async (req, res) => {
  const { subject, text } = req.body;
  const newConv = await Conversation.create({
    userId: MOCK_USER,
    subject,
    messages: [{ text }]
  });
  res.status(201).json({ success: true, data: newConv });
});

// 3. Add a reply to existing chat
msgRouter.post("/reply/:id", async (req, res) => {
  const { text } = req.body;
  const updated = await Conversation.findByIdAndUpdate(
    req.params.id,
    { $push: { messages: { text } } },
    { new: true }
  );
  res.json({ success: true, data: updated });
});

export default msgRouter;