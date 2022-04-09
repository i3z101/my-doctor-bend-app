import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import errorHandler from "../../../helper/error-handler";
import responseHandler from "../../../helper/response-handler";
import { RequestWithExtraProps } from "../../../helper/types";
import MedicalFile from "../../../model/medical-files";

export const addMedicalFile = async (req: RequestWithExtraProps, res: Response, next: NextFunction): Promise<any> => {
    const {fileName, disease, clinic, patientName, doctor, medicine} = req.body;
    try {
        const validations = validationResult(req);
        if(!validations.isEmpty()) {
            errorHandler("Validation error(s)", 422, validations.array());
        }
        await new MedicalFile({
            disease,
            clinic,
            medicine,
            doctor,
            patientName,
            fileName: fileName,
            patient: req.user.patientId
        }).save();
        responseHandler(res, "Medical file added successfully", 201);
    }catch(err: any) {
        return next(err);
    }
}

export const updateMedicalFile = async (req: RequestWithExtraProps, res: Response, next: NextFunction): Promise<any> => {
    const {fileName, disease, clinic, patientName, doctor, medicine} = req.body;
    try {
        const validations = validationResult(req);
        if(!validations.isEmpty()) {
            errorHandler("Validation error(s)", 422, validations.array());
        }
        await MedicalFile.findOneAndUpdate({fileName: fileName}, {$set: {
            disease,
            clinic,
            medicine,
            doctor,
            patientName,
            fileName: fileName,
            patient: req.user.patientId
        }})
        responseHandler(res, "Medical file Updated successfully", 201);
    }catch(err: any) {
        return next(err);
    }
}