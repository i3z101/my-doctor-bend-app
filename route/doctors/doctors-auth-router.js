"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const multer_1 = __importDefault(require("multer"));
const doctor_auth_controller_1 = require("../../controller/doctors/doctor-auth-controller");
const checkAuthorization_middleware_1 = __importDefault(require("../../middleware/checkAuthorization-middleware"));
const doctorAuth = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname == "doctorCertificate") {
            cb(null, './public/doctors/certificates');
        }
        else if (file.fieldname == "doctorPhoto") {
            cb(null, './public/doctors/photos');
        }
    },
    filename: (req, file, cb) => {
        if (file.fieldname == "doctorCertificate") {
            cb(null, "dr." + req.body.doctorFullName.replace(" ", "_") + "_certificate_" + file.originalname);
        }
        else if (file.fieldname == "doctorPhoto") {
            cb(null, "dr." + req.body.doctorFullName.replace(" ", "_") + "_photo_" + file.originalname);
        }
    }
});
const upload = (0, multer_1.default)({ storage: storage });
doctorAuth.post("/send-sms-code-registration", (0, multer_1.default)().fields([{ name: "doctorCertificate", maxCount: 1 }, { name: "doctorPhoto", maxCount: 1 }]), [
    (0, express_validator_1.body)("doctorFullName")
        .notEmpty().withMessage("Doctor full name is required")
        .isString().withMessage("Doctor full name must be a string")
        .matches(/([A-Za-z\s])+$/).withMessage("Doctor full name should only have string characters")
        .isLength({ min: 3, max: 100 }).withMessage("Doctor full name must be between 3 and 100 characters"),
    (0, express_validator_1.body)("doctorPhone")
        .isString().withMessage("Doctor phone must be a string")
        .notEmpty().withMessage("Doctor phone is required")
        .matches(/^[0-9]+$/).withMessage("Doctor phone should contains only numeric values")
        .isLength({ max: 12 }).withMessage("Doctor phone must be 12 numbers"),
    (0, express_validator_1.body)("doctorEmail")
        .notEmpty().withMessage("Doctor email is required")
        .isString().withMessage("Doctor email should have only string characters")
        .matches(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
        .withMessage("Patient email format is not valid"),
    (0, express_validator_1.body)("doctorGraduatedFrom")
        .notEmpty().withMessage("Doctor graduation university name is required")
        .isString().withMessage("Doctor graduation university name must be a string")
        .matches(/([A-Za-z\s])+$/).withMessage("Doctor graduation university name should only have string characters")
        .isLength({ min: 3, max: 100 }).withMessage("Doctor graduation university name must be between 3 and 100 characters"),
    (0, express_validator_1.body)("doctorCertificate")
        .custom((value, { req }) => {
        const file = req.files.doctorCertificate[0];
        if (!file) {
            return false;
        }
        else {
            return true;
        }
    }).withMessage("Doctor certificate is required")
        .custom((value, { req }) => {
        const file = req.files.doctorCertificate[0];
        if (file.mimetype != "image/png" && file.mimetype != "image/jpg" && file.mimetype != "image/jpeg" && file.mimetype != "application/pdf") {
            return false;
        }
        else {
            return true;
        }
    }).withMessage("Doctor certificate must be whether png, jpg, jpeg, or pdf only")
        .custom((value, { req }) => {
        const file = req.files.doctorCertificate[0];
        if (file.size > 2000000) {
            return false;
        }
        else {
            return true;
        }
    }).withMessage("Doctor certificate must not exceed 2MB"),
    (0, express_validator_1.body)("doctorPhoto")
        .custom((value, { req }) => {
        const file = req.files.doctorPhoto[0];
        if (!file) {
            return false;
        }
        else {
            return true;
        }
    }).withMessage("Doctor photo is required")
        .custom((value, { req }) => {
        const file = req.files.doctorPhoto[0];
        if (file.mimetype != "image/png" && file.mimetype != "image/jpg" && file.mimetype != "image/jpeg" && file.mimetype != "application/pdf") {
            return false;
        }
        else {
            return true;
        }
    }).withMessage("Doctor photo must be whether png, jpg, jpeg, or pdf only")
        .custom((value, { req }) => {
        const file = req.files.doctorPhoto[0];
        if (file.size > 2000000) {
            return false;
        }
        else {
            return true;
        }
    }).withMessage("Doctor photo must not exceed 2MB"),
    (0, express_validator_1.check)("doctorClinic")
        .notEmpty().withMessage("Doctor majoring is required")
        .isString().withMessage("Doctor majoring must be a string")
        .matches(/([A-Za-z\s])+$/).withMessage("Doctor majoring should only have string characters")
        .isLength({ min: 3, max: 100 }).withMessage("Doctor majoring should be between 3 and 100 characters"),
    (0, express_validator_1.check)("doctorPricePerHour")
        .notEmpty().withMessage("Doctor price is required")
        .isNumeric().withMessage("Doctor price must be numeric")
        .matches(/^[0-9]+$/).withMessage("Doctor price should only have numeric values")
], doctor_auth_controller_1.sendSmsCodeRegisterController);
doctorAuth.post('/register', upload.fields([{ name: "doctorCertificate", maxCount: 1 }, { name: "doctorPhoto", maxCount: 1 }]), doctor_auth_controller_1.registerDoctorController);
doctorAuth.post('/send-sms-code-login', [
    (0, express_validator_1.body)("doctorPhone")
        .isString().withMessage("Doctor phone must be a string")
        .notEmpty().withMessage("Doctor phone is required")
        .matches(/^[0-9]+$/).withMessage("Doctor phone should contains only numeric values")
        .isLength({ max: 12 }).withMessage("Doctor phone must be 12 numbers"),
], doctor_auth_controller_1.sendSmsCodeLoginController);
doctorAuth.post('/login', doctor_auth_controller_1.loginDoctorController);
doctorAuth.patch('/logout', checkAuthorization_middleware_1.default, doctor_auth_controller_1.logoutDoctorController);
exports.default = doctorAuth;
