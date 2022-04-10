import express, { Request, Response } from 'express';
import { body, check } from 'express-validator';
import multer from 'multer';
import {loginDoctorController, registerDoctorController, sendSmsCodeRegisterController, sendSmsCodeLoginController, logoutDoctorController } from '../../controller/doctors/doctor-auth-controller';
import checkAuthorizationMiddleWare from '../../middleware/checkAuthorization-middleware';

const doctorAuth = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if(file.fieldname == "doctorCertificate") {
            cb(null, './public/doctors/certificates');
        }else if(file.fieldname == "doctorPhoto") {
            cb(null, './public/doctors/photos');
        }
    },
    filename: (req, file, cb) => {
        if(file.fieldname == "doctorCertificate") {
            cb(null, "dr." + req.body.doctorFullName.replace(" ", "_") + "_certificate_" + file.originalname);
        }else if(file.fieldname == "doctorPhoto") {
            cb(null, "dr." + req.body.doctorFullName.replace(" ", "_") + "_photo_" + file.originalname);
        }
    }
})


const upload = multer({storage: storage});

doctorAuth.post("/send-sms-code-registration", multer().fields([{name: "doctorCertificate", maxCount:1}, {name: "doctorPhoto", maxCount:1}]) , [
    body("doctorFullName")
    .notEmpty().withMessage("Doctor full name is required")
    .isString().withMessage("Doctor full name must be a string")
    .matches(/([A-Za-z\s])+$/).withMessage("Doctor full name should only have string characters")
    .isLength({min: 3, max:100}).withMessage("Doctor full name must be between 3 and 100 characters"),
    body("doctorPhone")
    .isString().withMessage("Doctor phone must be a string")
    .notEmpty().withMessage("Doctor phone is required")
    .matches(/^[0-9]+$/).withMessage("Doctor phone should contains only numeric values")
    .isLength({max: 12}).withMessage("Doctor phone must be 12 numbers"),
    body("doctorEmail")
    .notEmpty().withMessage("Doctor email is required")
    .isString().withMessage("Doctor email should have only string characters")
    .matches( /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    .withMessage("Patient email format is not valid"),
    body("doctorGraduatedFrom")
    .notEmpty().withMessage("Doctor graduation university name is required")
    .isString().withMessage("Doctor graduation university name must be a string")
    .matches(/([A-Za-z\s])+$/).withMessage("Doctor graduation university name should only have string characters")
    .isLength({min: 3, max:100}).withMessage("Doctor graduation university name must be between 3 and 100 characters"),
    body("doctorCertificate")
    .custom((value, {req})=> {
        const file = req.files.doctorCertificate[0];
        if(!file){
            return false;
        }else {
            return true;
        }
    }).withMessage("Doctor certificate is required")
    .custom((value, {req})=> {
        const file = req.files.doctorCertificate[0];
        if(file.mimetype != "image/png" && file.mimetype != "image/jpg" && file.mimetype != "image/jpeg" && file.mimetype != "application/pdf"){
            return false;
        }else {
            return true;
        }
    }).withMessage("Doctor certificate must be whether png, jpg, jpeg, or pdf only")
    .custom((value, {req})=> {
        const file = req.files.doctorCertificate[0];
        if(file.size > 2000000){
            return false;
        }else {
            return true
        }
    }).withMessage("Doctor certificate must not exceed 2MB"),
    body("doctorPhoto")
    .custom((value, {req})=> {
        const file = req.files.doctorPhoto[0];
        
        if(!file){
            return false;
        }else {
            return true;
        }
    }).withMessage("Doctor photo is required")
    .custom((value, {req})=> {
        const file = req.files.doctorPhoto[0];
        if(file.mimetype != "image/png" && file.mimetype != "image/jpg" && file.mimetype != "image/jpeg" && file.mimetype != "application/pdf"){
            return false;
        }else {
            return true;
        }
    }).withMessage("Doctor photo must be whether png, jpg, jpeg, or pdf only")
    .custom((value, {req})=> {
        const file = req.files.doctorPhoto[0];
        if(file.size > 2000000){
            return false;
        }else {
            return true
        }
    }).withMessage("Doctor photo must not exceed 2MB"),
    check("doctorClinic")
    .notEmpty().withMessage("Doctor majoring is required")
    .isString().withMessage("Doctor majoring must be a string")
    .matches(/([A-Za-z\s])+$/).withMessage("Doctor majoring should only have string characters")
    .isLength({min: 3, max: 100}).withMessage("Doctor majoring should be between 3 and 100 characters"),
    check("doctorPricePerHour")
    .notEmpty().withMessage("Doctor price is required")
    .isNumeric().withMessage("Doctor price must be numeric")
    .matches(/^[0-9]+$/).withMessage("Doctor price should only have numeric values")
], sendSmsCodeRegisterController);

doctorAuth.post('/register', upload.fields([{name: "doctorCertificate", maxCount:1}, {name: "doctorPhoto", maxCount:1}]), registerDoctorController)

doctorAuth.post('/send-sms-code-login', [
    body("doctorPhone")
    .isString().withMessage("Doctor phone must be a string")
    .notEmpty().withMessage("Doctor phone is required")
    .matches(/^[0-9]+$/).withMessage("Doctor phone should contains only numeric values")
    .isLength({max: 12}).withMessage("Doctor phone must be 12 numbers"),
] , sendSmsCodeLoginController)

doctorAuth.post('/login', loginDoctorController)

doctorAuth.patch('/logout', checkAuthorizationMiddleWare ,logoutDoctorController)

export default doctorAuth;