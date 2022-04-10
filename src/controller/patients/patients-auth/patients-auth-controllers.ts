import {NextFunction, Request, response, Response } from "express";
import 'dotenv/config';
import Patient from "../../../model/patients";
import {validationResult} from 'express-validator';
import jwt from 'jsonwebtoken';
import errorHandler from "../../../helper/error-handler";
import responseHandler from "../../../helper/response-handler";
import { sendSms, verfiySms } from "../../../helper/sms-messages-helper";
import { RequestWithExtraProps } from "../../../helper/types";



export const sendSmsCodeRegisterController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const {patientPhone} = req.body;
    try {
        const validations = validationResult(req);
        if(!validations.isEmpty()) {
            errorHandler("Validation error(s)", 422, validations.array());
        }
        const existPatient = await Patient.findOne({patientPhone});
        if(existPatient) {
            errorHandler("Patient is already registered", 422);
        }
        await sendSms(patientPhone);
        responseHandler(res, "Code sent successfully", 200);

    }catch(err:any) {
        return next(err);
    }

}

export const registerPatientController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const {patientPhone, patientName, patientEmail, code, pushToken} = req.body;
    try {
        await verfiySms(code, patientPhone);
        const patient: any = await new Patient({
            patientName,
            patientPhone,
            patientEmail,
            pushToken
        }).save();
        const patientInfo = {
            patientId: patient._id,
            ...patient._doc
        }
        const encodeToken = jwt.sign(patientInfo, process.env.TOKEN_SECRET_KEY as string, {expiresIn: '120d'});
        const responsePatientInfo = {
            ...patientInfo,
            pushToken,
            patientId: patient._id,
            authToken: encodeToken,
            isGuest: false
        }   
    
        responseHandler(res, "Patient registered successfully", 201, {patient: responsePatientInfo});
    }catch(err: any) {
        if(err.message == `The requested resource /Services/${process.env.SERVICE_SID}/VerificationCheck was not found`){
            err.message = "Code is expired"
        }
        return next(err);
    }
    
    

}

export const sendSmsCodeLoginController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const {patientPhone} = req.body;
    try {
        const validations = validationResult(req);
        if(!validations.isEmpty()) {
            errorHandler("Validation error(s)", 422, validations.array());
        }
        const existPatient = await Patient.findOne({patientPhone});
        if(!existPatient) {
            errorHandler("Patient is not found", 404);
        }else {
            if(!existPatient.isAccountActive) {
                errorHandler("Patient's account is not active. Please contact us", 404);
            }
        }
        await sendSms(patientPhone);
        responseHandler(res, "Code sent successfully", 200)
    }catch(err:any) {
        return next(err);
    }

}

export const loginPatientController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const {patientPhone, code, pushToken} = req.body;
    try {
        await verfiySms(code, patientPhone);
        const patient: any = await Patient.findOne({patientPhone});
        if(patient) {
            await patient.updateOne({$set: {pushToken}});
            const patientInfo = {
                patientId: patient._id,
                ...patient._doc
            }
            const encodeToken = jwt.sign(patientInfo, process.env.TOKEN_SECRET_KEY as string, {expiresIn: '120d'});
        
            const responsePatientInfo = {
                ...patientInfo,
                pushToken,
                authToken: encodeToken,
                isGuest: false
            }   
        
            responseHandler(res, "Welcome back", 200, {patient:responsePatientInfo});
        }
        
        
    }catch(err: any) {
        if(err.message == `The requested resource /Services/${process.env.SERVICE_SID}/VerificationCheck was not found`){
            err.message = "Code is expired"
        }
        return next(err);
    }
    
}


export const logoutPatientController = async (req: RequestWithExtraProps, res: Response, next: NextFunction): Promise<any> => {

    try {
        await Patient.findByIdAndUpdate(req.user.patientId, {$set: {pushToken: ""}});
        responseHandler(res, "Patient logged out succesfully", 200);
        
        
    }catch(err: any) {
        if(err.message == `The requested resource /Services/${process.env.SERVICE_SID}/VerificationCheck was not found`){
            err.message = "Code is expired"
        }
        return next(err);
    }
}
