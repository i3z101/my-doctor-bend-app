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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_1 = __importDefault(require("cookie"));
const checkAdminAuthorizationMiddleWare = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.cookie) {
            return res.redirect('/admin/login');
        }
        else {
            const cookies = cookie_1.default.parse(req.headers.cookie);
            if (cookies.authToken == null || cookies.authToken == undefined) {
                return res.redirect('/admin/login');
            }
            else {
                const token = cookies.authToken;
                const user = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET_KEY);
                req.user = user;
                next();
            }
        }
    }
    catch (err) {
        return next(err);
    }
});
exports.default = checkAdminAuthorizationMiddleWare;
