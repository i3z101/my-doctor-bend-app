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
exports.logoutPatientController = exports.loginPatientController = exports.sendSmsCodeLoginController = exports.registerPatientController = exports.sendSmsCodeRegisterController = void 0;
require("dotenv/config");
const patients_1 = __importDefault(require("../../../model/patients"));
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_handler_1 = __importDefault(require("../../../helper/error-handler"));
const response_handler_1 = __importDefault(require("../../../helper/response-handler"));
const sms_messages_helper_1 = require("../../../helper/sms-messages-helper");
const sendSmsCodeRegisterController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { patientPhone } = req.body;
    try {
        const validations = (0, express_validator_1.validationResult)(req);
        if (!validations.isEmpty()) {
            (0, error_handler_1.default)("Validation error(s)", 422, validations.array());
        }
        const existPatient = yield patients_1.default.findOne({ patientPhone });
        if (existPatient) {
            (0, error_handler_1.default)("Patient is already registered", 422);
        }
        yield (0, sms_messages_helper_1.sendSms)(patientPhone);
        (0, response_handler_1.default)(res, "Code sent successfully", 200);
    }
    catch (err) {
        return next(err);
    }
});
exports.sendSmsCodeRegisterController = sendSmsCodeRegisterController;
const registerPatientController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { patientPhone, patientName, patientEmail, code, pushToken } = req.body;
    try {
        yield (0, sms_messages_helper_1.verfiySms)(code, patientPhone);
        const patient = yield new patients_1.default({
            patientName,
            patientPhone,
            patientEmail,
            pushToken
        }).save();
        const patientInfo = Object.assign({ patientId: patient._id }, patient._doc);
        const encodeToken = jsonwebtoken_1.default.sign(patientInfo, process.env.TOKEN_SECRET_KEY, { expiresIn: '120d' });
        const responsePatientInfo = Object.assign(Object.assign({}, patientInfo), { pushToken, patientId: patient._id, authToken: encodeToken, isGuest: false });
        (0, response_handler_1.default)(res, "Patient registered successfully", 201, { patient: responsePatientInfo });
    }
    catch (err) {
        if (err.message == `The requested resource /Services/${process.env.SERVICE_SID}/VerificationCheck was not found`) {
            err.message = "Code is expired";
        }
        return next(err);
    }
});
exports.registerPatientController = registerPatientController;
const sendSmsCodeLoginController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { patientPhone } = req.body;
    try {
        const validations = (0, express_validator_1.validationResult)(req);
        if (!validations.isEmpty()) {
            (0, error_handler_1.default)("Validation error(s)", 422, validations.array());
        }
        const existPatient = yield patients_1.default.findOne({ patientPhone });
        if (!existPatient) {
            (0, error_handler_1.default)("Patient is not found", 404);
        }
        else {
            if (!existPatient.isAccountActive) {
                (0, error_handler_1.default)("Patient's account is not active. Please contact us", 404);
            }
        }
        yield (0, sms_messages_helper_1.sendSms)(patientPhone);
        (0, response_handler_1.default)(res, "Code sent successfully", 200);
    }
    catch (err) {
        return next(err);
    }
});
exports.sendSmsCodeLoginController = sendSmsCodeLoginController;
const loginPatientController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { patientPhone, code, pushToken } = req.body;
    try {
        yield (0, sms_messages_helper_1.verfiySms)(code, patientPhone);
        const patient = yield patients_1.default.findOne({ patientPhone });
        if (patient) {
            yield patient.updateOne({ $set: { pushToken } });
            const patientInfo = Object.assign({ patientId: patient._id }, patient._doc);
            const encodeToken = jsonwebtoken_1.default.sign(patientInfo, process.env.TOKEN_SECRET_KEY, { expiresIn: '120d' });
            const responsePatientInfo = Object.assign(Object.assign({}, patientInfo), { pushToken, authToken: encodeToken, isGuest: false });
            (0, response_handler_1.default)(res, "Welcome back", 200, { patient: responsePatientInfo });
        }
    }
    catch (err) {
        if (err.message == `The requested resource /Services/${process.env.SERVICE_SID}/VerificationCheck was not found`) {
            err.message = "Code is expired";
        }
        return next(err);
    }
});
exports.loginPatientController = loginPatientController;
const logoutPatientController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield patients_1.default.findByIdAndUpdate(req.user.patientId, { $set: { pushToken: "" } });
        (0, response_handler_1.default)(res, "Patient logged out succesfully", 200);
    }
    catch (err) {
        if (err.message == `The requested resource /Services/${process.env.SERVICE_SID}/VerificationCheck was not found`) {
            err.message = "Code is expired";
        }
        return next(err);
    }
});
exports.logoutPatientController = logoutPatientController;
