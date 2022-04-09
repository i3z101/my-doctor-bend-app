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
exports.adminActivePatient = exports.adminDisablePatient = exports.adminPatients = exports.adminActiveDoctor = exports.adminDisableDoctor = exports.adminDoctors = exports.adminMedicines = exports.adminDeleteMedicalFile = exports.adminMedicalFies = exports.adminDeleteAppointment = exports.adminAppointments = exports.adminHomeController = exports.adminLogoutHandler = exports.adminLoginHandler = exports.adminLogin = void 0;
const appointments_1 = __importDefault(require("../../model/appointments"));
const bills_1 = __importDefault(require("../../model/bills"));
const doctors_1 = __importDefault(require("../../model/doctors"));
const medical_files_1 = __importDefault(require("../../model/medical-files"));
const medicines_1 = __importDefault(require("../../model/medicines"));
const patients_1 = __importDefault(require("../../model/patients"));
const admins_1 = __importDefault(require("../../model/admins"));
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.headers.cookie) {
            return res.redirect("/admin");
        }
        return res.render("admin/login", {
            title: "Admin Login"
        });
    }
    catch (err) {
        return next(err);
    }
});
exports.adminLogin = adminLogin;
const adminLoginHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminName, adminPassword } = req.body;
        const admin = yield admins_1.default.findOne({ adminName });
        if (admin != null) {
            const passwordMatched = (0, bcryptjs_1.compareSync)(adminPassword, admin.adminPassword);
            if (passwordMatched) {
                const token = jsonwebtoken_1.default.sign({
                    adminId: admin._id,
                    adminName: admin.adminName
                }, process.env.TOKEN_SECRET_KEY, { expiresIn: '1d' });
                res.cookie("authToken", token);
                return res.redirect("/admin");
            }
        }
        else {
            return res.redirect("/admin");
        }
    }
    catch (err) {
        return next(err);
    }
});
exports.adminLoginHandler = adminLoginHandler;
const adminLogoutHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("authToken");
        return res.redirect("/admin/login");
    }
    catch (err) {
        return next(err);
    }
});
exports.adminLogoutHandler = adminLogoutHandler;
const adminHomeController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let totalPaidAppointments = 0;
    try {
        const allHomePromises = yield Promise.all([
            yield bills_1.default.find({}, { amount: 1, _id: 0 }),
            yield appointments_1.default.count(),
            yield medical_files_1.default.count(),
            yield medicines_1.default.count(),
            yield doctors_1.default.count(),
            yield patients_1.default.count()
        ]);
        const bills = allHomePromises[0];
        for (let i = 0; i < bills.length; i++) {
            totalPaidAppointments += bills[i].amount;
        }
        return res.render('admin/', {
            title: "Admin Home",
            activePath: "/admin",
            adminName: req.user.adminName,
            totalPaidAppointments,
            totalAppointments: allHomePromises[1],
            totalMedicalFiles: allHomePromises[2],
            totalMedicines: allHomePromises[3],
            totalDoctors: allHomePromises[4],
            totalPatients: allHomePromises[5]
        });
    }
    catch (err) {
        return next(err);
    }
});
exports.adminHomeController = adminHomeController;
const adminAppointments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = req.query;
    try {
        const appointments = yield appointments_1.default.find().populate('bill', ["status"]).populate("patient", ["patientName"]).populate("doctor", ["doctorFullName"]).sort({ appointmentDate: -1 });
        switch (status) {
            case "paid":
                const filteredPaid = appointments.filter((appointment) => appointment.bill.status == "paid");
                return res.render('admin/appointments', {
                    title: "Appointments",
                    adminName: req.user.adminName,
                    appointments: filteredPaid,
                    activeLinkPath: '/appointments/paid',
                    activePath: '/appointments'
                });
            case "canceled":
                const filteredCanceled = appointments.filter((appointment) => appointment.bill.status == "canceled");
                return res.render('admin/appointments', {
                    title: "Appointments",
                    adminName: req.user.adminName,
                    appointments: filteredCanceled,
                    activeLinkPath: '/appointments/canceled',
                    activePath: '/appointments'
                });
            default:
                return res.render('admin/appointments', {
                    title: "Appointments",
                    adminName: req.user.adminName,
                    appointments,
                    activeLinkPath: '/appointments',
                    activePath: '/appointments'
                });
        }
    }
    catch (err) {
        return next(err);
    }
});
exports.adminAppointments = adminAppointments;
const adminDeleteAppointment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield appointments_1.default.findByIdAndDelete(req.body.appointmentId);
        return res.redirect('/admin/appointments');
    }
    catch (err) {
        return next(err);
    }
});
exports.adminDeleteAppointment = adminDeleteAppointment;
const adminMedicalFies = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const medicalFiles = yield medical_files_1.default.find().populate("doctor", ["doctorFullName"]).sort({ createdAt: -1 });
        const filteredMedicalFiles = medicalFiles.map((medicalFile) => {
            return Object.assign(Object.assign({}, medicalFile._doc), { createdAt: new Date(medicalFile._doc.createdAt).toDateString() });
        });
        return res.render('admin/medical-files', {
            title: "Medical Files",
            adminName: req.user.adminName,
            activePath: '/medical-files',
            medicalFiles: filteredMedicalFiles,
        });
    }
    catch (err) {
        return next(err);
    }
});
exports.adminMedicalFies = adminMedicalFies;
const adminDeleteMedicalFile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield medical_files_1.default.findByIdAndDelete(req.body.medicalFileId);
        return res.redirect('/admin/medical-files');
    }
    catch (err) {
        return next(err);
    }
});
exports.adminDeleteMedicalFile = adminDeleteMedicalFile;
const adminMedicines = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const medicines = yield medicines_1.default.find().populate("patient", ["patientName"]).sort({ createdAt: -1 });
        const filteredMedicines = medicines.map((medicine) => {
            return Object.assign(Object.assign({}, medicine._doc), { stopDate: medicine._doc.listDates.slice(-1)[0].day, stopTime: new Date(medicine.listDates.slice(-1)[0].day + " " + medicine.listDates.slice(-1)[0].time).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                }) });
        });
        return res.render('admin/medicines', {
            title: "Medicines",
            activePath: '/medicines',
            adminName: req.user.adminName,
            medicines: filteredMedicines,
        });
    }
    catch (err) {
        return next(err);
    }
});
exports.adminMedicines = adminMedicines;
const adminDoctors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctors = yield doctors_1.default.find();
        return res.render('admin/doctors', {
            title: "Doctors",
            adminName: req.user.adminName,
            activePath: '/doctors',
            doctors,
        });
    }
    catch (err) {
        return next(err);
    }
});
exports.adminDoctors = adminDoctors;
const adminDisableDoctor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield doctors_1.default.findByIdAndUpdate(req.body.doctorId, { $set: { isAccountActive: false } });
        return res.redirect('/admin/doctors');
    }
    catch (err) {
        return next(err);
    }
});
exports.adminDisableDoctor = adminDisableDoctor;
const adminActiveDoctor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield doctors_1.default.findByIdAndUpdate(req.body.doctorId, { $set: { isAccountActive: true } });
        return res.redirect('/admin/doctors');
    }
    catch (err) {
        return next(err);
    }
});
exports.adminActiveDoctor = adminActiveDoctor;
const adminPatients = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const patients = yield patients_1.default.find();
        return res.render('admin/patients', {
            title: "Patients",
            adminName: req.user.adminName,
            activePath: '/patients',
            patients,
        });
    }
    catch (err) {
        return next(err);
    }
});
exports.adminPatients = adminPatients;
const adminDisablePatient = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield patients_1.default.findByIdAndUpdate(req.body.patientId, { $set: { isAccountActive: false } });
        return res.redirect('/admin/patients');
    }
    catch (err) {
        return next(err);
    }
});
exports.adminDisablePatient = adminDisablePatient;
const adminActivePatient = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield patients_1.default.findByIdAndUpdate(req.body.patientId, { $set: { isAccountActive: true } });
        return res.redirect('/admin/patients');
    }
    catch (err) {
        return next(err);
    }
});
exports.adminActivePatient = adminActivePatient;
