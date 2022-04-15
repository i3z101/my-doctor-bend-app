"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const project_init_1 = __importDefault(require("./helper/project-init"));
const application = new project_init_1.default();
application.createApp();
