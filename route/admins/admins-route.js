"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admins_controller_1 = require("../../controller/admins/admins-controller");
const checkAdminAuthorization_middleware_1 = __importDefault(require("../../middleware/checkAdminAuthorization-middleware"));
const adminsRoute = express_1.default.Router();
adminsRoute.get('/login', admins_controller_1.adminLogin);
adminsRoute.post('/login', admins_controller_1.adminLoginHandler);
adminsRoute.post('/logout', admins_controller_1.adminLogoutHandler);
adminsRoute.get('/', checkAdminAuthorization_middleware_1.default, admins_controller_1.adminHomeController);
adminsRoute.get('/appointments', checkAdminAuthorization_middleware_1.default, admins_controller_1.adminAppointments);
adminsRoute.post('/appointments/delete-appointment', checkAdminAuthorization_middleware_1.default, admins_controller_1.adminDeleteAppointment);
adminsRoute.get('/medical-files', checkAdminAuthorization_middleware_1.default, admins_controller_1.adminMedicalFies);
adminsRoute.post('/medical-files/delete-medical-file', checkAdminAuthorization_middleware_1.default, admins_controller_1.adminDeleteMedicalFile);
adminsRoute.get('/medicines', checkAdminAuthorization_middleware_1.default, admins_controller_1.adminMedicines);
adminsRoute.get('/doctors', checkAdminAuthorization_middleware_1.default, admins_controller_1.adminDoctors);
adminsRoute.post('/doctors/disable-doctor', checkAdminAuthorization_middleware_1.default, admins_controller_1.adminDisableDoctor);
adminsRoute.post('/doctors/active-doctor', checkAdminAuthorization_middleware_1.default, admins_controller_1.adminActiveDoctor);
adminsRoute.get('/patients', checkAdminAuthorization_middleware_1.default, admins_controller_1.adminPatients);
adminsRoute.post('/patients/disable-patient', checkAdminAuthorization_middleware_1.default, admins_controller_1.adminDisablePatient);
adminsRoute.post('/patients/active-patient', checkAdminAuthorization_middleware_1.default, admins_controller_1.adminActivePatient);
exports.default = adminsRoute;