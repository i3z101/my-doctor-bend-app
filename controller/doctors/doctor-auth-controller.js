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
exports.logoutDoctorController = exports.loginDoctorController = exports.sendSmsCodeLoginController = exports.registerDoctorController = exports.sendSmsCodeRegisterController = void 0;
const express_validator_1 = require("express-validator");
const error_handler_1 = __importDefault(require("../../helper/error-handler"));
const response_handler_1 = __importDefault(require("../../helper/response-handler"));
const sms_messages_helper_1 = require("../../helper/sms-messages-helper");
const doctors_1 = __importDefault(require("../../model/doctors"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendSmsCodeRegisterController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { doctorPhone } = req.body;
    try {
        const validations = (0, express_validator_1.validationResult)(req);
        if (!validations.isEmpty()) {
            (0, error_handler_1.default)("Validation error(s)", 422, validations.array());
        }
        const existDoctor = yield doctors_1.default.findOne({ doctorPhone });
        if (existDoctor) {
            (0, error_handler_1.default)("Doctor is registered already", 422);
        }
        yield (0, sms_messages_helper_1.sendSms)(doctorPhone);
    }
    catch (err) {
        return next(err);
    }
    (0, response_handler_1.default)(res, "Code sent successfully", 200);
});
exports.sendSmsCodeRegisterController = sendSmsCodeRegisterController;
const registerDoctorController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { doctorFullName, doctorPhone, doctorEmail, doctorClinic, doctorPricePerHour, doctorGraduatedFrom, code, pushToken } = req.body;
    try {
        yield (0, sms_messages_helper_1.verfiySms)(code, doctorPhone);
        if (req.files) {
            const files = req.files;
            const doctor = yield new doctors_1.default({
                doctorFullName,
                doctorPhone,
                doctorEmail,
                doctorClinic,
                doctorGraduatedFrom,
                doctorPricePerHour,
                pushToken,
                doctorCertificate: `/doctors/certificates/${files.doctorCertificate[0].filename}`,
                doctorPhoto: `/doctors/photos/${files.doctorPhoto[0].filename}`,
                acquiredAppointments: [],
            }).save();
            const doctorInfo = {
                doctorId: doctor._id,
                doctorFullName: doctor.doctorFullName,
                doctorPhone: doctor.doctorPhone,
                doctorEmail: doctor.doctorEmail,
            };
            const encodeToken = jsonwebtoken_1.default.sign(doctorInfo, process.env.TOKEN_SECRET_KEY, { expiresIn: '120d' });
            const responseDoctorInfo = Object.assign(Object.assign({}, doctorInfo), { authToken: encodeToken, pushToken });
            (0, response_handler_1.default)(res, "Welcome in our family", 201, { doctor: responseDoctorInfo });
        }
    }
    catch (err) {
        if (err.message == `The requested resource /Services/${process.env.SERVICE_SID}/VerificationCheck was not found`) {
            err.message = "Code is expired";
        }
        if (req.file) {
            //Delete file if there is any caught error
            Promise.all([
                yield promises_1.default.unlink(path_1.default.join(process.cwd(), "public/doctors/certificates", "dr." + req.body.doctorFullName.replace(" ", "_") + "_certificate." + req.file.originalname)),
                yield promises_1.default.unlink(path_1.default.join(process.cwd(), "public/doctors/photos", "dr." + req.body.doctorFullName.replace(" ", "_") + "_certificate." + req.file.originalname))
            ]);
        }
        return next(err);
    }
});
exports.registerDoctorController = registerDoctorController;
const sendSmsCodeLoginController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { doctorPhone } = req.body;
    try {
        const validations = (0, express_validator_1.validationResult)(req);
        if (!validations.isEmpty()) {
            (0, error_handler_1.default)("Validation error(s)", 422, validations.array());
        }
        const existDoctor = yield doctors_1.default.findOne({ doctorPhone });
        if (!existDoctor) {
            (0, error_handler_1.default)("Doctor is not found", 404);
        }
        else {
            if (!existDoctor.isAccountActive) {
                (0, error_handler_1.default)("Doctor's account is not active. Please contact us", 404);
            }
        }
        yield (0, sms_messages_helper_1.sendSms)(doctorPhone);
    }
    catch (err) {
        return next(err);
    }
    (0, response_handler_1.default)(res, "Code send successfully", 200);
});
exports.sendSmsCodeLoginController = sendSmsCodeLoginController;
const loginDoctorController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { doctorPhone, code, pushToken } = req.body;
    try {
        yield (0, sms_messages_helper_1.verfiySms)(code, doctorPhone);
        const doctor = yield doctors_1.default.findOne({ doctorPhone });
        if (doctor != null) {
            yield doctor.updateOne({ $set: { pushToken } });
            const doctorInfo = Object.assign(Object.assign({}, doctor._doc), { doctorId: doctor._id });
            const encodeToken = jsonwebtoken_1.default.sign(doctorInfo, process.env.TOKEN_SECRET_KEY, { expiresIn: '120d' });
            const responseDoctorInfo = Object.assign(Object.assign({}, doctorInfo), { authToken: encodeToken, pushToken });
            (0, response_handler_1.default)(res, "Welcome back", 200, { doctor: responseDoctorInfo });
        }
    }
    catch (err) {
        if (err.message == `The requested resource /Services/${process.env.SERVICE_SID}/VerificationCheck was not found`) {
            err.message = "Code is expired";
        }
    }
});
exports.loginDoctorController = loginDoctorController;
const logoutDoctorController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield doctors_1.default.findByIdAndUpdate(req.user.doctorId, { $set: { pushToken: "" } });
        (0, response_handler_1.default)(res, "Doctor logged out successfully", 200);
    }
    catch (err) {
        if (err.message == `The requested resource /Services/${process.env.SERVICE_SID}/VerificationCheck was not found`) {
            err.message = "Code is expired";
        }
    }
});
exports.logoutDoctorController = logoutDoctorController;
