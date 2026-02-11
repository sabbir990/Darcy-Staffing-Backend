import { Schema, model, Document } from "mongoose";

export interface ITimeLog extends Document {
  clientId: Schema.Types.ObjectId;
  date: string; // Format: "YYYY-MM-DD"
  totalSeconds: number;
  lastAccessed: Date;
}

const timeLogSchema = new Schema<ITimeLog>({
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  date: { type: String, required: true },
  totalSeconds: { type: Number, default: 0 },
  lastAccessed: { type: Date, default: Date.now }
});

// Create a compound index so we only have ONE entry per client per day
timeLogSchema.index({ clientId: 1, date: 1 }, { unique: true });

export default model<ITimeLog>("TimeLog", timeLogSchema);