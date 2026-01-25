import mongoose, { Schema, Document } from "mongoose";
import { IDocument } from "../interface/document.interface";

// Extend the interface for Mongoose Document methods
export interface IDocumentSchema extends IDocument, Document {
  _id: any; 
}

const DocumentSchema: Schema = new Schema(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    name: { type: String, required: true },
    size: { type: String, required: true },
    type: { type: String, required: true },
    notes: { type: String, default: "" },
    url: { type: String, required: true },
  },
  { 
    timestamps: { createdAt: "uploadedAt", updatedAt: false } 
  }
);

export default mongoose.model<IDocumentSchema>("Document", DocumentSchema);