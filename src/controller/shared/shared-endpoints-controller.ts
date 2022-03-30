import { NextFunction, Request, Response } from "express";
import { Server, Socket } from "socket.io";
import responseHandler from "../../helper/response-handler";
import { sendSms } from "../../helper/sms-messages-helper";
import { AppointmentType, RequestWithExtraProps } from "../../helper/types";
import Appointment from "../../model/appointments";
import Doctor  from "../../model/doctors";

export const sendSmsCodeAgain = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    const {phone} = req.body;
    try {
        await sendSms(phone);
        responseHandler(res, "Code sent successfully", 200);
    }catch(err: any) {
        return next(err);
    }

}


export const fetchAllData = async(req: RequestWithExtraProps, res: Response, next: NextFunction): Promise<any> => {
    const {field} = req.query;
    let doctors: any = {} , filteredDoctors: any = {}, appointments: any = {}, filteredAppointments: any = {};
    try {
        switch(field) {
            case "doctors":
                doctors = await Doctor.find({isAccountActive: true});
                filteredDoctors = doctors.map((doc: any)=> {
                    return {
                        doctorId: doc._id,
                        doctorFullName: doc.doctorFullName,
                        doctorGraduatedFrom: doc.doctorGraduatedFrom,
                        doctorClinic: doc.doctorClinic,
                        doctorBio: `${doc.doctorClinic} graduated from ${doc.doctorGraduatedFrom}`,
                        doctorPrice: doc.doctorPricePerHour,
                        doctorPhoto: doc.doctorPhoto,
                        acquiredAppointments: doc.acquiredAppointments
                    }
                })
                responseHandler(res, "success", 200, {doctors: filteredDoctors});
                break;
            case "appointments":
                appointments = await Appointment.find({doctor: req.user.doctorId || req.user.patientId}).populate("doctor", ["doctorId", "doctorFullName", "doctorClinic", "acquiredAppointments"]).populate("patient",["patientName"]);;
                filteredAppointments = appointments.map((appointment: any)=> {
                    return {
                        appointmentId: appointment._id,
                        appointmentDate: appointment.appointmentDate,
                        appointmentTime: appointment.appointmentTime,
                        eventId: appointment.eventId,
                        billId: appointment.bill,
                        patientName: appointment.patient.patientName,
                        doctor: {
                            doctorId: appointment.doctor._id,
                            doctorFullName: appointment.doctor.doctorFullName,
                            doctorClinic: appointment.doctor.doctorClinic,
                            acquiredAppointments: appointment.doctor.acquiredAppointments
                        }
                    }
                })
                responseHandler(res, "success", 200, {appointments: filteredAppointments});
                break;
            default:
                const allPromises = await Promise.all([
                    await Doctor.find({isAccountActive: true}),
                    await Appointment.find({patient: req.user.patientId}).populate("doctor", ["doctorId", "doctorFullName", "doctorPhone", "doctorClinic", "acquiredAppointments"]).populate("patient",["patientName"])
                ])
                doctors = allPromises[0]
                filteredDoctors = doctors.map((doc: any)=> {
                    return {
                        doctorId: doc._id,
                        doctorFullName: doc.doctorFullName,
                        doctorGraduatedFrom: doc.doctorGraduatedFrom,
                        doctorClinic: doc.doctorClinic,
                        doctorBio: `${doc.doctorClinic} graduated from ${doc.doctorGraduatedFrom}`,
                        doctorPrice: doc.doctorPricePerHour,
                        doctorPhoto: doc.doctorPhoto,
                        acquiredAppointments: doc.acquiredAppointments
                    }
                }),
                appointments = allPromises[1];
                filteredAppointments = appointments.map((appointment: any)=> {
                    return {
                        appointmentId: appointment._id,
                        appointmentDate: appointment.appointmentDate,
                        appointmentTime: appointment.appointmentTime,
                        eventId: appointment.eventId,
                        billId: appointment.bill,
                        patientName: appointment.patient.patientName,
                        doctor: {
                            doctorId: appointment.doctor._id,
                            doctorFullName: appointment.doctor.doctorFullName,
                            doctorClinic: appointment.doctor.doctorClinic,
                            acquiredAppointments: appointment.doctor.acquiredAppointments
                        }
                    }
                })
                responseHandler(res, "success", 200, {appointments: filteredAppointments, doctors: filteredDoctors});
                break;

        }
    }catch(err: any) {
        return next(err);
    }
}


export const connectIO = async(client: Socket) => {
    client.join("1");
    client.on('join-room', (args)=> {
        client.broadcast.to("1").emit("user-joined", {
            id: client.id
        })
    })
    client.on("call-user", (args) => {
        client.broadcast.to("1").emit("calling-user", args);
    });
    client.on("make-answer", (args) => {
        client.broadcast.emit("answer-made", args);
    });
    client.on("candidate", (args) => {
        client.broadcast.to("1").emit("ic-candidate", args);
    });

    client.on('candidate', args=> {
        client.emit('ice-candidate', args)
    })
}