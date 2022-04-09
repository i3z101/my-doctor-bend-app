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
exports.updateMedcine = exports.addMedicine = void 0;
const express_validator_1 = require("express-validator");
const error_handler_1 = __importDefault(require("../../../helper/error-handler"));
const response_handler_1 = __importDefault(require("../../../helper/response-handler"));
const medicines_1 = __importDefault(require("../../../model/medicines"));
const addMedicine = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId, medicineName, shouldTakeItEvery, timesPerDay, tabletsPerTime, numberOfDays, startDate, startTime, listDates } = req.body;
    try {
        const validations = (0, express_validator_1.validationResult)(req);
        if (!validations.isEmpty()) {
            (0, error_handler_1.default)("Validation error(s)", 422, validations.array());
        }
        const medicine = yield new medicines_1.default({
            eventId,
            medicineName,
            numberOfDays,
            shouldTakeItEvery,
            tabletsPerTime,
            startDate,
            startTime,
            timesPerDay,
            listDates,
            patient: req.user.patientId
        }).save();
        (0, response_handler_1.default)(res, "Medicine added successfully", 201, { medicineId: medicine._id });
    }
    catch (err) {
        return next(err);
    }
});
exports.addMedicine = addMedicine;
const updateMedcine = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { medicineId, eventId, medicineName, shouldTakeItEvery, timesPerDay, tabletsPerTime, numberOfDays, startDate, startTime, listDates } = req.body;
    try {
        const validations = (0, express_validator_1.validationResult)(req);
        if (!validations.isEmpty()) {
            (0, error_handler_1.default)("Validation error(s)", 422, validations.array());
        }
        yield medicines_1.default.findByIdAndUpdate(medicineId, { $set: {
                eventId,
                medicineName,
                numberOfDays,
                shouldTakeItEvery,
                tabletsPerTime,
                startDate,
                startTime,
                timesPerDay,
                listDates
            } });
        (0, response_handler_1.default)(res, "Medicine updated successfully", 200);
    }
    catch (err) {
        return next(err);
    }
});
exports.updateMedcine = updateMedcine;
