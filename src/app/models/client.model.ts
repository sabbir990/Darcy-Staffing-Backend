import { Schema, model, Document } from "mongoose";

// Interface for TypeScript type safety
export interface IClient extends Document {
  company: {
    name: string;
    status: string;
    contact: {
      email: string;
      phone: string;
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
    applicants: number;
    interviews: number;
  };
  terminals?: string;
  startDate?: string;
}

const clientSchema = new Schema<IClient>(
  {
    company: {
      name: { type: String, required: true },
      status: { type: String, default: "active" },
      contact: {
        email: { type: String, required: true },
        phone: { type: String, required: true },
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
      applicants: { type: Number, default: 0 },
      interviews: { type: Number, default: 0 },
    },
    terminals: { type: String },
    startDate: { type: String },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

const clientModel = model<IClient>("Client", clientSchema);

export default clientModel;