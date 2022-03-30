import mongoose from "mongoose"
import {MedicalFileType } from "../helper/types";
import Doctor  from "./doctors";
import Patient  from "./patients";

const Schema =  mongoose.Schema

const MedicalFileSchema = new Schema<MedicalFileType>({
    fileName: {
        type: String,
        required: true
    },
    clinic: {
        type: String,
        required: true
    },
    disease: {
        type: String,
        required: true
    },
    medicine: {
        type: String,
        required: true
    },
    patientName: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        required: true
    },
    doctor: {
        type: Schema.Types.ObjectId,
        ref: Doctor
    },
    patient: {
        type: Schema.Types.ObjectId,
        ref: Patient
    }
})

const MedicalFile = mongoose.model("medical-files", MedicalFileSchema);

export default MedicalFile;