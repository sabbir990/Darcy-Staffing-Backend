import { Request, Response, Router } from "express";
import userModel from "../models/user.model";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userRouter = Router();

userRouter.get("/", (req: Request, res: Response) => {
    res.send("Welcome to darcy Staffing! This is the user route!");
})

userRouter.post("/register", async (req: Request, res: Response) => {
    try {

        const userData = req.body;

        const isExists = await userModel.findOne({email : userData?.email});

        if (isExists) {
            return res.status(400).json({
                success: true,
                message: "User already exists!"
            })
        }

        const {password, ...othersData} = userData;
        const plainPassword = userData?.password;
        const salt = 10;
        const hashedPassword = bcrypt.hashSync(plainPassword, salt);

        const newUserObject = { ...othersData, password: hashedPassword };

        const result = await userModel.create(newUserObject);

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

userRouter.post("/login", async (req: Request, res: Response) => {
    try{
        const {email, password} = req.body;

        const isExists = await userModel.findOne({email});
        // const returnHashPassword = bcrypt.compareSync(password, isExists.password);

        // if(isExists & )
    }catch(err){

    }
})

export default userRouter;