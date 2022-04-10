import mongoose from "mongoose"
import { AppointmentType } from "../helper/types";
import Bill from "./bills";
import Doctor from "./doctors";
import Patient  from "./patients";

const Schema =  mongoose.Schema

const AppointmentSchema = new Schema<AppointmentType>({
    appointmentDate: {
        type: String,
        required: true
    },
    appointmentTime: {
        type: String,
        required: true
    },
    eventId: {
        type: String,
        default: ""
    },
    doctor: {
        type: Schema.Types.ObjectId,
        ref: Doctor
    },
    patient: {
        type: Schema.Types.ObjectId,
        ref: Patient
    },
    bill: {
        type: Schema.Types.ObjectId,
        ref: Bill
    },
    roomId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'approved'
    }
})

const Appointment = mongoose.model("appointments", AppointmentSchema);

export default Appointment;