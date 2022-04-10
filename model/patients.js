"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const PatientSchema = new Schema({
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
});
const Patient = mongoose_1.default.model("patients", PatientSchema);
exports.default = Patient;
