import express, { Request, Response, type Application, Router } from "express";

const app: Application = express();

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to darcy staffing backend!");
});

export default app;