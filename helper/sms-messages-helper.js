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
exports.verfiySms = exports.sendSms = void 0;
const twilio_1 = __importDefault(require("twilio"));
const error_handler_1 = __importDefault(require("./error-handler"));
const twilioSMS = (0, twilio_1.default)(process.env.ACCOUNT_ID, process.env.AUTH_TOKEN);
const sendSms = (phone) => __awaiter(void 0, void 0, void 0, function* () {
    const smsMsg = yield twilioSMS.verify.services(process.env.SERVICE_SID).verifications.create({
        to: `+${phone}`,
        channel: 'sms'
    });
    if (smsMsg.status != "pending") {
        (0, error_handler_1.default)("Doctor is registered already", 422);
    }
});
exports.sendSms = sendSms;
const verfiySms = (code, phone) => __awaiter(void 0, void 0, void 0, function* () {
    const smsCodeVerfication = yield twilioSMS.verify.services(process.env.SERVICE_SID).verificationChecks.create({
        to: `+${phone}`,
        code,
    });
    if (smsCodeVerfication.status != "approved") {
        (0, error_handler_1.default)("Code is expired", 500);
    }
});
exports.verfiySms = verfiySms;
