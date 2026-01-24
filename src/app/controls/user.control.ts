import { Request, Response, Router } from "express";
import { User } from "../interface/user.interface";
import userModel from "../models/user.model";

const userRouter = Router();

userRouter.get("/", (req: Request, res: Response) => {
    res.send("Welcome to darcy Staffing! This is the user route!");
})

userRouter.post("/register", async (req: Request, res: Response) => {
    try {

        const userData = req.body;

        const isExists = await userModel.findOne(userData?.email);

        if (isExists) {
            return res.status(400).json({
                success: true,
                message: "User already exists!"
            })
        }

        const result = await userModel.insertOne(userData);

        res.status(201).json({
            success: true,
            message: "Registration Completed!",
            registeredData: result
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            message: "Registration Failed!",
            error: err
        })
    }
})



export default userRouter;