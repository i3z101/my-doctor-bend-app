"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bills_1 = __importDefault(require("./bills"));
const doctors_1 = __importDefault(require("./doctors"));
const patients_1 = __importDefault(require("./patients"));
const Schema = mongoose_1.default.Schema;
const AppointmentSchema = new Schema({
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
        required: true
    },
    doctor: {
        type: Schema.Types.ObjectId,
        ref: doctors_1.default
    },
    patient: {
        type: Schema.Types.ObjectId,
        ref: patients_1.default
    },
    bill: {
        type: Schema.Types.ObjectId,
        ref: bills_1.default
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
});
const Appointment = mongoose_1.default.model("appointments", AppointmentSchema);
exports.default = Appointment;
