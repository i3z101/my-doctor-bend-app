import express, { Request, Response } from 'express';
import checkAuthorizationMiddleWare from '../../middleware/checkAuthorization-middleware';
import {body} from 'express-validator';
import { addMedicalFile, updateMedicalFile } from '../../controller/patients/medical-files/medical-files-controller';
const medicalFilesRouter = express.Router();


medicalFilesRouter.post("/add-medical-file", checkAuthorizationMiddleWare, [
    body("disease")
    .isString().withMessage("Disease name must be a string")
    .notEmpty().withMessage("Disease name is required")
    .matches(/[A-Za-z\s0-9]+$/).withMessage("Disease name should only have string and numeric characters")
    .isLength({min: 3, max: 100}).withMessage("Disease name must be between 3 and 100 characters"),
    body("patientName")
    .isString().withMessage("Patient name must be a string")
    .notEmpty().withMessage("Patient name is required")
    .matches(/([A-Za-z\s])+$/).withMessage("Patient name should only have string characters")
    .isLength({min: 3, max: 100}),
    body("medicine")
    .isString().withMessage("Medicine name(s) must be a string")
    .notEmpty().withMessage("Medicine name(s) is required")
    .matches(/^[^^5*&^%$#@!~+-=?؟][A-Za-z\s,]+$/).withMessage("Medicine name(s) must contain string characters only with colon as a sperator")
    .isLength({min:3, max: 150}).withMessage("Medicine name should be between 3 and 150 characters")
], addMedicalFile);

medicalFilesRouter.patch("/update-medical-file", checkAuthorizationMiddleWare, [
    body("disease")
    .isString().withMessage("Disease name must be a string")
    .notEmpty().withMessage("Disease name is required")
    .matches(/[A-Za-z\s0-9]+$/).withMessage("Disease name should only have string and numeric characters")
    .isLength({min: 3, max: 100}).withMessage("Disease name must be between 3 and 100 characters"),
    body("patientName")
    .isString().withMessage("Patient name must be a string")
    .notEmpty().withMessage("Patient name is required")
    .matches(/([A-Za-z\s])+$/).withMessage("Patient name should only have string characters")
    .isLength({min: 3, max: 100}),
    body("medicine")
    .isString().withMessage("Medicine name(s) must be a string")
    .notEmpty().withMessage("Medicine name(s) is required")
    .matches(/^[^^5*&^%$#@!~+-=?؟][A-Za-z\s,]+$/).withMessage("Medicine name(s) must contain string characters only with colon as a sperator")
    .isLength({min:3, max: 150}).withMessage("Medicine name should be between 3 and 150 characters")
], updateMedicalFile);

export default medicalFilesRouter;
