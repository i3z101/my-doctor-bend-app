import { Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import errorHandler from "../../../helper/error-handler";
import responseHandler from "../../../helper/response-handler";
import { RequestWithExtraProps } from "../../../helper/types";
import Medicine from "../../../model/medicines";

export const addMedicine = async (req: RequestWithExtraProps, res: Response, next: NextFunction): Promise<any> => {
    const {eventId, medicineName, shouldTakeItEvery, timesPerDay, tabletsPerTime, numberOfDays, startDate, startTime, listDates} = req.body;
    try {
        
        const validations = validationResult(req);
        if(!validations.isEmpty()) {
            errorHandler("Validation error(s)", 422, validations.array());
        }
        const medicine = await new Medicine({
            eventId,
            medicineName,
            numberOfDays,
            shouldTakeItEvery,
            tabletsPerTime,
            startDate,
            startTime,
            timesPerDay,
            listDates,
            patient: req.user.patientId
        }).save()
        
        responseHandler(res, "Medicine added successfully", 201, {medicineId: medicine._id});
    }catch(err: any) {
        return next(err)
    }
}

export const updateMedcine = async (req: RequestWithExtraProps, res: Response, next: NextFunction): Promise<any> => {
    const {medicineId,eventId, medicineName, shouldTakeItEvery, timesPerDay, tabletsPerTime, numberOfDays, startDate, startTime, listDates} = req.body;
    try {

        const validations = validationResult(req);
        if(!validations.isEmpty()) {
            errorHandler("Validation error(s)", 422, validations.array());
        }
        await Medicine.findByIdAndUpdate(medicineId, {$set:{
            eventId,
            medicineName,
            numberOfDays,
            shouldTakeItEvery,
            tabletsPerTime,
            startDate,
            startTime,
            timesPerDay,
            listDates
        }})
        
        responseHandler(res, "Medicine updated successfully", 200);
    }catch(err: any) {
        return next(err)
    }
}