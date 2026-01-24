import mongoose from "mongoose";
import Payment from "../interface/payment.interface";

const paymentInfoSchema = new mongoose.Schema<Payment>({
    cardholderName: {type: String, required: [true, "cardholderName is a required field!"]},
    clientEmail: {type: String, required: [true, "clientEmail is a required field!"], lowercase: true},
    streetAddress: {type: String, required: [true, "streetAddress is a required field!"], trim: true},
    zipCode: {type: String, required: [true, "zipCode is a required field!"], trim: true},
    city: {type: String, required: [true, "city is a required field!"], trim: true},
    state: {type: String, required: [true, "state is a required field!"], trim: true},
    contractType: {type: String, required: [true, "contractType is a required field!"], trim: true},
    pricePaid: {type: Number, required: [true, "pricePaid is a required field!"], trim: true},
}, {timestamps: true})

const PaymentInfoModel = mongoose.model("Payments", paymentInfoSchema, "Payments");

export default PaymentInfoModel;