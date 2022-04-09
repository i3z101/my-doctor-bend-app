import mongoose from "mongoose"
import { AdminType } from "../helper/types";



const Schema =  mongoose.Schema

const AdminSchema = new Schema<AdminType>({
    adminName: {
        type: String,
        required: true
    },
    adminPassword: {
        type: String,
        required: true
    }
}, {
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt"
    }
})

const Admin = mongoose.model("admins", AdminSchema);

export default Admin;