import mongoose from "mongoose"
import { AppointmentType, MedicineType } from "../helper/types";
import { Patient } from "./patients";

const Schema =  mongoose.Schema

const MedicineSchema = new Schema<MedicineType>({
    patient: {
        type: Schema.Types.ObjectId,
        ref: Patient
    },
    medicineId: {
        type: String,
        required: true
    },
    medicineName: {
        type: String,
        required: true
    },
    timesPerDay: {
        type: Number,
        required: true
    },
    tabletsPerTime: {
        type: Number,
        required: true
    },
    shouldTakeItEvery: {
        type: Number,
        required: true
    },
    numberOfDays: {
        type: Number,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    eventId: {
        type: String,
        required: true
    },
    listDates: [{
        day: {
            type: String,
            required: true
        },
        time: {
            type: String,
            required: true
        }
    }]
})

const Medicine = mongoose.model("medicines", MedicineSchema);

export default Medicine;