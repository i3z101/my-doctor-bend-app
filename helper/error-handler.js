"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (message, statusCode, validations) => {
    const error = new Error();
    error.message = message,
        error.statusCode = statusCode;
    error.validations = validations ? validations.map((value) => value.msg) : [];
    throw error;
};
