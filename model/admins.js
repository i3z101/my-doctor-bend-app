"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const AdminSchema = new Schema({
    adminName: {
        type: String,
        required: true
    },
    adminPassword: {
        type: String,
        required: true
    }
}, {
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt"
    }
});
const Admin = mongoose_1.default.model("admins", AdminSchema);
exports.default = Admin;
