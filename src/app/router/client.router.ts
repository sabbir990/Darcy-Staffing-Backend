import { Request, Response, Router } from "express";
import clientModel from "../models/client.model.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const clientRouter = Router();

// GET all clients (for the dashboard)
clientRouter.get("/all", verifyToken, async (req: Request, res: Response) => {
    try {
        const clients = await clientModel.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: clients
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to fetch clients", error: err });
    }
});

// POST register a new client
clientRouter.post("/add", verifyToken, async (req: Request, res: Response) => {
    try {
        const d = req.body; // Using d for brevity

        const newClientObject = {
            company: {
                name: d.companyName,
                status: d.status ? d.status.toLowerCase() : "active",
                contact: {
                    email: d.email,
                    phone: d.phone,
                },
                registrationDate: new Date().toLocaleDateString('en-US'),
                fedexId: d.fedexId,
                address: {
                    street: d.address,
                    city: d.city,
                    state: d.state,
                    zip: d.zip
                }
            },
            resourceDetails: {
                title: d.package || "General",
                applicants: 0,
                interviews: 0,
            }
        };

        const result = await clientModel.create(newClientObject);
        res.status(201).json({ success: true, data: result });
    } catch (err) {
        res.status(400).json({ success: false, error: err });
    }
});

export default clientRouter;