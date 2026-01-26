import express, { Request, Response, type Application } from "express";
import userRouter from "./app/controls/user.control.js";
import cors from "cors";
import dotenv from "dotenv";
import path from "path"; // Added for path resolution
import paymentRouter from "./app/controls/payment.control.js";
import interviewRouter from "./app/controls/availability.control.js";
import docRouter from "./app/controls/doc.control.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import msgRouter from "./app/controls/message.control.js";
import clientRouter from "./app/router/client.router.js";
import applicantRouter from "./app/controls/applicants.controls.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
const app: Application = express();

app.use(express.json());
app.use(cors({
     origin: ['http://localhost:5173', 'https://darcystaffingfrontend.vercel.app'],
     credentials: true,
     methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH']
}));

/**
 * STATIC FILE SERVING
 * This allows the frontend to access files via http://localhost:PORT/uploads/filename.ext
 */
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --- Routing Redirection ---
app.use('/user', userRouter);
app.use("/payment", paymentRouter);
app.use("/schedule-interview", interviewRouter);
app.use("/documents", docRouter); // Added the document management route
app.use("/messages", msgRouter);
app.use("/client", clientRouter);
app.use("/applicants", applicantRouter);

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to darcy staffing backend!");
});

export default app;