"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const BillSchema = new Schema({
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    amount: {
        type: Schema.Types.Number,
        required: true
    },
    status: {
        type: String,
        default: "paid"
    },
    billPath: {
        type: String,
        default: ""
    }
}, {
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt"
    },
});
const Bill = mongoose_1.default.model("bills", BillSchema);
exports.default = Bill;
