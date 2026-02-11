import { Router } from "express";
import Conversation from "../models/message.model.js";
import User from "../models/user.model.js";

const msgRouter = Router();

// Helper to find user by email to retrieve their unique _id
const findUserByEmail = async (email: string) => {
  return await (User as any).findOne({
    email: { $regex: new RegExp(`^${email.trim()}$`, "i") }
  });
};

// 1. CLIENT GET: Fetch messages based on the ID linked to their email
msgRouter.get("/my-messages", async (req, res) => {
  try {
    const email = req.headers['x-user-email'] as string;

    if (!email) {
      return res.status(401).json({ success: false, message: "No email provided in headers" });
    }

    const clientUser = await findUserByEmail(email);
    if (!clientUser) {
      return res.status(404).json({ success: false, message: "User account not found" });
    }

    // We query by userId (the string ID from the User model)
    const convs = await Conversation.find({ userId: clientUser._id }).sort({ updatedAt: -1 });
    res.json({ success: true, data: convs });
  } catch (err) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// backend/routes/messages.js (or similar)
msgRouter.post("/new", async (req, res) => {
  try {
    const { subject, text, sender, email: bodyEmail } = req.body;
    const headerEmail = req.headers['x-user-email'] as string;
    const targetEmail = bodyEmail || headerEmail;

    if (!targetEmail) {
      return res.status(400).json({ success: false, message: "No email provided" });
    }

    // Find the user to get their actual MongoDB _id
    const clientUser = await User.findOne({
      email: { $regex: new RegExp(`^${targetEmail.trim()}$`, "i") }
    });

    if (!clientUser) {
      console.error(`User not found for email: ${targetEmail}`);
      return res.status(404).json({ success: false, message: "User account does not exist" });
    }

    const newConv = await Conversation.create({
      userId: clientUser._id.toString(), // Ensure this is a string as per your model
      subject,
      lastSender: sender || "Client",
      isRead: false,
      status: "open",
      messages: [{ text, sender: sender || "Client", time: new Date() }]
    });

    res.status(201).json({ success: true, data: newConv });
  } catch (err: any) {
    console.error("New Message Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. REPLY: Adds a message to the existing thread
msgRouter.post("/reply/:id", async (req, res) => {
  try {
    const { text, sender } = req.body;
    const updated = await Conversation.findByIdAndUpdate(
      req.params.id,
      {
        $push: { messages: { text, sender, time: new Date() } },
        $set: {
          lastSender: sender,
          isRead: false,
          updatedAt: new Date()
        }
      },
      { new: true }
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

export default msgRouter;