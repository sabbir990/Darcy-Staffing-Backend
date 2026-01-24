import { type Request, Router, type Response } from "express";
import Stripe from "stripe";
import PaymentInfoModel from "../models/payment.model";

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

        const plan  = req.body; 
        
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

paymentRouter.post("/save-payment", async(req: Request, res: Response) => {
    try{
        const paymentInfoObj = req.body;

        const result = await PaymentInfoModel.insertOne(paymentInfoObj);

        res.status(201).json({
            success: true,
            message: "Payment information saved!",
            registeredData: result
        })
    }catch(err){
        res.status(400).json({
            success: false,
            message: "Failed while saving payment Info!",
            error: err
        })
    }
})

export default paymentRouter;