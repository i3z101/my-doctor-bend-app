"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GROUPING_DOCTORS_URL = exports.GROUPING_PATIENTS_URL = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const appointments_router_1 = __importDefault(require("./route/patients/appointments-router"));
const medical_files_router_1 = __importDefault(require("./route/patients/medical-files-router"));
const medicines_router_1 = __importDefault(require("./route/patients/medicines-router"));
const patients_auth_router_1 = __importDefault(require("./route/patients/patients-auth-router"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const doctors_auth_router_1 = __importDefault(require("./route/doctors/doctors-auth-router"));
const shared_endpoint_1 = __importDefault(require("./route/shared/shared-endpoint"));
const extra_routes_1 = __importDefault(require("./route/extra-routes/extra-routes"));
const socket_io_1 = require("socket.io");
const extra_controller_1 = require("./controller/extra-controller/extra-controller");
const admins_route_1 = __importDefault(require("./route/admins/admins-route"));
const PORT = process.env.PORT || 5000;
exports.GROUPING_PATIENTS_URL = "/api/v1/patients";
exports.GROUPING_DOCTORS_URL = "/api/v1/doctors";
const app = (0, express_1.default)();
app.use(express_1.default.static('public'));
app.set('view engine', 'ejs');
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false
})); //Refer to it back for more understanding
app.use((0, compression_1.default)()); //Refer to it back for more understanding
//=========================//
//FOR PATIENTS
app.use(`${exports.GROUPING_PATIENTS_URL}`, patients_auth_router_1.default),
    app.use(`${exports.GROUPING_PATIENTS_URL}/medical-files`, medical_files_router_1.default);
app.use(`${exports.GROUPING_PATIENTS_URL}/medicines`, medicines_router_1.default);
app.use(`${exports.GROUPING_PATIENTS_URL}/appointments`, appointments_router_1.default);
//=========================//
//FOR DOCTORS//
app.use(`${exports.GROUPING_DOCTORS_URL}`, doctors_auth_router_1.default);
//===============//
//FOR SHARED ROUTES BETWEEN PATIENTS & DOCTORS
app.use("/api/v1/shared", shared_endpoint_1.default);
//===============//
//FOR HTML PAGES
app.use(extra_routes_1.default);
//For admins
app.use("/admin", admins_route_1.default);
//===============//
//FOR ERROR HANDLING
app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "",
        statusCode: err.statusCode || 500,
        validations: err.validations || []
    });
});
mongoose_1.default.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@mydoctor-cluster.yiuwg.mongodb.net/my-doctor?retryWrites=true&w=majority`).then((m) => {
    const server = app.listen(5000, () => {
        console.log("SERVER IS RUNNING");
    });
    const io = new socket_io_1.Server(server);
    const appointment = io.of('/appointments');
    const emergency = io.of('/emergency');
    appointment.on('connection', client => {
        (0, extra_controller_1.appointmentsIo)(client);
    });
    emergency.on('connection', client => {
        (0, extra_controller_1.emergencyIo)(client);
    });
});
exports.default = app;
