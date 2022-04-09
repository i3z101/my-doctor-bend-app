"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const doctors_1 = __importDefault(require("./doctors"));
const patients_1 = __importDefault(require("./patients"));
const Schema = mongoose_1.default.Schema;
const MedicalFileSchema = new Schema({
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
    doctor: {
        type: Schema.Types.ObjectId,
        ref: doctors_1.default
    },
    patient: {
        type: Schema.Types.ObjectId,
        ref: patients_1.default
    }
}, {
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt"
    }
});
const MedicalFile = mongoose_1.default.model("medical-files", MedicalFileSchema);
exports.default = MedicalFile;
