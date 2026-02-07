// backend/routes/payment.route.ts - FIX THE SAVE ROUTES

import { type Request, Router, type Response } from "express";
import Stripe from "stripe";
import PaymentInfoModel from "../models/payment.model.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const paymentRouter = Router();

paymentRouter.get("/", (req: Request, res: Response) => {
    res.send("This is the payment Route!");
});

paymentRouter.post("/generate-secret-key", async (req: Request, res: Response) => {
    const stripe_secret_key = process.env.STRIPE_SECRET_KEY;

    if (!stripe_secret_key) {
        console.error("PAYMENT_ERROR: SECRET_KEY IS UNDEFINED!");
        return res.status(500).json({ error: "Server configuration error: Missing Secret Key" });
    }

    try {
        const stripe = new Stripe(stripe_secret_key, {
            apiVersion: '2025-12-15.clover'
        });

        const plan = req.body;
        
        const amount = Number(plan.planPrice) * 100;

        if (isNaN(amount)) {
            return res.status(400).json({ error: "Invalid plan amount" });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            automatic_payment_methods: { enabled: true }
        });

        res.status(201).json({
            clientSecret: paymentIntent.client_secret
        });
    } catch (err: any) {
        console.error("Stripe Error:", err.message);
        res.status(405).json({
            error: err.message
        });
    }
});

// FIXED: Original save-payment route
paymentRouter.post("/save-payment", async(req: Request, res: Response) => {
    try {
        const paymentInfoObj = req.body;

        const result = await PaymentInfoModel.create(paymentInfoObj); // CHANGED from insertOne

        res.status(201).json({
            success: true,
            message: "Payment information saved!",
            registeredData: result
        });
    } catch (err) {
        console.error("Payment save error:", err);
        res.status(400).json({
            success: false,
            message: "Failed while saving payment Info!",
            error: err
        });
    }
});

// NEW: Handle subscription update payment (prorated)
paymentRouter.post("/subscription-update", verifyToken, async (req: any, res: Response) => {
    const stripe_secret_key = process.env.STRIPE_SECRET_KEY;

    if (!stripe_secret_key) {
        console.error("PAYMENT_ERROR: SECRET_KEY IS UNDEFINED!");
        return res.status(500).json({ error: "Server configuration error: Missing Secret Key" });
    }

    try {
        const stripe = new Stripe(stripe_secret_key, {
            apiVersion: '2025-12-15.clover'
        });

        const { proratedAmount, newServices, daysUntilRenewal } = req.body;
        
        // Convert to cents
        const amount = Math.round(Number(proratedAmount) * 100);

        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ error: "Invalid prorated amount" });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            automatic_payment_methods: { enabled: true },
            metadata: {
                userId: req.user.id,
                type: 'subscription_update',
                daysUntilRenewal: daysUntilRenewal.toString()
            }
        });

        res.status(201).json({
            clientSecret: paymentIntent.client_secret,
            amount: proratedAmount
        });
    } catch (err: any) {
        console.error("Stripe Error:", err.message);
        res.status(500).json({
            error: err.message
        });
    }
});

// FIXED: Save subscription update payment info
paymentRouter.post("/save-subscription-payment", verifyToken, async(req: any, res: Response) => {
    try {
        const paymentInfoObj = {
            ...req.body,
            userId: req.user.id,
            paymentType: 'subscription_update',
            paymentDate: new Date()
        };

        const result = await PaymentInfoModel.create(paymentInfoObj); // CHANGED from insertOne

        res.status(201).json({
            success: true,
            message: "Subscription payment saved!",
            data: result
        });
    } catch (err: any) {
        console.error("Payment save error:", err);
        res.status(400).json({
            success: false,
            message: "Failed to save subscription payment!",
            error: err.message || err
        });
    }
});

export default paymentRouter;