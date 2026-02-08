// backend/models/client.model.ts - COMPLETE UPDATED VERSION

import { Schema, model, Document } from "mongoose";

// Service Item Schema for active services
const serviceItemSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  addedDate: { type: String, required: true }
});

// Interface for TypeScript type safety
export interface IClient extends Document {
  company: {
    name: string;
    status: "active" | "paused" | "cancelled";
    contact: {
      email: string;
      phone: string;
      name?: string;
    };
    registrationDate: string;
    fedexId?: string;
    address: {
      street?: string;
      city?: string;
      state?: string;
      zip?: string;
    };
  };
  resourceDetails: {
    title: string;
    packagePrice: number;
    applicants: number;
    interviews: number;
  };
  activeServices: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    addedDate: string;
  }>;
  terminals?: string;
  startDate?: string;
  nextBillingDate?: string;
  paymentMethod?: {
    last4: string;
    brand: string;
  };
  // Store all form data from registration
  formData?: {
    businessName?: string;
    streetAddress?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    primaryContactName?: string;
    primaryContactEmail?: string;
    primaryContactPhone?: string;
    primaryContactTitle?: string;
    secondaryContactName?: string;
    secondaryContactEmail?: string;
    secondaryContactPhone?: string;
    hoursWorked?: string;
    driverSchedule?: string;
    pay?: string;
    benefits?: string;
    truckSize?: string;
    terminalAddress?: string;
    firstAdvantageClientId?: string;
    firstAdvantageUserId?: string;
    firstAdvantagePassword?: string;
    indeedLogin?: string;
    indeedPassword?: string;
    signatureName?: string;
    signatureDate?: string;
  };
}

const clientSchema = new Schema<IClient>(
  {
    company: {
      name: { type: String, required: true },
      status: { 
        type: String, 
        enum: ["active", "paused", "cancelled"],
        default: "active" 
      },
      contact: {
        email: { type: String, required: true },
        phone: { type: String, required: true },
        name: { type: String }
      },
      registrationDate: { type: String },
      fedexId: { type: String },
      address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zip: { type: String },
      },
    },
    resourceDetails: {
      title: { type: String },
      packagePrice: { type: Number, default: 0 },
      applicants: { type: Number, default: 0 },
      interviews: { type: Number, default: 0 },
    },
    activeServices: [serviceItemSchema],
    terminals: { type: String },
    startDate: { type: String },
    nextBillingDate: { type: String },
    paymentMethod: {
      last4: { type: String },
      brand: { type: String }
    },
    formData: {
      type: Schema.Types.Mixed,
      default: {}
    }
  },
  { timestamps: true }
);

const clientModel = model<IClient>("Client", clientSchema);

export default clientModel;