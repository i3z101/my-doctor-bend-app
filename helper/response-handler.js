"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (res, message, statusCode, otherData) => {
    return res.status(statusCode).json(Object.assign({ message: message, statusCode: statusCode }, otherData));
};
