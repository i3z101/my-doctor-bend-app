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
const error_handler_1 = __importDefault(require("../helper/error-handler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const checkAuthorizationMiddleWare = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authToken = req.headers.authorization;
        if (!authToken) {
            (0, error_handler_1.default)("You are not authorized", 401);
            return;
        }
        else {
            const token = authToken.split(" ")[1];
            const user = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET_KEY);
            req.user = user;
            next();
        }
    }
    catch (err) {
        return next(err);
    }
});
exports.default = checkAuthorizationMiddleWare;
