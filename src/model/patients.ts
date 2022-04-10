import mongoose from "mongoose"
import { PatientAuthType } from "../helper/types";

const Schema =  mongoose.Schema

const PatientSchema = new Schema<PatientAuthType>({
    patientName: {
        type: String,
        required: true
    },
    patientPhone: {
        type: String,
        required: true
    },
    patientEmail: {
        type: String,
        default: null
    },
    pushToken: {
        type: String,
        default: ""
    },
    isAccountActive: {
        type: Boolean,
        default: true
    },
    updatePermitted: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt"
    }
})

const Patient = mongoose.model("patients", PatientSchema);

export default Patient;