import { NextFunction, Request, response, Response } from "express"
import { validationResult } from "express-validator";
import multer from "multer";
import { Json } from "twilio/lib/interfaces";
import { RequestWithExtraProps, ResponseType } from "../../helper/types";
import Doctor  from "../../model/doctors";
import formidable from 'formidable';
import path from "path";
import fs from "fs/promises";
import jwt from "jsonwebtoken";
import HelperClass from "../../helper/helper-class";


export const sendSmsCodeRegisterController = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    const {doctorPhone} = req.body;
    
    try{
        const validations = validationResult(req);
        if(!validations.isEmpty()) {
            HelperClass.errorHandler("Validation error(s)", 422, validations.array());
        }
        const existDoctor = await Doctor.findOne({doctorPhone});
        if(existDoctor) {
            HelperClass.errorHandler("Doctor is registered already", 422);
        }
        await HelperClass.sendSms(doctorPhone);
    }catch(err: any) {
        return next(err);
    }
    
    HelperClass.responseHandler(res, "Code sent successfully", 200);

}

export const registerDoctorController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const {doctorFullName, doctorPhone, doctorEmail, doctorClinic, doctorPricePerHour, doctorGraduatedFrom ,code, pushToken} = req.body;
    try {
        await HelperClass.verfiySms(code, doctorPhone);
        if(req.files){
            const files = req.files as any;
            
            const doctor = await new Doctor({
                doctorFullName,
                doctorPhone,
                doctorEmail,
                doctorClinic,
                doctorGraduatedFrom,
                doctorPricePerHour,
                pushToken,
                doctorCertificate: `/doctors/certificates/${files.doctorCertificate[0].filename}`,
                doctorPhoto: `/doctors/photos/${files.doctorPhoto[0].filename}`,
                acquiredAppointments: [],
            }).save();

            const doctorInfo = {
                doctorId: doctor._id,
                doctorFullName:doctor.doctorFullName ,
                doctorPhone: doctor.doctorPhone,
                doctorEmail: doctor.doctorEmail,
            }
            const encodeToken = jwt.sign(doctorInfo, process.env.TOKEN_SECRET_KEY as string, {expiresIn: '120d'});
            const responseDoctorInfo = {
                ...doctorInfo,
                authToken: encodeToken,
                pushToken
            }
            HelperClass.responseHandler(res, "Welcome in our family", 201, {doctor: responseDoctorInfo});
        }

    }catch(err:any) {
        if(err.message == `The requested resource /Services/${process.env.SERVICE_SID}/VerificationCheck was not found`){
            err.message = "Code is expired"
        }
        if(req.file) {
            //Delete file if there is any caught error
            Promise.all([
                await fs.unlink(path.join(process.cwd(), "public/doctors/certificates",  "dr." + req.body.doctorFullName.replace(" ", "_") + "_certificate." + req.file.originalname)),
                await fs.unlink(path.join(process.cwd(), "public/doctors/photos",  "dr." + req.body.doctorFullName.replace(" ", "_") + "_certificate." + req.file.originalname))
            ])
        }
        return next(err);
    }
    
}

export const sendSmsCodeLoginController = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    const {doctorPhone} = req.body;
    
    try {
        const validations = validationResult(req)
        if(!validations.isEmpty()) {
            HelperClass.errorHandler("Validation error(s)", 422, validations.array());
        }
        
        const existDoctor = await Doctor.findOne({doctorPhone});

        if(!existDoctor) {
            HelperClass.errorHandler("Doctor is not found", 404);
        }else {
            if(!existDoctor.isAccountActive) {
                HelperClass.errorHandler("Doctor's account is not active. Please contact us", 404);
            }
        }

        await HelperClass.sendSms(doctorPhone);

    }catch(err: any) {
        return next(err);
    }

    HelperClass.responseHandler(res, "Code send successfully", 200);
}

export const loginDoctorController = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    const {doctorPhone, code, pushToken} = req.body;
    try {
        await HelperClass.verfiySms(code, doctorPhone);
        const doctor: any = await Doctor.findOne({doctorPhone});
        if(doctor != null) {
            await doctor.updateOne({$set: {pushToken}});
            const doctorInfo = {
                ...doctor._doc,
                doctorId: doctor._id,
            }
            const encodeToken = jwt.sign(doctorInfo, process.env.TOKEN_SECRET_KEY as string, {expiresIn: '120d'});
            const responseDoctorInfo = {
                ...doctorInfo,
                authToken: encodeToken,
                pushToken,
            }
            
            HelperClass.responseHandler(res, "Welcome back", 200, {doctor: responseDoctorInfo});
        }
    }catch(err: any) {
        if(err.message == `The requested resource /Services/${process.env.SERVICE_SID}/VerificationCheck was not found`){
            err.message = "Code is expired"
        }
    }
}

export const logoutDoctorController = async(req: RequestWithExtraProps, res: Response, next: NextFunction): Promise<any> => {
    try {
        await Doctor.findByIdAndUpdate(req.user.doctorId, {$set: {pushToken: ""}});
        HelperClass.responseHandler(res, "Doctor logged out successfully", 200);
    }catch(err: any) {
        if(err.message == `The requested resource /Services/${process.env.SERVICE_SID}/VerificationCheck was not found`){
            err.message = "Code is expired"
        }
    }
}