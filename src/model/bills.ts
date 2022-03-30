import mongoose from "mongoose"
import { BillType } from "../helper/types";
import Appointment from "./appointments";


const Schema =  mongoose.Schema

const BillSchema = new Schema<BillType>({
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    amount: {
        type: Schema.Types.Number,
        required: true
    },
    status: {
        type: String,
        default: "paid"
    }
}, {
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt"
    }
})

const Bill = mongoose.model("bills", BillSchema);

export default Bill;