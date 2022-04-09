import { NextFunction, Request, Response } from "express";
import { Server, Socket } from "socket.io";
import responseHandler from "../../helper/response-handler";
import { sendSms } from "../../helper/sms-messages-helper";
import { AppointmentType, RequestWithExtraProps } from "../../helper/types";
import Appointment from "../../model/appointments";
import Doctor  from "../../model/doctors";
import MedicalFile from "../../model/medical-files";
import Medicine from "../../model/medicines";

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
    let doctors: any = {} , filteredDoctors: any = {}, appointments: any = {}, 
    filteredAppointments: any = {}, medicalFiles: any = {}, filteredMedicalFiles: any = {}, medicines: any = {}, filteredMedicines: any = {};
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
                        pushToken: doc.pushToken,
                        acquiredAppointments: doc.acquiredAppointments,
                        doctorPricePerHour: doc.doctorPricePerHour
                    }
                })
                responseHandler(res, "success", 200, {doctors: filteredDoctors});
                break;
            case "defaultAppointmentsMedicalFilesDoctors":
                const allPromisesDoctors = await Promise.all([
                    await Appointment.find({doctor: req.user.doctorId, status: "approved"}).populate("doctor", ["doctorId", "doctorFullName", "doctorClinic", "acquiredAppointments", "pushToken"]).populate("patient",["patientName", "isAccountActive"]).populate('bill', ["status", "billPath"]),
                    await MedicalFile.find({doctor: req.user.doctorId}).populate("doctor", ["doctorId", "doctorFullName"]),
                ])
                appointments = allPromisesDoctors[0]
                filteredAppointments = appointments.map((appointment: any)=> {
                    return {
                        appointmentId: appointment._id,
                        patientName: appointment.patient.patientName,
                        appointmentDate: appointment.appointmentDate,
                        appointmentTime: appointment.appointmentTime,
                        patientActiveAccount: appointment.patient.isAccountActive,
                        bill: appointment.bill,
                        billPath: appointment.bill.billPath,
                        roomId: appointment.roomId,
                        doctor: {
                            doctorId: appointment.doctor._id,
                            doctorFullName: appointment.doctor.doctorFullName,
                            doctorClinic: appointment.doctor.doctorClinic,
                            pushToken: appointment.doctor.pushToken
                        }
                    }
                })
                
                medicalFiles = allPromisesDoctors[1];
                filteredMedicalFiles = medicalFiles.map((medicalFile: any) => {
                    return {
                        ...medicalFile._doc,
                        doctor: {
                            ...medicalFile._doc.doctor._doc,
                            doctorId: medicalFile._doc.doctor._id
                        }
                    }
                })
                responseHandler(res, "success", 200, {appointments: filteredAppointments, medicalFiles: filteredMedicalFiles});
                break;
            case "appointments":
                appointments = await Appointment.find({doctor: req.user.doctorId, status: "approved"}).populate("doctor", ["doctorId", "doctorFullName", "doctorClinic", "acquiredAppointments", "pushToken"]).populate("patient",["patientName", "isAccountActive"]).populate('bill', ["status", "billPath"]),
                filteredAppointments = appointments.map((appointment: any)=> {
                    return {
                        appointmentId: appointment._id,
                        patientName: appointment.patient.patientName,
                        appointmentDate: appointment.appointmentDate,
                        appointmentTime: appointment.appointmentTime,
                        bill: appointment.bill,
                        roomId: appointment.roomId,
                        patientActiveAccount: appointment.patient.isAccountActive,
                        billPath: appointment.bill.billPath,
                        doctor: {
                            doctorId: appointment.doctor._id,
                            doctorFullName: appointment.doctor.doctorFullName,
                            doctorClinic: appointment.doctor.doctorClinic,
                            isAccountActive: appointment.doctor.isAccountActive,
                            pushToken: appointment.doctor.pushToken
                        }
                    }
                })
                responseHandler(res, "success", 200, {appointments: filteredAppointments});
                break;
            case "medicalFiles":
                medicalFiles = await MedicalFile.find({doctor: req.user.doctorId}).populate("doctor", ["doctorId", "doctorFullName"]),
                filteredMedicalFiles = medicalFiles.map((medicalFile: any) => {
                    return {
                        ...medicalFile._doc,
                        doctor: {
                            ...medicalFile._doc.doctor._doc,
                            doctorId: medicalFile._doc.doctor._id
                        }
                    }
                })
                responseHandler(res, "success", 200, {medicalFiles: filteredMedicalFiles});
                break;
            default:
                const allPromises = await Promise.all([
                    await Doctor.find({isAccountActive: true}),
                    await Appointment.find({patient: req.user.patientId, status: "approved"}).populate("doctor", ["doctorId", "doctorFullName", "doctorPhone", "doctorClinic", "acquiredAppointments", "isAccountActive", "pushToken"]).populate("patient",["patientName"]).populate('bill', ["status", "billPath"]),
                    await MedicalFile.find({patient: req.user.patientId}).populate("doctor", ["doctorId", "doctorFullName"]),
                    await Medicine.find({patient: req.user.patientId})
                ])
                doctors = allPromises[0]
                filteredDoctors = doctors.map((doc: any)=> {
                    return {
                        ...doc._doc,
                        doctorId: doc._id,
                        doctorBio: `${doc.doctorClinic} graduated from ${doc.doctorGraduatedFrom}`,
                    }
                }),
                appointments = allPromises[1];
                filteredAppointments = appointments.map((appointment: any)=> {
                    return {
                        appointmentId: appointment._id,
                        appointmentDate: appointment.appointmentDate,
                        appointmentTime: appointment.appointmentTime,
                        eventId: appointment.eventId,
                        bill: appointment.bill,
                        roomId: appointment.roomId,
                        patientName: appointment.patient.patientName,
                        billPath: appointment.bill.billPath,
                        doctor: {
                            doctorId: appointment.doctor._id,
                            doctorFullName: appointment.doctor.doctorFullName,
                            doctorClinic: appointment.doctor.doctorClinic,
                            acquiredAppointments: appointment.doctor.acquiredAppointments,
                            isAccountActive: appointment.doctor.isAccountActive,
                            pushToken: appointment.doctor.pushToken
                        },
                    }
                })
                medicalFiles = allPromises[2];

                filteredMedicalFiles = medicalFiles.map((medicalFile: any)=> {
                    return {
                        ...medicalFile._doc,
                        doctor: {
                            ...medicalFile._doc.doctor._doc,
                            doctorId: medicalFile._doc.doctor._id
                        }
                    }
                })

                medicines = allPromises[3];

                filteredMedicines = medicines.map((medicine: any) => {
                    return {
                        ...medicine._doc,
                        medicineId: medicine._id
                    }
                })
                
                responseHandler(res, "success", 200, {appointments: filteredAppointments, doctors: filteredDoctors, medicalFiles: filteredMedicalFiles.reverse(), medicines: filteredMedicines});
                break;

        }
    }catch(err: any) {
        return next(err);
    }
}
