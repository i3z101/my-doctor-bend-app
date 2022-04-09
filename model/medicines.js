"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const patients_1 = __importDefault(require("./patients"));
const Schema = mongoose_1.default.Schema;
const MedicineSchema = new Schema({
    patient: {
        type: Schema.Types.ObjectId,
        ref: patients_1.default
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
}, {
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt"
    }
});
const Medicine = mongoose_1.default.model("medicines", MedicineSchema);
exports.default = Medicine;
