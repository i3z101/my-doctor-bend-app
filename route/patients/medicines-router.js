"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const medicines_controller_1 = require("../../controller/patients/medicines/medicines-controller");
const checkAuthorization_middleware_1 = __importDefault(require("../../middleware/checkAuthorization-middleware"));
const medicinesRouter = express_1.default.Router();
medicinesRouter.post("/add-medicine", checkAuthorization_middleware_1.default, [
    (0, express_validator_1.body)("medicineName")
        .isString().withMessage("Disease name must be a string")
        .notEmpty().withMessage("Disease name is required")
        .matches(/[A-Za-z\s0-9]+$/).withMessage("Disease name should only have string and numeric characters")
        .isLength({ min: 3, max: 150 }).withMessage("Disease name must be between 3 and 100 characters"),
], medicines_controller_1.addMedicine);
medicinesRouter.patch("/update-medicine", checkAuthorization_middleware_1.default, medicines_controller_1.updateMedcine);
exports.default = medicinesRouter;
