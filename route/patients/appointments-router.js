"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const appointments_controller_1 = require("../../controller/patients/appointments/appointments-controller");
const checkAuthorization_middleware_1 = __importDefault(require("../../middleware/checkAuthorization-middleware"));
const appointmentsRouter = express_1.default.Router();
appointmentsRouter.post("/add-new-appointment", checkAuthorization_middleware_1.default, appointments_controller_1.addNewAppointment);
appointmentsRouter.patch("/update-appointment", checkAuthorization_middleware_1.default, appointments_controller_1.updateAppointment);
appointmentsRouter.delete("/delete-appointment", checkAuthorization_middleware_1.default, appointments_controller_1.deleteAppointment);
exports.default = appointmentsRouter;
