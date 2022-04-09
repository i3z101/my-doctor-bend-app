"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const DoctorSchema = new Schema({
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
    pushToken: {
        type: String,
        default: ""
    }
}, {
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt"
    }
});
const Doctor = mongoose_1.default.model("doctors", DoctorSchema);
exports.default = Doctor;
