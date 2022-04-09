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
exports.fetchAllData = exports.sendSmsCodeAgain = void 0;
const response_handler_1 = __importDefault(require("../../helper/response-handler"));
const sms_messages_helper_1 = require("../../helper/sms-messages-helper");
const appointments_1 = __importDefault(require("../../model/appointments"));
const doctors_1 = __importDefault(require("../../model/doctors"));
const medical_files_1 = __importDefault(require("../../model/medical-files"));
const medicines_1 = __importDefault(require("../../model/medicines"));
const sendSmsCodeAgain = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone } = req.body;
    try {
        yield (0, sms_messages_helper_1.sendSms)(phone);
        (0, response_handler_1.default)(res, "Code sent successfully", 200);
    }
    catch (err) {
        return next(err);
    }
});
exports.sendSmsCodeAgain = sendSmsCodeAgain;
const fetchAllData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { field } = req.query;
    let doctors = {}, filteredDoctors = {}, appointments = {}, filteredAppointments = {}, medicalFiles = {}, filteredMedicalFiles = {}, medicines = {}, filteredMedicines = {};
    try {
        switch (field) {
            case "doctors":
                doctors = yield doctors_1.default.find({ isAccountActive: true });
                filteredDoctors = doctors.map((doc) => {
                    return {
                        doctorId: doc._id,
                        doctorFullName: doc.doctorFullName,
                        doctorGraduatedFrom: doc.doctorGraduatedFrom,
                        doctorClinic: doc.doctorClinic,
                        doctorBio: `${doc.doctorClinic} graduated from ${doc.doctorGraduatedFrom}`,
                        doctorPrice: doc.doctorPricePerHour,
                        doctorPhoto: doc.doctorPhoto,
                        pushToken: doc.pushToken,
                        acquiredAppointments: doc.acquiredAppointments,
                        doctorPricePerHour: doc.doctorPricePerHour
                    };
                });
                (0, response_handler_1.default)(res, "success", 200, { doctors: filteredDoctors });
                break;
            case "defaultAppointmentsMedicalFilesDoctors":
                const allPromisesDoctors = yield Promise.all([
                    yield appointments_1.default.find({ doctor: req.user.doctorId, status: "approved" }).populate("doctor", ["doctorId", "doctorFullName", "doctorClinic", "acquiredAppointments", "pushToken"]).populate("patient", ["patientName", "isAccountActive"]).populate('bill', ["status", "billPath"]),
                    yield medical_files_1.default.find({ doctor: req.user.doctorId }).populate("doctor", ["doctorId", "doctorFullName"]),
                ]);
                appointments = allPromisesDoctors[0];
                filteredAppointments = appointments.map((appointment) => {
                    return {
                        appointmentId: appointment._id,
                        patientName: appointment.patient.patientName,
                        appointmentDate: appointment.appointmentDate,
                        appointmentTime: appointment.appointmentTime,
                        patientActiveAccount: appointment.patient.isAccountActive,
                        bill: appointment.bill,
                        billPath: appointment.bill.billPath,
                        roomId: appointment.roomId,
                        doctor: {
                            doctorId: appointment.doctor._id,
                            doctorFullName: appointment.doctor.doctorFullName,
                            doctorClinic: appointment.doctor.doctorClinic,
                            pushToken: appointment.doctor.pushToken
                        }
                    };
                });
                medicalFiles = allPromisesDoctors[1];
                filteredMedicalFiles = medicalFiles.map((medicalFile) => {
                    return Object.assign(Object.assign({}, medicalFile._doc), { doctor: Object.assign(Object.assign({}, medicalFile._doc.doctor._doc), { doctorId: medicalFile._doc.doctor._id }) });
                });
                (0, response_handler_1.default)(res, "success", 200, { appointments: filteredAppointments, medicalFiles: filteredMedicalFiles });
                break;
            case "appointments":
                appointments = yield appointments_1.default.find({ doctor: req.user.doctorId, status: "approved" }).populate("doctor", ["doctorId", "doctorFullName", "doctorClinic", "acquiredAppointments", "pushToken"]).populate("patient", ["patientName", "isAccountActive"]).populate('bill', ["status", "billPath"]),
                    filteredAppointments = appointments.map((appointment) => {
                        return {
                            appointmentId: appointment._id,
                            patientName: appointment.patient.patientName,
                            appointmentDate: appointment.appointmentDate,
                            appointmentTime: appointment.appointmentTime,
                            bill: appointment.bill,
                            roomId: appointment.roomId,
                            patientActiveAccount: appointment.patient.isAccountActive,
                            billPath: appointment.bill.billPath,
                            doctor: {
                                doctorId: appointment.doctor._id,
                                doctorFullName: appointment.doctor.doctorFullName,
                                doctorClinic: appointment.doctor.doctorClinic,
                                isAccountActive: appointment.doctor.isAccountActive,
                                pushToken: appointment.doctor.pushToken
                            }
                        };
                    });
                (0, response_handler_1.default)(res, "success", 200, { appointments: filteredAppointments });
                break;
            case "medicalFiles":
                medicalFiles = yield medical_files_1.default.find({ doctor: req.user.doctorId }).populate("doctor", ["doctorId", "doctorFullName"]),
                    filteredMedicalFiles = medicalFiles.map((medicalFile) => {
                        return Object.assign(Object.assign({}, medicalFile._doc), { doctor: Object.assign(Object.assign({}, medicalFile._doc.doctor._doc), { doctorId: medicalFile._doc.doctor._id }) });
                    });
                (0, response_handler_1.default)(res, "success", 200, { medicalFiles: filteredMedicalFiles });
                break;
            default:
                const allPromises = yield Promise.all([
                    yield doctors_1.default.find({ isAccountActive: true }),
                    yield appointments_1.default.find({ patient: req.user.patientId, status: "approved" }).populate("doctor", ["doctorId", "doctorFullName", "doctorPhone", "doctorClinic", "acquiredAppointments", "isAccountActive", "pushToken"]).populate("patient", ["patientName"]).populate('bill', ["status", "billPath"]),
                    yield medical_files_1.default.find({ patient: req.user.patientId }).populate("doctor", ["doctorId", "doctorFullName"]),
                    yield medicines_1.default.find({ patient: req.user.patientId })
                ]);
                doctors = allPromises[0];
                filteredDoctors = doctors.map((doc) => {
                    return Object.assign(Object.assign({}, doc._doc), { doctorId: doc._id, doctorBio: `${doc.doctorClinic} graduated from ${doc.doctorGraduatedFrom}` });
                }),
                    appointments = allPromises[1];
                filteredAppointments = appointments.map((appointment) => {
                    return {
                        appointmentId: appointment._id,
                        appointmentDate: appointment.appointmentDate,
                        appointmentTime: appointment.appointmentTime,
                        eventId: appointment.eventId,
                        bill: appointment.bill,
                        roomId: appointment.roomId,
                        patientName: appointment.patient.patientName,
                        billPath: appointment.bill.billPath,
                        doctor: {
                            doctorId: appointment.doctor._id,
                            doctorFullName: appointment.doctor.doctorFullName,
                            doctorClinic: appointment.doctor.doctorClinic,
                            acquiredAppointments: appointment.doctor.acquiredAppointments,
                            isAccountActive: appointment.doctor.isAccountActive,
                            pushToken: appointment.doctor.pushToken
                        },
                    };
                });
                medicalFiles = allPromises[2];
                filteredMedicalFiles = medicalFiles.map((medicalFile) => {
                    return Object.assign(Object.assign({}, medicalFile._doc), { doctor: Object.assign(Object.assign({}, medicalFile._doc.doctor._doc), { doctorId: medicalFile._doc.doctor._id }) });
                });
                medicines = allPromises[3];
                filteredMedicines = medicines.map((medicine) => {
                    return Object.assign(Object.assign({}, medicine._doc), { medicineId: medicine._id });
                });
                (0, response_handler_1.default)(res, "success", 200, { appointments: filteredAppointments, doctors: filteredDoctors, medicalFiles: filteredMedicalFiles.reverse(), medicines: filteredMedicines });
                break;
        }
    }
    catch (err) {
        return next(err);
    }
});
exports.fetchAllData = fetchAllData;
