"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const extra_controller_1 = require("../../controller/extra-controller/extra-controller");
const htmlPages = express_1.default.Router();
htmlPages.get('/payment', extra_controller_1.paymentPageController);
htmlPages.get('/payment-status', extra_controller_1.paymentStatusController);
htmlPages.get('/appointments/:roomId', extra_controller_1.appointmentsPageController);
htmlPages.get('/emergency/:roomId', extra_controller_1.emergencyPageController);
exports.default = htmlPages;
