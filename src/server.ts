import app from "./app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;
const mongoDB_connection_string: string = process.env.MONGODB_CONNECTION_STRING as string;

async function main() {
  try {
    await mongoose.connect(mongoDB_connection_string);
    console.log("MongoDB connected!");
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Error starting server:", err);
  }
}

main();