import { Router, Request, Response } from "express";
import Applicant from "../models/applicants.model.js"; // Ensure this path matches your model location
import mongoose from 'mongoose';

const applicantRouter = Router();

// GET all applicants or filter by client
applicantRouter.get("/all", async (req: Request, res: Response) => {
    try {
        const { clientId } = req.query;
        // If clientId is provided, filter by it, otherwise get all
        const filter = clientId ? { clientId } : {};
        
        const data = await Applicant.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: data || []
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST save or update applicant
applicantRouter.post("/save", async (req: Request, res: Response) => {
    try {
        const applicantData = req.body;
        
        // Ensure medCard and profileId are being passed from req.body
        const newApplicant = new Applicant({
            ...applicantData,
            // If medCard isn't provided, default to Awaiting
            medCard: applicantData.medCard || 'Awaiting'
        });
        
        const result = await newApplicant.save();
        res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                message: "One order ID is applicable for one client. This ID is already in use." 
            });
        }
        res.status(400).json({ success: false, message: error.message });
    }
});

export default applicantRouter;