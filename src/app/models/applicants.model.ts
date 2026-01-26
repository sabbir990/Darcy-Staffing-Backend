import mongoose from "mongoose";

const ApplicantSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  avp: { type: String, enum: ['Yes', 'No'], default: 'No' },
  background: { type: String, default: 'In Progress' },
  drugScreen: { type: String, default: 'Awaiting' },
  medCard: { type: String, default: 'Awaiting' },
  orderId: { type: String, unique: true },
  profileId: { type: String },
  status: { type: String, enum: ['ready', 'progress', 'disqualified'], default: 'progress' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Applicant", ApplicantSchema);