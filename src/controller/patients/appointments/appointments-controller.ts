import { NextFunction, Request, Response } from "express";
import errorHandler from "../../../helper/error-handler";
import responseHandler from "../../../helper/response-handler";
import { RequestWithExtraProps } from "../../../helper/types";
import Appointment from "../../../model/appointments";
import Bill from "../../../model/bills";
import Doctor  from "../../../model/doctors"


export const addNewAppointment  = async(req: RequestWithExtraProps, res: Response, next: NextFunction): Promise<any> => {
    const {appointmentDate, appointmentTime, eventId, doctorId, billId} = req.body;
    try {
        const allPromises = await Promise.all([
            await new Appointment({
                appointmentDate,
                appointmentTime,
                eventId,
                patient: req.user.patientId,
                doctor: doctorId,
                bill: billId
            }).save(),
            await Doctor.findById(doctorId)
        ])
        const appointment = allPromises[0];
        const doctorInfo = allPromises[1];
        if(doctorInfo != null) {
            if(doctorInfo.acquiredAppointments.length == 0) {
                doctorInfo.acquiredAppointments.push({
                    appointmentDate: appointmentDate,
                    acquiredTimes: [appointmentTime]
                })
            }else{
                const acquiredAppointmentsCopy = doctorInfo.acquiredAppointments.find((appointment)=>appointment.appointmentDate == appointmentDate);
                if(acquiredAppointmentsCopy != null) {
                    acquiredAppointmentsCopy.acquiredTimes.push(appointmentTime);
                }else{
                    doctorInfo.acquiredAppointments.push({
                        appointmentDate: appointmentDate,
                        acquiredTimes: [appointmentTime]
                    })
                }
            }
            await Doctor.findByIdAndUpdate(doctorId, {$set: {acquiredAppointments: doctorInfo.acquiredAppointments}});
            responseHandler(res, "Appointment added successfully", 201, {appointmentId: appointment._id, acquiredAppointments: doctorInfo.acquiredAppointments});
        }
    }catch(err:any) {
        return next(err);
    }
}

export const updateAppointment  = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    const {appointmentId,appointmentDate, appointmentTime, eventId, doctorId, prevTime, prevDate} = req.body;
    try {
        const allPromises = await Promise.all([
            await Appointment.findByIdAndUpdate(appointmentId, {$set: {
                appointmentDate,
                appointmentTime,
                eventId
            }}),
            await Doctor.findById(doctorId)
        ])
        const doctorInfo = allPromises[1];
        if(doctorInfo != null) {
            let acquiredAppointmentsCopy: any = doctorInfo.acquiredAppointments.find((appointment)=>appointment.appointmentDate == appointmentDate);
            let findTimeByIndex: number = -1;
            if(acquiredAppointmentsCopy) {
                findTimeByIndex = acquiredAppointmentsCopy.acquiredTimes.findIndex((time: any)=>time == prevTime);
                if(findTimeByIndex > -1) {
                    acquiredAppointmentsCopy.acquiredTimes[findTimeByIndex] = appointmentTime;
                }else{
                    acquiredAppointmentsCopy.acquiredTimes.push(appointmentTime);
                }
                acquiredAppointmentsCopy = doctorInfo.acquiredAppointments.find((appointment)=>appointment.appointmentDate == prevDate);
                acquiredAppointmentsCopy.acquiredTimes.splice(findTimeByIndex, 1);
            }else {
                acquiredAppointmentsCopy = doctorInfo.acquiredAppointments.find((appointment)=>appointment.appointmentDate == prevDate);
                findTimeByIndex = acquiredAppointmentsCopy.acquiredTimes.findIndex((time: any)=>time == prevTime);
                acquiredAppointmentsCopy.acquiredTimes.splice(findTimeByIndex, 1);
                doctorInfo.acquiredAppointments.push({
                    appointmentDate: appointmentDate,
                    acquiredTimes: [appointmentTime]
                })
            }
            await Doctor.findByIdAndUpdate(doctorId, {$set: {acquiredAppointments: doctorInfo.acquiredAppointments}});
            responseHandler(res, "Appointment updated successfully", 200, {acquiredAppointments: doctorInfo.acquiredAppointments});
        }
    }catch(err:any) {
        return next(err);
    }
}

export const deleteAppointment  = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    const {appointmentId, doctorId, appointmentDate, appointmentTime, billId} = req.body;
    try{
        const doctorInfo = await Doctor.findById(doctorId);
        if(doctorInfo != null) {
            const acquiredAppointmentsCopy: any = doctorInfo.acquiredAppointments.find((appointment)=>appointment.appointmentDate == appointmentDate);
            const findTimeIndex = acquiredAppointmentsCopy.acquiredTimes.findIndex((time: any)=>time == appointmentTime);
            acquiredAppointmentsCopy?.acquiredTimes.splice(findTimeIndex, 1);
            await Promise.all([
                await doctorInfo.updateOne({$set: {acquiredAppointments: doctorInfo.acquiredAppointments}}),
                await Appointment.findByIdAndDelete(appointmentId),
                await Bill.findOneAndUpdate(billId, {$set: {status: "canceled"}})
            ])
            responseHandler(res, "Appointment canceled successfully", 200, {acquiredAppointments: doctorInfo.acquiredAppointments});
        }
    }catch(err: any){
        return next(err);
    }
}