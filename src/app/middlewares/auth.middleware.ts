import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

// app/middleware/auth.middleware.ts
export const verifyToken = (req: any, res: Response, next: NextFunction) => {
    // Look for "Bearer <token>"
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
        req.user = decoded; 
        next();
    } catch (err) {
        return res.status(403).json({ success: false, message: "Invalid token" });
    }
};