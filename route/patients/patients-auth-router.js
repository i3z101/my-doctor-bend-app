"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const patients_auth_controllers_1 = require("../../controller/patients/patients-auth/patients-auth-controllers");
const express_validator_1 = require("express-validator");
const checkAuthorization_middleware_1 = __importDefault(require("../../middleware/checkAuthorization-middleware"));
const patientsAuth = express_1.default.Router();
patientsAuth.post("/send-sms-code-registration", [
    (0, express_validator_1.body)("patientPhone")
        .isString().withMessage("Patient phone must be a string")
        .notEmpty().withMessage("Patient phone is required")
        .matches(/^[0-9]+$/).withMessage("Patient phone should contains only numeric values")
        .isLength({ max: 12 }).withMessage("Patient phone must be 12 numbers"),
    (0, express_validator_1.body)("patientName")
        .isString().withMessage("Patient email should be only string characters")
        .notEmpty().withMessage("Patient name is required")
        .matches(/([A-Za-z\s])+$/).withMessage("Patient name should only have string characters")
        .isLength({ min: 3, max: 100 }).withMessage("Patient name must be between 3 and 100 characters"),
    (0, express_validator_1.body)("patientEmail")
        .optional()
        .isString().withMessage("Patient email should have only string characters")
        .matches(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
        .withMessage("Patient email format is not valid")
], patients_auth_controllers_1.sendSmsCodeRegisterController);
patientsAuth.post("/register", patients_auth_controllers_1.registerPatientController);
patientsAuth.post("/send-sms-code-login", [
    (0, express_validator_1.body)("patientPhone")
        .isString().withMessage("Patient phone must be a string")
        .notEmpty().withMessage("Patient phone is required")
        .matches(/^[0-9]+$/).withMessage("Patient phone should contains only numeric values")
], patients_auth_controllers_1.sendSmsCodeLoginController);
patientsAuth.post("/login", patients_auth_controllers_1.loginPatientController);
patientsAuth.patch("/logout", checkAuthorization_middleware_1.default, patients_auth_controllers_1.logoutPatientController);
exports.default = patientsAuth;
