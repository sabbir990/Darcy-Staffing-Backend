// backend/router/client.router.ts - COMPLETE VERSION

import { Request, Response, Router } from "express";
import clientModel from "../models/client.model.js";
import userModel from "../models/user.model.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import timeLogModel from "../models/timeLog.model.js";
import mongoose from "mongoose";

const clientRouter = Router();

// GET all clients (for the dashboard)
clientRouter.get("/all", verifyToken, async (req: Request, res: Response) => {
    try {
        const clientsWithTime = await clientModel.aggregate([
            // 1. Join with TimeLogs collection
            {
                $lookup: {
                    from: "timelogs", // This must match your MongoDB collection name (usually lowercase plural)
                    localField: "_id",
                    foreignField: "clientId",
                    as: "timeData"
                }
            },
            // 2. Sum up the totalSeconds from the array of timeData
            {
                $addFields: {
                    totalTimeSpent: { $sum: "$timeData.totalSeconds" },
                    // Also get the most recent access date
                    lastAccessed: { $max: "$timeData.lastAccessed" }
                }
            },
            // 3. Remove the raw timeData array to keep the response clean
            {
                $project: {
                    timeData: 0
                }
            },
            // 4. Sort by most recently created client first
            {
                $sort: { createdAt: -1 }
            }
        ]);

        res.status(200).json({
            success: true,
            data: clientsWithTime
        });
    } catch (err) {
        console.error("Aggregation Error:", err);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch clients with time data", 
            error: err 
        });
    }
});

// GET single client by ID
clientRouter.get("/:id", verifyToken, async (req: Request, res: Response) => {
    try {
        const client = await clientModel.findById(req.params.id);

        if (!client) {
            return res.status(404).json({
                success: false,
                message: "Client not found"
            });
        }

        res.status(200).json({
            success: true,
            data: client
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch client",
            error: err
        });
    }
});

// backend/router/client.router.ts - UPDATE ONLY THE /add ROUTE

clientRouter.post("/add", verifyToken, async (req: Request, res: Response) => {
    try {
        const d = req.body;

        // Determine package price based on package type
        const packagePrice = d.package === "Linehaul Resourcing" ? 1000 : 800;

        const newClientObject = {
            company: {
                name: d.companyName,
                status: d.status ? d.status.toLowerCase() : "active",
                contact: {
                    email: d.email,
                    phone: d.phone,
                    name: d.contactName || ""
                },
                registrationDate: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
                fedexId: d.fedexId || "",
                address: {
                    street: d.address || "",
                    city: d.city || "",
                    state: d.state || "",
                    zip: d.zip || ""
                }
            },
            resourceDetails: {
                title: d.package || "P&D Resourcing",
                packagePrice: packagePrice,
                applicants: 0,
                interviews: 0,
            },
            activeServices: [], // Empty initially
            terminals: d.terminals || "",
            startDate: d.startDate || new Date().toISOString(),
            nextBillingDate: (() => {
                const date = new Date();
                date.setDate(date.getDate() + 30);
                return date.toISOString();
            })(),
            paymentMethod: {
                last4: "4242",
                brand: "Visa"
            },
            formData: {} // Will be populated when user completes registration
        };

        const result = await clientModel.create(newClientObject);

        res.status(201).json({
            success: true,
            message: "Client added successfully!",
            data: result
        });
    } catch (err) {
        console.error("Error creating client:", err);
        res.status(400).json({
            success: false,
            message: "Failed to add client",
            error: err
        });
    }
});

// PUT update client status
clientRouter.put("/:id/status", verifyToken, async (req: Request, res: Response) => {
    try {
        const { status } = req.body;

        const updatedClient = await clientModel.findByIdAndUpdate(
            req.params.id,
            { $set: { "company.status": status } },
            { new: true, runValidators: true }
        );

        if (!updatedClient) {
            return res.status(404).json({
                success: false,
                message: "Client not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Client status updated successfully",
            data: updatedClient
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to update status",
            error: err
        });
    }
});

// PUT update client signup information
clientRouter.put("/:id/info", verifyToken, async (req: Request, res: Response) => {
    try {
        const updateData = req.body;

        const updatedClient = await clientModel.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    "company.contact.name": updateData.contactName,
                    "company.contact.email": updateData.email,
                    "company.contact.phone": updateData.phone,
                    "company.address.street": updateData.address,
                    "company.address.city": updateData.city,
                    "company.address.state": updateData.state,
                    "company.address.zip": updateData.zip,
                    "company.fedexId": updateData.fedexContractor,
                    "terminals": updateData.terminals,
                    "startDate": updateData.startDate
                }
            },
            { new: true, runValidators: true }
        );

        if (!updatedClient) {
            return res.status(404).json({
                success: false,
                message: "Client not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Client information updated successfully",
            data: updatedClient
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to update client info",
            error: err
        });
    }
});

// PUT update client subscription (add/remove services)
clientRouter.put("/:id/subscription", verifyToken, async (req: Request, res: Response) => {
    try {
        const { newServices, newMonthlyTotal, action } = req.body;

        let updateQuery: any = {};

        if (action === "add") {
            // Add new services
            updateQuery = {
                $push: {
                    activeServices: {
                        $each: newServices.map((service: any) => ({
                            ...service,
                            addedDate: new Date().toISOString()
                        }))
                    }
                },
                $set: {
                    "resourceDetails.packagePrice": newMonthlyTotal
                }
            };
        } else if (action === "remove") {
            // Remove service by ID
            const { serviceId } = req.body;
            updateQuery = {
                $pull: {
                    activeServices: { id: serviceId }
                }
            };

            // Recalculate total after removal
            const client = await clientModel.findById(req.params.id);
            if (client) {
                const remainingServices = client.activeServices.filter(s => s.id !== serviceId);
                const newTotal = remainingServices.reduce((sum, s) => sum + (s.price * s.quantity), 0);
                updateQuery.$set = { "resourceDetails.packagePrice": newTotal };
            }
        }

        const updatedClient = await clientModel.findByIdAndUpdate(
            req.params.id,
            updateQuery,
            { new: true, runValidators: true }
        );

        if (!updatedClient) {
            return res.status(404).json({
                success: false,
                message: "Client not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Subscription updated successfully",
            data: updatedClient
        });
    } catch (err) {
        console.error("Subscription update error:", err);
        res.status(500).json({
            success: false,
            message: "Failed to update subscription",
            error: err
        });
    }
});

// DELETE client
clientRouter.delete("/:id", verifyToken, async (req: Request, res: Response) => {
    try {
        const deletedClient = await clientModel.findByIdAndDelete(req.params.id);

        if (!deletedClient) {
            return res.status(404).json({
                success: false,
                message: "Client not found"
            });
        }

        // Also delete associated user account if exists
        await userModel.deleteOne({ email: deletedClient.company.contact.email });

        res.status(200).json({
            success: true,
            message: "Client deleted successfully",
            data: deletedClient
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to delete client",
            error: err
        });
    }
});

clientRouter.post("/log-time", verifyToken, async (req: Request, res: Response) => {
    const { clientId, secondsToAdd } = req.body;
    const today = new Date().toISOString().split('T')[0];

    try {
        const log = await timeLogModel.findOneAndUpdate(
            { clientId, date: today },
            {
                $inc: { totalSeconds: secondsToAdd },
                $set: { lastAccessed: new Date() }
            },
            { upsert: true, new: true }
        );
        res.status(200).json({ success: true, data: log });
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

// GET: 10-day history for the modal
clientRouter.get("/:id/time-history", verifyToken, async (req: Request, res: Response) => {
    try {
        // Force 'id' to be treated as a string to satisfy Mongoose types
        const id = req.params.id as string;

        // 1. Validate ID format
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid Client ID format" 
            });
        }

        const clientObjectId = new mongoose.Types.ObjectId(id);

        // 2. Fetch the 10-day history
        // Casting model to 'any' to bypass the Interface mismatch you had earlier
        const history = await (timeLogModel as any).find({ clientId: clientObjectId })
            .sort({ date: -1 })
            .limit(10)
            .lean();

        // 3. Get total cumulative time
        const totalResult = await (timeLogModel as any).aggregate([
            { $match: { clientId: clientObjectId } },
            { $group: { _id: null, total: { $sum: "$totalSeconds" } } }
        ]);

        res.status(200).json({
            success: true,
            history: (history || []).reverse(),
            totalSeconds: totalResult[0]?.total || 0
        });
    } catch (err) {
        console.error("History Fetch Error:", err);
        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: err instanceof Error ? err.message : err 
        });
    }
});

export default clientRouter;