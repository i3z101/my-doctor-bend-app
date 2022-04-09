"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkAuthorization_middleware_1 = __importDefault(require("../../middleware/checkAuthorization-middleware"));
const express_validator_1 = require("express-validator");
const medical_files_controller_1 = require("../../controller/patients/medical-files/medical-files-controller");
const medicalFilesRouter = express_1.default.Router();
medicalFilesRouter.post("/add-medical-file", checkAuthorization_middleware_1.default, [
    (0, express_validator_1.body)("disease")
        .isString().withMessage("Disease name must be a string")
        .notEmpty().withMessage("Disease name is required")
        .matches(/[A-Za-z\s0-9]+$/).withMessage("Disease name should only have string and numeric characters")
        .isLength({ min: 3, max: 100 }).withMessage("Disease name must be between 3 and 100 characters"),
    (0, express_validator_1.body)("patientName")
        .isString().withMessage("Patient name must be a string")
        .notEmpty().withMessage("Patient name is required")
        .matches(/([A-Za-z\s])+$/).withMessage("Patient name should only have string characters")
        .isLength({ min: 3, max: 100 }),
    (0, express_validator_1.body)("medicine")
        .isString().withMessage("Medicine name(s) must be a string")
        .notEmpty().withMessage("Medicine name(s) is required")
        .matches(/^[^^5*&^%$#@!~+-=?؟][A-Za-z\s,]+$/).withMessage("Medicine name(s) must contain string characters only with colon as a sperator")
        .isLength({ min: 3, max: 150 }).withMessage("Medicine name should be between 3 and 150 characters")
], medical_files_controller_1.addMedicalFile);
medicalFilesRouter.patch("/update-medical-file", checkAuthorization_middleware_1.default, [
    (0, express_validator_1.body)("disease")
        .isString().withMessage("Disease name must be a string")
        .notEmpty().withMessage("Disease name is required")
        .matches(/[A-Za-z\s0-9]+$/).withMessage("Disease name should only have string and numeric characters")
        .isLength({ min: 3, max: 100 }).withMessage("Disease name must be between 3 and 100 characters"),
    (0, express_validator_1.body)("patientName")
        .isString().withMessage("Patient name must be a string")
        .notEmpty().withMessage("Patient name is required")
        .matches(/([A-Za-z\s])+$/).withMessage("Patient name should only have string characters")
        .isLength({ min: 3, max: 100 }),
    (0, express_validator_1.body)("medicine")
        .isString().withMessage("Medicine name(s) must be a string")
        .notEmpty().withMessage("Medicine name(s) is required")
        .matches(/^[^^5*&^%$#@!~+-=?؟][A-Za-z\s,]+$/).withMessage("Medicine name(s) must contain string characters only with colon as a sperator")
        .isLength({ min: 3, max: 150 }).withMessage("Medicine name should be between 3 and 150 characters")
], medical_files_controller_1.updateMedicalFile);
exports.default = medicalFilesRouter;
