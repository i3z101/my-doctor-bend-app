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
exports.updateMedicalFile = exports.addMedicalFile = void 0;
const express_validator_1 = require("express-validator");
const error_handler_1 = __importDefault(require("../../../helper/error-handler"));
const response_handler_1 = __importDefault(require("../../../helper/response-handler"));
const medical_files_1 = __importDefault(require("../../../model/medical-files"));
const addMedicalFile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileName, disease, clinic, patientName, doctor, medicine } = req.body;
    try {
        const validations = (0, express_validator_1.validationResult)(req);
        if (!validations.isEmpty()) {
            (0, error_handler_1.default)("Validation error(s)", 422, validations.array());
        }
        yield new medical_files_1.default({
            disease,
            clinic,
            medicine,
            doctor,
            patientName,
            fileName: fileName,
            patient: req.user.patientId
        }).save();
        (0, response_handler_1.default)(res, "Medical file added successfully", 201);
    }
    catch (err) {
        return next(err);
    }
});
exports.addMedicalFile = addMedicalFile;
const updateMedicalFile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileName, disease, clinic, patientName, doctor, medicine } = req.body;
    try {
        const validations = (0, express_validator_1.validationResult)(req);
        if (!validations.isEmpty()) {
            (0, error_handler_1.default)("Validation error(s)", 422, validations.array());
        }
        yield medical_files_1.default.findOneAndUpdate({ fileName: fileName }, { $set: {
                disease,
                clinic,
                medicine,
                doctor,
                patientName,
                fileName: fileName,
                patient: req.user.patientId
            } });
        (0, response_handler_1.default)(res, "Medical file Updated successfully", 201);
    }
    catch (err) {
        return next(err);
    }
});
exports.updateMedicalFile = updateMedicalFile;
