"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const shared_endpoints_controller_1 = require("../../controller/shared/shared-endpoints-controller");
const checkAuthorization_middleware_1 = __importDefault(require("../../middleware/checkAuthorization-middleware"));
const sharedEndPoints = express_1.default.Router();
sharedEndPoints.post('/send-sms-code-again', shared_endpoints_controller_1.sendSmsCodeAgain);
sharedEndPoints.get('/all-data', checkAuthorization_middleware_1.default, shared_endpoints_controller_1.fetchAllData);
exports.default = sharedEndPoints;
