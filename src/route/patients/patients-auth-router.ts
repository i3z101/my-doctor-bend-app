import express, { Request, Response } from 'express';
import {loginPatientController, registerPatientController, sendSmsCodeLoginController, sendSmsCodeRegisterController} from '../../controller/patients/patients-auth/patients-auth-controllers';
import {body} from 'express-validator';

const patientsAuth = express.Router();


patientsAuth.post("/send-sms-code-registration", [
    body("patientPhone")
    .isString().withMessage("Patient phone must be a string")
    .notEmpty().withMessage("Patient phone is required")
    .matches(/^[0-9]+$/).withMessage("Patient phone should contains only numeric values")
    .isLength({max: 12}).withMessage("Patient phone must be 12 numbers"),
    body("patientName")
    .isString().withMessage("Patient email should be only string characters")
    .notEmpty().withMessage("Patient name is required")
    .matches(/([A-Za-z\s])+$/).withMessage("Patient name should only have string characters")
    .isLength({min: 3, max:100}).withMessage("Patient name must be between 3 and 100 characters"),
    body("patientEmail")
    .optional()
    .isString().withMessage("Patient email should have only string characters")
    .matches( /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    .withMessage("Patient email format is not valid")
], sendSmsCodeRegisterController);

patientsAuth.post("/register", registerPatientController);

patientsAuth.post("/send-sms-code-login", [
    body("patientPhone")
    .isString().withMessage("Patient phone must be a string")
    .notEmpty().withMessage("Patient phone is required")
    .matches(/^[0-9]+$/).withMessage("Patient phone should contains only numeric values")
] , sendSmsCodeLoginController);

patientsAuth.post("/login", loginPatientController);

export default patientsAuth;
