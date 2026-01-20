import mongoose from "mongoose";
import { user } from "../interface/user.interface";

const userSchema = new mongoose.Schema<user>({
    username: {type: String, required: [true, "Username is a required field!"], unique: true},
    email: {type: String, required: [true, "Email is a required field!"], unique: true},
    password: {type: String, required: [true, "Password is a required field!"]},
    role: {type: String, enum: ['admin', 'client'], required: [true, "Role is a required field!"], default: 'client'},
}, {timestamps: true});

const userModel = mongoose.model("User", userSchema);

export default userModel;