import app from "../src/app.js";
import mongoose from "mongoose";
import { VercelRequest, VercelResponse } from '@vercel/node';

const mongoDB_connection_string: string = process.env.MONGODB_CONNECTION_STRING as string;

let isConnected = false;

async function connectDB() {
  if (isConnected) {
    return;
  }
  
  try {
    await mongoose.connect(mongoDB_connection_string);
    isConnected = true;
    console.log("MongoDB connected!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await connectDB();
  return app(req, res);
}