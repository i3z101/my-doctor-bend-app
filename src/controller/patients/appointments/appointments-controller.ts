import { NextFunction, Request, Response } from "express";
import path from "path";
import { RequestWithExtraProps } from "../../../helper/types";
import Appointment from "../../../model/appointments";
import Bill from "../../../model/bills";
import Doctor  from "../../../model/doctors"
import Pdf from 'pdfkit';
import fs from 'fs';
import Expo from "expo-server-sdk";
import HelperClass from "../../../helper/helper-class";

export const addNewAppointment  = async(req: RequestWithExtraProps, res: Response, next: NextFunction): Promise<any> => {
    const {appointmentDate, appointmentTime, eventId, doctorId, billId, roomId, doctorPushToken} = req.body;
    try {
        const allPromises = await Promise.all([
            await new Appointment({
                appointmentDate,
                appointmentTime,
                eventId,
                patient: req.user.patientId,
                roomId,
                doctor: doctorId,
                bill: billId,
            }).save(),
            await Doctor.findById(doctorId),
            await Bill.findById(billId)
        ])
        const appointment = allPromises[0];
        const doctorInfo = allPromises[1];
        const billInfo = allPromises[2];
        const billPath = `/bills/${appointment._id}.pdf`
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
            if(doctorInfo) {
                await doctorInfo.updateOne({$set: {acquiredAppointments: doctorInfo.acquiredAppointments}});
            }
            if(billInfo) {
                await  billInfo.updateOne({$set: {billPath}})
            }
            if(doctorPushToken != "") {
                pushNewNotification(doctorPushToken, `A new appointment with ${req.user.patientName}`, `Date & Time ${appointmentDate} At ${appointmentTime}`, "Look at it");
            }

            generatePdfBill(String(appointment._id), "PAID", appointmentDate, appointmentTime, doctorInfo.doctorFullName, doctorInfo.doctorClinic, req.user.patientName)

            HelperClass.responseHandler(res, "Appointment added successfully", 201, {appointmentId: appointment._id, billPath, acquiredAppointments: doctorInfo.acquiredAppointments});
        }
    }catch(err:any) {
        return next(err);
    }
}

export const updateAppointment  = async(req: RequestWithExtraProps, res: Response, next: NextFunction): Promise<any> => {
    const {appointmentId,appointmentDate, appointmentTime, eventId, doctorId, prevTime, prevDate, doctorPushToken} = req.body;
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
            }else {
                acquiredAppointmentsCopy = doctorInfo.acquiredAppointments.find((appointment)=>appointment.appointmentDate == prevDate);
                findTimeByIndex = acquiredAppointmentsCopy.acquiredTimes.findIndex((time: any)=>time == prevTime);
                acquiredAppointmentsCopy.acquiredTimes.splice(findTimeByIndex, 1);
                doctorInfo.acquiredAppointments.push({
                    appointmentDate: appointmentDate,
                    acquiredTimes: [appointmentTime]
                })
            }
            await doctorInfo.updateOne({$set: {acquiredAppointments: doctorInfo.acquiredAppointments}});

            if(doctorPushToken != "") {
                pushNewNotification(doctorPushToken, `Updated appointment with ${req.user.patientName}`, `New Date & Time ${appointmentDate} At ${appointmentTime}`, "Look at it");
            }
            

            generatePdfBill(appointmentId, "PAID", appointmentDate, appointmentTime, doctorInfo.doctorFullName, doctorInfo.doctorClinic, req.user.patientName)

            HelperClass.responseHandler(res, "Appointment updated successfully", 200, {acquiredAppointments: doctorInfo.acquiredAppointments});
        }
    }catch(err:any) {
        return next(err);
    }
}

export const deleteAppointment  = async(req: RequestWithExtraProps, res: Response, next: NextFunction): Promise<any> => {
    const {appointmentId, doctorId, appointmentDate, appointmentTime, billId, doctorPushToken} = req.body;
    try{
        const allPromises = await Promise.all([
            await Doctor.findById(doctorId),
            await Appointment.findById(appointmentId),
            await Bill.findByIdAndUpdate(billId, {$set: {status: "canceled"}})
        ])
        const doctorInfo = allPromises[0];
        const appointmentInfo = allPromises[1];
        if(doctorInfo != null && appointmentInfo != null) {
            const acquiredAppointmentsCopy: any = doctorInfo.acquiredAppointments.find((appointment)=>appointment.appointmentDate == appointmentDate);
            const findTimeIndex = acquiredAppointmentsCopy.acquiredTimes.findIndex((time: any)=>time == appointmentTime);
            acquiredAppointmentsCopy.acquiredTimes.splice(findTimeIndex, 1);
            await Promise.all([
                await doctorInfo.updateOne({$set: {acquiredAppointments: doctorInfo.acquiredAppointments}}),
                await appointmentInfo.updateOne({$set: {status: "canceled"}})
            ])

            if(doctorPushToken != "") {
                pushNewNotification(doctorPushToken, `Appointment canceled with ${req.user.patientName}`, `Date & Time ${appointmentDate} At ${appointmentTime}`, "Sorry");
            }

            generatePdfBill(appointmentId, "CANCELED", appointmentDate, appointmentTime, doctorInfo.doctorFullName, doctorInfo.doctorClinic, req.user.patientName)

            HelperClass.responseHandler(res, "Appointment canceled successfully", 200, {acquiredAppointments: doctorInfo.acquiredAppointments});
        }
    }catch(err: any){
        return next(err);
    }
}


const generatePdfBill = (appointmentId: string, status:string, appointmentDate: string, appointmentTime: string, doctor: string, clinic: string ,patient: string ) => {
    const documentPath = path.join(process.cwd(), "public", "bills", `${appointmentId}.pdf`);
    const biillDoc: PDFKit.PDFDocument = new Pdf({size: 'A4'})
    biillDoc.pipe(fs.createWriteStream(documentPath))

    biillDoc
    .fontSize(40)
    .text("Bill Invoice", {
        align: 'center',
    })

    biillDoc.moveDown()

    biillDoc
    .fontSize(15)
    .text("Status: ", 60)
    .fontSize(15)
    .font('Helvetica-Bold')
    .text(status)

    biillDoc.moveDown();

    biillDoc
    .fontSize(15)
    .text("Appointment Date: ", 60)
    .fontSize(15)
    .font("Helvetica-Bold")
    .text(appointmentDate, 60)

   

    biillDoc.moveDown()

    biillDoc
    .fontSize(15)
    .text("Appointment Time: ", 60)
    .fontSize(15)
    .font("Helvetica-Bold")
    .text(appointmentTime)

    biillDoc.moveDown()

    biillDoc
    .fontSize(15)
    .text("Doctor: ", 60)
    .fontSize(15)
    .font("Helvetica-Bold")
    .text(doctor)

    biillDoc.moveDown()

    biillDoc
    .fontSize(15)
    .text("Clinic: ", 60)
    .fontSize(15)
    .font("Helvetica-Bold")
    .text(clinic)

    biillDoc.moveDown()

    biillDoc
    .fontSize(15)
    .text("Patient: ", 60)
    .fontSize(15)
    .font("Helvetica-Bold")
    .text(patient)

    biillDoc.moveDown()
    biillDoc.moveDown()
    biillDoc.moveDown()
    
    biillDoc
    .fontSize(20)
    .font("Courier-Bold")
    .text("Thanks For Choosing MyDoctor", {
        align: 'center',
    })


    biillDoc.end();
}

const pushNewNotification = async (pushToken: string, title: string, body:string, subtitle: string) => {
    const expo = new Expo();
            
    const isPushToken = Expo.isExpoPushToken(pushToken);
    if(isPushToken) {
        await expo.sendPushNotificationsAsync([{
            to: pushToken,
            title,
            body,
            subtitle,
            sound: 'default',
        }])
    }
}