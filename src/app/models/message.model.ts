import mongoose, { Schema, Document } from "mongoose";

const MessageSchema = new Schema({
  text: { type: String, required: true },
  sender: { type: String, default: "Client" }, // Or 'Staff'
  time: { type: Date, default: Date.now }
});

const ConversationSchema = new Schema({
  userId: { type: String, required: true }, // The mock ID you've been using
  subject: { type: String, required: true },
  messages: [MessageSchema] // This is the array of chats
}, { timestamps: true });

export default mongoose.model("Conversation", ConversationSchema);