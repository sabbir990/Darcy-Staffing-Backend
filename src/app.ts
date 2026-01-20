import express, { Request, Response, type Application } from "express";
import userRouter from "./app/controls/user.control";
import cors from "cors";

const app: Application = express();
app.use(express.json())
app.use(cors({
     origin: ['http://localhost:5173', 'https://darcystaffingfrontend.vercel.app'],
     credentials: true,
     methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH']
}))

app.use('/user', userRouter)

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to darcy staffing backend!");
});

export default app;