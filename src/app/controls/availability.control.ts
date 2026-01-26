import { Router, Request, Response } from "express";
import Availability from "../models/availablity.model.js";
import mongoose from 'mongoose';

const interviewRouter = Router();

// const MOCK_ID = "65b2f1e1f1e1f1e1f1e1f1e1"; // A valid hex string

interviewRouter.get("/:date", async (req: Request, res: Response) => {
    try {
        const { date } = req.params;
        const userId = (req as any).user?.id || "507f1f77bcf86cd799439011";
        const result = await Availability.findOne({ userId, date });

        // Always return a structure that matches IAvailability
        res.status(200).json({
            success: true,
            data: result || { userId, date, slots: [] }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

interviewRouter.post("/save", async (req: Request, res: Response) => {
    try {
        const { date, slots } = req.body;
        const validHexId = "507f1f77bcf86cd799439011";
        const userId = (req as any).user?.id || validHexId;
        const objectUserId = new mongoose.Types.ObjectId(userId);

        // FIX: Use 'as any' on the filter object or explicitly type the filter
        const result = await Availability.findOneAndUpdate(
            { userId: objectUserId, date } as any, // Adding 'as any' here bypasses the strict Query check
            { slots },
            { upsert: true, new: true, runValidators: true }
        );

        res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        console.error("Mongoose Save Error:", error.message);
        res.status(400).json({ success: false, message: error.message });
    }
});

interviewRouter.get("/month/:yearMonth", async (req: Request, res: Response) => {
    try {
        const { yearMonth } = req.params; // e.g. "2026-01"
        const userId = (req as any).user?.id || "507f1f77bcf86cd799439011";

        // Find all records where the date string starts with "2026-01"
        const data = await Availability.find({ 
            userId, 
            date: { $regex: new RegExp(`^${yearMonth}`) } 
        });

        res.status(200).json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

interviewRouter.post("/book", async (req: Request, res: Response) => {
    try {
        const { date, time, clientName, clientPhone, clientEmail } = req.body;
        const userId = (req as any).user?.id || "507f1f77bcf86cd799439011";

        const availability = await Availability.findOne({ userId, date });
        if (!availability) {
            return res.status(404).json({ success: false, message: "No availability found for this date" });
        }

        // Find the specific slot and update it
        const slot = availability.slots.find(s => s.time === time);
        if (!slot) {
            return res.status(404).json({ success: false, message: "Time slot not found" });
        }

        slot.status = 'Booked';
        slot.clientName = clientName;
        slot.clientPhone = clientPhone;
        // Note: You might want to add clientEmail to your ISlot interface/model too

        await availability.save();
        res.status(200).json({ success: true, data: availability });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default interviewRouter;