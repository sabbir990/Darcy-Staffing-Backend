import mongoose from "mongoose";
import { User } from "../interface/user.interface";

const userSchema = new mongoose.Schema<User>({
    contractorType: { type: String, required: [true, "Contractor type is required!"], trim: true },
    packagePrice: { type: Number, required: [true, "Package Price is required!"] },
    
    businessName: { type: String, trim: true },
    streetAddress: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String },
    zipCode: { type: String },
    
    name: { type: String },
    emailAddress: { type: String },
    phoneNumber: { type: String }, // Matched to String
    title: { type: String },
    
    secondaryContactName: { type: String },
    secondaryContactEmailAddress: { type: String },
    secondaryContactPhoneNumber: { type: String }, // Matched to String
    
    hoursWorked: { type: String }, // Matched to Number
    driverSchedule: { type: String },
    pay: { type: String }, // Matched to Number
    ratePerStop: { type: String }, // Matched to Number
    stopsPerDay: { type: String }, // Matched to Number
    
    benefits: { type: String },
    truckSize: { type: String },
    terminalAddress: { type: String },
    
    clientID: { type: String },
    userID: { type: String },
    systemAccessPassword: { type: String },
    sequrityQuestionAnswer: { type: String },
    indeedUsernameOrEmail: { type: String },
    indeedPassword: { type: String },
    
    authorizedDate: { type: String }, 
    authorizedSignature: { type: String },
    position: { type: String },
    companyName: { type: String },
    username: {type: String},
    email: {type: String},
    password: {type: String}
}, { timestamps: true });

// The 3rd argument "users" is CRITICAL to fix the InvalidNamespace error
const userModel = mongoose.model<User>("User", userSchema, "users");

export default userModel;