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
exports.emergencyIo = exports.emergencyPageController = exports.appointmentsIo = exports.appointmentsPageController = exports.paymentStatusController = exports.paymentPageController = void 0;
const expo_server_sdk_1 = __importDefault(require("expo-server-sdk"));
const error_handler_1 = __importDefault(require("../../helper/error-handler"));
const response_handler_1 = __importDefault(require("../../helper/response-handler"));
const bills_1 = __importDefault(require("../../model/bills"));
const paymentPageController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, doctorFullName, date, time } = req.query;
    return res.render('payment/index', {
        amount,
        doctorFullName: doctorFullName === null || doctorFullName === void 0 ? void 0 : doctorFullName.toString().replace(/-/g, " "),
        date: date === null || date === void 0 ? void 0 : date.toString().replace(/-/g, " "),
        time: time === null || time === void 0 ? void 0 : time.toString().replace(/-/g, " "),
        callbackUrl: `https://${req.hostname}`
    });
});
exports.paymentPageController = paymentPageController;
const paymentStatusController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, date, time, appointmentAmount } = req.query;
    try {
        if (status == "paid") {
            yield new bills_1.default({
                date,
                time,
                amount: appointmentAmount
            }).save();
        }
        const bill = yield bills_1.default.findOne({ status: "paid", date: date === null || date === void 0 ? void 0 : date.toString().replace(/-/g, " "), time: time === null || time === void 0 ? void 0 : time.toString().replace(/-/g, " ") });
        if (bill) {
            (0, response_handler_1.default)(res, "Succeed", 200, { billId: bill._id });
        }
        else {
            (0, error_handler_1.default)("Failed", 500);
        }
    }
    catch (err) {
        return next(err);
    }
});
exports.paymentStatusController = paymentStatusController;
const appointmentsPageController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { receiver, pushToken } = req.query;
    const { roomId } = req.params;
    if (receiver) {
        return res.render('socket/appointments/receiver', {
            roomId
        });
    }
    return res.render('socket/appointments/caller', {
        pushToken,
        roomId
    });
});
exports.appointmentsPageController = appointmentsPageController;
const appointmentsIo = (client) => {
    // let connectedPeers = new Map()
    client.join(client.handshake.query.roomId);
    client.on('patient-join', (args) => {
        client.broadcast.to(client.handshake.query.roomId).emit('patient-join', args.payload);
    });
    client.on('doctor-join', (args) => {
        client.broadcast.to(client.handshake.query.roomId).emit('doctor-join', args.payload);
    });
    client.on('pushToken', data => {
        client.broadcast.to(client.handshake.query.roomId).emit('pushToken', data.payload);
    });
    // connectedPeers.set(client.id, client)
    client.on('offer', (data) => __awaiter(void 0, void 0, void 0, function* () {
        //To send call notification only one time to avoid repeating sending.....
        if (data.payload.onlyOne) {
            const expo = new expo_server_sdk_1.default();
            yield expo.sendPushNotificationsAsync([{
                    to: data.payload.pushToken,
                    title: 'A new call',
                    body: "You have a call",
                    sound: 'default',
                    subtitle: 'Respond'
                }]);
        }
        client.broadcast.to(client.handshake.query.roomId).emit('call-user', data.payload);
        // for (const [clientID, client] of connectedPeers.entries()) {
        //     // send to the other peer(s) if any
        //     if (clientID !== data.clientID) {
        //     }
        // }
    }));
    client.on('answer', (data) => {
        client.broadcast.to(client.handshake.query.roomId).emit('answer-made', data.payload);
        // for (const [clientID, client] of connectedPeers.entries()) {
        //     // send to the other peer(s) if any
        //     if (clientID !== data.clientID) {
        //     }
        // }
    });
    client.on('candidate', (data) => {
        client.broadcast.to(client.handshake.query.roomId).emit('candidate', data.payload);
        // for (const [clientID, client] of connectedPeers.entries()) {
        //     // send to the other peer(s) if any
        //     if (clientID !== data.clientID) {
        //     }
        // }
    });
};
exports.appointmentsIo = appointmentsIo;
const emergencyPageController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { receiver, pushToken } = req.query;
    const { roomId } = req.params;
    if (receiver) {
        return res.render('socket/emergency/receiver', {
            roomId
        });
    }
    return res.render('socket/emergency/caller', {
        pushToken,
        roomId
    });
});
exports.emergencyPageController = emergencyPageController;
const emergencyIo = (client) => {
    client.on('doctor-join', args => {
        client.broadcast.emit('doctor-join', Object.assign(Object.assign({}, args), { doctorSocketId: client.id }));
    });
    client.on('patient-join', () => {
        client.broadcast.emit('patient-join');
    });
    client.on('disconnect', () => {
        client.broadcast.emit('doctor-left', client.id);
    });
    client.on('call-doctor', roomId => {
        client.broadcast.emit('patient-calling', roomId);
    });
    client.on('offer', (data) => __awaiter(void 0, void 0, void 0, function* () {
        if (data.payload.onlyOne) {
            const expo = new expo_server_sdk_1.default();
            yield expo.sendPushNotificationsAsync([{
                    to: data.payload.pushToken,
                    title: 'A new call',
                    body: "You have a call",
                    sound: 'default',
                    subtitle: 'Respond'
                }]);
        }
        client.broadcast.emit('call-user', data.payload);
    }));
    client.on('answer', (data) => {
        client.broadcast.emit('answer-made', data.payload);
    });
    client.on('candidate', (data) => {
        client.broadcast.emit('candidate', data.payload);
    });
};
exports.emergencyIo = emergencyIo;
