import { Request, Response, Router } from "express";
import { user } from "../interface/user.interface";

const userRouter = Router();

userRouter.get("/", (req: Request, res: Response) => {
    res.send("Welcome to darcy Staffing! This is the user route!");
})

userRouter.post("/register", (req: Request, res: Response) => {
    const userData: user = req.body;

    console.log(userData);
})

export default userRouter;