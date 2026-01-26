import mongoose, { Schema, Document } from "mongoose";

const MessageSchema = new Schema({
  text: { type: String, required: true },
  sender: { type: String, default: "Client" }, // Or 'Staff'
  time: { type: Date, default: Date.now }
});

const ConversationSchema = new Schema({
  userId: { type: String, required: true },
  subject: { type: String, required: true },
  messages: [MessageSchema],
  lastSender: { type: String }, // Track who sent the last message
  status: { type: String, default: "open" }, // open, closed, or pending
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Conversation", ConversationSchema);