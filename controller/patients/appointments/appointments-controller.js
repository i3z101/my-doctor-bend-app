"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAppointment = exports.updateAppointment = exports.addNewAppointment = void 0;
const path_1 = __importDefault(require("path"));
const response_handler_1 = __importDefault(require("../../../helper/response-handler"));
const appointments_1 = __importDefault(require("../../../model/appointments"));
const bills_1 = __importDefault(require("../../../model/bills"));
const doctors_1 = __importDefault(require("../../../model/doctors"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs_1 = __importDefault(require("fs"));
const expo_server_sdk_1 = __importDefault(require("expo-server-sdk"));
const addNewAppointment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { appointmentDate, appointmentTime, eventId, doctorId, billId, roomId, doctorPushToken } = req.body;
    try {
        const allPromises = yield Promise.all([
            yield new appointments_1.default({
                appointmentDate,
                appointmentTime,
                eventId,
                patient: req.user.patientId,
                roomId,
                doctor: doctorId,
                bill: billId,
            }).save(),
            yield doctors_1.default.findById(doctorId),
            yield bills_1.default.findById(billId)
        ]);
        const appointment = allPromises[0];
        const doctorInfo = allPromises[1];
        const billInfo = allPromises[2];
        const billPath = `/bills/${appointment._id}.pdf`;
        if (doctorInfo != null) {
            if (doctorInfo.acquiredAppointments.length == 0) {
                doctorInfo.acquiredAppointments.push({
                    appointmentDate: appointmentDate,
                    acquiredTimes: [appointmentTime]
                });
            }
            else {
                const acquiredAppointmentsCopy = doctorInfo.acquiredAppointments.find((appointment) => appointment.appointmentDate == appointmentDate);
                if (acquiredAppointmentsCopy != null) {
                    acquiredAppointmentsCopy.acquiredTimes.push(appointmentTime);
                }
                else {
                    doctorInfo.acquiredAppointments.push({
                        appointmentDate: appointmentDate,
                        acquiredTimes: [appointmentTime]
                    });
                }
            }
            if (doctorInfo) {
                yield doctorInfo.updateOne({ $set: { acquiredAppointments: doctorInfo.acquiredAppointments } });
            }
            if (billInfo) {
                yield billInfo.updateOne({ $set: { billPath } });
            }
            if (doctorPushToken != "") {
                pushNewNotification(doctorPushToken, `A new appointment with ${req.user.patientName}`, `Date & Time ${appointmentDate} At ${appointmentTime}`, "Look at it");
            }
            generatePdfBill(String(appointment._id), "PAID", appointmentDate, appointmentTime, doctorInfo.doctorFullName, doctorInfo.doctorClinic, req.user.patientName);
            (0, response_handler_1.default)(res, "Appointment added successfully", 201, { appointmentId: appointment._id, billPath, acquiredAppointments: doctorInfo.acquiredAppointments });
        }
    }
    catch (err) {
        return next(err);
    }
});
exports.addNewAppointment = addNewAppointment;
const updateAppointment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { appointmentId, appointmentDate, appointmentTime, eventId, doctorId, prevTime, prevDate, doctorPushToken } = req.body;
    try {
        const allPromises = yield Promise.all([
            yield appointments_1.default.findByIdAndUpdate(appointmentId, { $set: {
                    appointmentDate,
                    appointmentTime,
                    eventId
                } }),
            yield doctors_1.default.findById(doctorId)
        ]);
        const doctorInfo = allPromises[1];
        if (doctorInfo != null) {
            let acquiredAppointmentsCopy = doctorInfo.acquiredAppointments.find((appointment) => appointment.appointmentDate == appointmentDate);
            let findTimeByIndex = -1;
            if (acquiredAppointmentsCopy) {
                findTimeByIndex = acquiredAppointmentsCopy.acquiredTimes.findIndex((time) => time == prevTime);
                if (findTimeByIndex > -1) {
                    acquiredAppointmentsCopy.acquiredTimes[findTimeByIndex] = appointmentTime;
                }
                else {
                    acquiredAppointmentsCopy.acquiredTimes.push(appointmentTime);
                }
            }
            else {
                acquiredAppointmentsCopy = doctorInfo.acquiredAppointments.find((appointment) => appointment.appointmentDate == prevDate);
                findTimeByIndex = acquiredAppointmentsCopy.acquiredTimes.findIndex((time) => time == prevTime);
                acquiredAppointmentsCopy.acquiredTimes.splice(findTimeByIndex, 1);
                doctorInfo.acquiredAppointments.push({
                    appointmentDate: appointmentDate,
                    acquiredTimes: [appointmentTime]
                });
            }
            yield doctorInfo.updateOne({ $set: { acquiredAppointments: doctorInfo.acquiredAppointments } });
            if (doctorPushToken != "") {
                pushNewNotification(doctorPushToken, `Updated appointment with ${req.user.patientName}`, `New Date & Time ${appointmentDate} At ${appointmentTime}`, "Look at it");
            }
            generatePdfBill(appointmentId, "PAID", appointmentDate, appointmentTime, doctorInfo.doctorFullName, doctorInfo.doctorClinic, req.user.patientName);
            (0, response_handler_1.default)(res, "Appointment updated successfully", 200, { acquiredAppointments: doctorInfo.acquiredAppointments });
        }
    }
    catch (err) {
        return next(err);
    }
});
exports.updateAppointment = updateAppointment;
const deleteAppointment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { appointmentId, doctorId, appointmentDate, appointmentTime, billId, doctorPushToken } = req.body;
    try {
        const allPromises = yield Promise.all([
            yield doctors_1.default.findById(doctorId),
            yield appointments_1.default.findById(appointmentId),
            yield bills_1.default.findByIdAndUpdate(billId, { $set: { status: "canceled" } })
        ]);
        const doctorInfo = allPromises[0];
        const appointmentInfo = allPromises[1];
        if (doctorInfo != null && appointmentInfo != null) {
            const acquiredAppointmentsCopy = doctorInfo.acquiredAppointments.find((appointment) => appointment.appointmentDate == appointmentDate);
            const findTimeIndex = acquiredAppointmentsCopy.acquiredTimes.findIndex((time) => time == appointmentTime);
            acquiredAppointmentsCopy.acquiredTimes.splice(findTimeIndex, 1);
            yield Promise.all([
                yield doctorInfo.updateOne({ $set: { acquiredAppointments: doctorInfo.acquiredAppointments } }),
                yield appointmentInfo.updateOne({ $set: { status: "canceled" } })
            ]);
            if (doctorPushToken != "") {
                pushNewNotification(doctorPushToken, `Appointment canceled with ${req.user.patientName}`, `Date & Time ${appointmentDate} At ${appointmentTime}`, "Sorry");
            }
            generatePdfBill(appointmentId, "CANCELED", appointmentDate, appointmentTime, doctorInfo.doctorFullName, doctorInfo.doctorClinic, req.user.patientName);
            (0, response_handler_1.default)(res, "Appointment canceled successfully", 200, { acquiredAppointments: doctorInfo.acquiredAppointments });
        }
    }
    catch (err) {
        return next(err);
    }
});
exports.deleteAppointment = deleteAppointment;
const generatePdfBill = (appointmentId, status, appointmentDate, appointmentTime, doctor, clinic, patient) => {
    const documentPath = path_1.default.join(process.cwd(), "public", "bills", `${appointmentId}.pdf`);
    const biillDoc = new pdfkit_1.default({ size: 'A4' });
    biillDoc.pipe(fs_1.default.createWriteStream(documentPath));
    biillDoc
        .fontSize(40)
        .text("Bill Invoice", {
        align: 'center',
    });
    biillDoc.moveDown();
    biillDoc
        .fontSize(15)
        .text("Status: ", 60)
        .fontSize(15)
        .font('Helvetica-Bold')
        .text(status);
    biillDoc.moveDown();
    biillDoc
        .fontSize(15)
        .text("Appointment Date: ", 60)
        .fontSize(15)
        .font("Helvetica-Bold")
        .text(appointmentDate, 60);
    biillDoc.moveDown();
    biillDoc
        .fontSize(15)
        .text("Appointment Time: ", 60)
        .fontSize(15)
        .font("Helvetica-Bold")
        .text(appointmentTime);
    biillDoc.moveDown();
    biillDoc
        .fontSize(15)
        .text("Doctor: ", 60)
        .fontSize(15)
        .font("Helvetica-Bold")
        .text(doctor);
    biillDoc.moveDown();
    biillDoc
        .fontSize(15)
        .text("Clinic: ", 60)
        .fontSize(15)
        .font("Helvetica-Bold")
        .text(clinic);
    biillDoc.moveDown();
    biillDoc
        .fontSize(15)
        .text("Patient: ", 60)
        .fontSize(15)
        .font("Helvetica-Bold")
        .text(patient);
    biillDoc.moveDown();
    biillDoc.moveDown();
    biillDoc.moveDown();
    biillDoc
        .fontSize(20)
        .font("Courier-Bold")
        .text("Thanks For Choosing MyDoctor", {
        align: 'center',
    });
    biillDoc.end();
};
const pushNewNotification = (pushToken, title, body, subtitle) => __awaiter(void 0, void 0, void 0, function* () {
    const expo = new expo_server_sdk_1.default();
    const isPushToken = expo_server_sdk_1.default.isExpoPushToken(pushToken);
    if (isPushToken) {
        yield expo.sendPushNotificationsAsync([{
                to: pushToken,
                title,
                body,
                subtitle,
                sound: 'default',
            }]);
    }
});
