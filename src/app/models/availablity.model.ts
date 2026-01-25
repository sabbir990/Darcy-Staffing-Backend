import mongoose, { Schema, Document } from "mongoose";
import { IAvailability } from "../interface/availablity.interface";

export interface IAvailabilityDocument extends Omit<IAvailability, '_id'>, Document {}

const AvailabilitySchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, 
    slots: [{
        time: { type: String, required: true },
        status: { type: String, enum: ['Available', 'Booked'], default: 'Available' },
        clientName: { type: String, default: "" },
        clientPhone: { type: String, default: "" }
    }]
}, { timestamps: true });

// Prevent duplicate entries for the same user on the same date
AvailabilitySchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model<IAvailabilityDocument>("Availability", AvailabilitySchema);