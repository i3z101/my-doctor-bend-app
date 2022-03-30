import express, { NextFunction, Request, Response } from "express";
import { fetchAllData, sendSmsCodeAgain } from "../../controller/shared/shared-endpoints-controller";
import checkAuthorizationMiddleWare from "../../middleware/checkAuthorization-middleware";
import Appointment from "../../model/appointments";
import { Server } from "socket.io";

const sharedEndPoints = express.Router();


sharedEndPoints.post('/send-sms-code-again', sendSmsCodeAgain)

sharedEndPoints.get('/all-data', checkAuthorizationMiddleWare ,fetchAllData)




export default sharedEndPoints;