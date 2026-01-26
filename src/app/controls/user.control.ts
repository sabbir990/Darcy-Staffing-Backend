import { Request, Response, Router, NextFunction } from "express";
import userModel from "../models/user.model";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { verifyToken } from "../middlewares/auth.middleware";

const userRouter = Router();

userRouter.get("/", (req: Request, res: Response) => {
    res.send("Welcome to darcy Staffing! This is the user route!");
})

userRouter.post("/register", async (req: Request, res: Response) => {
    try {

        const userData = req.body;

        const isExists = await userModel.findOne({ email: userData?.email });

        if (isExists) {
            return res.status(400).json({
                success: true,
                message: "User already exists!"
            })
        }

        const { password, ...othersData } = userData;
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
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).lean();

        if (!user || !user.password) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            return res.status(401).json({ success: false, message: "Invalid credentials!" });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Access Denied! You are not authorized as an admin."
            });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            (process.env.JWT_SECRET as string) || 'default_secret',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            success: true,
            message: "Login successful!",
            token,
            user: { id: user._id, email: user.email, role: user.role }
        });

    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err });
    }
});

userRouter.post("/clogin", async (req: Request, res: Response) => {
    try {
        const { identifier, password } = req.body;

        // Username Or Email 
        const user = await userModel.findOne({
            $or: [
                { email: identifier },
                { username: identifier }
            ]
        }).lean();

        if (!user || !user.password) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            return res.status(401).json({ success: false, message: "Invalid credentials!" });
        }

        // Role Check
        if (user.role !== 'client') {
            return res.status(403).json({
                success: false,
                message: "Access Denied! Only clients can access this portal."
            });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            (process.env.JWT_SECRET as string) || 'default_secret',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            success: true,
            message: "Login successful!",
            token,
            user: { id: user._id, email: user.email, role: user.role, username: user.username }
        });

    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err });
    }
});

userRouter.get("/profile", verifyToken, async (req: any, res: Response) => {
    try {
        // req.user.id comes from the middleware
        const user = await userModel.findById(req.user.id).select("-password").lean();

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        res.status(200).json({
            success: true,
            data: user // This will contain contractorType, packagePrice, etc.
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err });
    }
});

userRouter.put("/update-profile", verifyToken, async (req: any, res: Response) => {
    try {
        // req.user.id comes from your verifyToken middleware
        const userId = req.user.id;
        const updateData = req.body;

        // Prevent users from manually changing their role or email through this route for security
        delete updateData.role;
        delete updateData.password; 

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found!" 
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully!",
            data: updatedUser
        });
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: "Failed to update profile", 
            error: err 
        });
    }
});

export default userRouter;