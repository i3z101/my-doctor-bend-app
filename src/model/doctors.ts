import mongoose from "mongoose"
import { DoctorsAuthType } from "../helper/types";

const Schema =  mongoose.Schema

const DoctorSchema = new Schema<DoctorsAuthType>({
    doctorFullName: {
        type: String,
        required: true
    },
    doctorPhone: {
        type: String,
        required: true
    },
    doctorEmail: {
        type: String
    },
    doctorCertificate: {
        type: String,
        required: true
    },
    doctorPhoto: {
        type: String,
        required: true
    },
    doctorClinic: {
        type: String,
        required: true
    },
    doctorPricePerHour: {
        type: Number,
        required: true
    },
    doctorGraduatedFrom: {
        type: String,
        required: true
    },
    acquiredAppointments: [{
        appointmentDate: {
            type: String,
            required: true
        },
        acquiredTimes: [{
            type: String,
            required: true
        }]
    }],
    isAccountActive: {
        type: Boolean,
        default: true
    },
    updatePermitted: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt"
    }
})

const Doctor = mongoose.model("doctors", DoctorSchema);

export default Doctor;