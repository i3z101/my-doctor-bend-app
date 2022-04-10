import { NextFunction, Response } from "express";
import { RequestWithExtraProps } from "../../helper/types";
import Appointment from "../../model/appointments";
import Bill from "../../model/bills";
import Doctor from "../../model/doctors";
import MedicalFile from "../../model/medical-files";
import Medicine from "../../model/medicines";
import Patient from "../../model/patients";
import fs from 'fs/promises';
import path from 'path';
import Admin from "../../model/admins";
import { compareSync } from "bcryptjs";
import jwt from 'jsonwebtoken';

export const adminLogin = async (req: RequestWithExtraProps, res: Response, next: NextFunction) => {
    try{
       if(req.headers.cookie) {
           return res.redirect("/admin")
       }
       return res.render("admin/login", {
           title: "Admin Login"
       })
    }catch(err: any) {
        return next(err)
    }
}

export const adminLoginHandler = async (req: RequestWithExtraProps, res: Response, next: NextFunction) => {
    try{
        const {adminName, adminPassword} = req.body;
        const admin = await Admin.findOne({adminName});
        if(admin != null) {
            const passwordMatched = compareSync(adminPassword, admin.adminPassword)
            if(passwordMatched) {
                const token = jwt.sign({
                    adminId: admin._id,
                    adminName: admin.adminName
                }, process.env.TOKEN_SECRET_KEY as string, {expiresIn: '1d'});
                
                res.cookie("authToken", token, {
                    expires: new Date(new Date().getTime() + 86400000),
                    maxAge: 86400000
                });
                
                return res.redirect("/admin");
            }
        }else {
            return res.redirect("/admin");
        }
    }catch(err: any) {
        return next(err)
    }
}


export const adminLogoutHandler = async (req: RequestWithExtraProps, res: Response, next: NextFunction) => {
    try{
        res.clearCookie("authToken");
        return res.redirect("/admin/login");
    }catch(err: any) {
        return next(err)
    }
}


export const adminHomeController = async (req: RequestWithExtraProps, res: Response, next: NextFunction) => {
    let totalPaidAppointments: number = 0;
    try{
        const allHomePromises = await Promise.all([
            await Bill.find({}, {amount: 1, _id:0}),
            await Appointment.count(),
            await MedicalFile.count(),
            await Medicine.count(),
            await Doctor.count(),
            await Patient.count()
        ])
        const bills = allHomePromises[0];
        for(let i=0; i < bills.length; i++) {
            totalPaidAppointments += bills[i].amount
        }

        return res.render('admin/', {
            title: "Admin Home",
            activePath: "/admin",
            adminName: req.user.adminName,
            totalPaidAppointments,
            totalAppointments: allHomePromises[1],
            totalMedicalFiles: allHomePromises[2],
            totalMedicines: allHomePromises[3],
            totalDoctors: allHomePromises[4],
            totalPatients: allHomePromises[5]
        })

    }catch(err: any) {
        return next(err)
    }
}


export const adminAppointments = async (req: RequestWithExtraProps, res: Response, next: NextFunction) => {
    const {status} = req.query;
    try {
        const appointments = await Appointment.find().populate('bill', ["status"]).populate("patient", ["patientName"]).populate("doctor", ["doctorFullName"]).sort({appointmentDate: -1});
        switch (status) {
            case "paid":
                const filteredPaid = appointments.filter((appointment:any) => appointment.bill.status == "paid");
                return res.render('admin/appointments', {
                    title: "Appointments",
                    adminName: req.user.adminName,
                    appointments: filteredPaid,
                    activeLinkPath: '/appointments/paid',
                    activePath: '/appointments'
                })
            case "canceled":
                const filteredCanceled = appointments.filter((appointment:any) => appointment.bill.status == "canceled");
                return res.render('admin/appointments', {
                    title: "Appointments",
                    adminName: req.user.adminName,
                    appointments: filteredCanceled,
                    activeLinkPath: '/appointments/canceled',
                    activePath: '/appointments'
                })
            default:
                return res.render('admin/appointments', {
                    title: "Appointments",
                    adminName: req.user.adminName,
                    appointments,
                    activeLinkPath: '/appointments',
                    activePath: '/appointments'
                })
        }
    }catch(err: any) {
        return next(err)
    }
}


export const adminDeleteAppointment = async (req: RequestWithExtraProps, res: Response, next: NextFunction) => { 

    try {
        await Appointment.findByIdAndDelete(req.body.appointmentId);
        return res.redirect('/admin/appointments');
    }catch(err: any) {
        return next(err);
    }

    
}


export const adminMedicalFies = async (req: RequestWithExtraProps, res: Response, next: NextFunction) => { 

    try {
        const medicalFiles = await MedicalFile.find().populate("doctor", ["doctorFullName"]).sort({createdAt: -1});
        const filteredMedicalFiles = medicalFiles.map((medicalFile: any) => {
            return {
                ...medicalFile._doc,
                createdAt: new Date(medicalFile._doc.createdAt).toDateString()
            }
        })
        return res.render('admin/medical-files', {
            title: "Medical Files",
            adminName: req.user.adminName,
            activePath: '/medical-files',
            medicalFiles: filteredMedicalFiles,
        });
    }catch(err: any) {
        return next(err);
    }

    
}

export const adminDeleteMedicalFile = async (req: RequestWithExtraProps, res: Response, next: NextFunction) => { 

    try {
        await MedicalFile.findByIdAndDelete(req.body.medicalFileId);
        return res.redirect('/admin/medical-files');
    }catch(err: any) {
        return next(err);
    }

    
}

export const adminMedicines = async (req: RequestWithExtraProps, res: Response, next: NextFunction) => { 

    try {
        const medicines = await Medicine.find().populate("patient", ["patientName"]).sort({createdAt: -1});
        
        const filteredMedicines = medicines.map((medicine: any) => {
            return {
                ...medicine._doc,
                stopDate: medicine._doc.listDates.slice(-1)[0].day,
                stopTime: new Date(medicine.listDates.slice(-1)[0].day + " " + medicine.listDates.slice(-1)[0].time).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute:'2-digit',
                    hour12: false,
                }),
            }
        })


        return res.render('admin/medicines', {
            title: "Medicines",
            activePath: '/medicines',
            adminName: req.user.adminName,
            medicines: filteredMedicines,
        });
    }catch(err: any) {
        return next(err);
    }

    
}


export const adminDoctors = async (req: RequestWithExtraProps, res: Response, next: NextFunction) => { 

    try {
        const doctors = await Doctor.find();
        return res.render('admin/doctors', {
            title: "Doctors",
            adminName: req.user.adminName,
            activePath: '/doctors',
            doctors,
        });
    }catch(err: any) {
        return next(err);
    }
}


export const adminDisableDoctor = async (req: RequestWithExtraProps, res: Response, next: NextFunction) => { 

    try {
        await Doctor.findByIdAndUpdate(req.body.doctorId, {$set: {isAccountActive: false}});
        return res.redirect('/admin/doctors');
    }catch(err: any) {
        return next(err);
    }
}

export const adminActiveDoctor = async (req: RequestWithExtraProps, res: Response, next: NextFunction) => { 

    try {
        await Doctor.findByIdAndUpdate(req.body.doctorId, {$set: {isAccountActive: true}});
        return res.redirect('/admin/doctors');
    }catch(err: any) {
        return next(err);
    }
}

export const adminPatients = async (req: RequestWithExtraProps, res: Response, next: NextFunction) => { 

    try {
        const patients = await Patient.find();
        return res.render('admin/patients', {
            title: "Patients",
            adminName: req.user.adminName,
            activePath: '/patients',
            patients,
        });
    }catch(err: any) {
        return next(err);
    }
}

export const adminDisablePatient = async (req: RequestWithExtraProps, res: Response, next: NextFunction) => { 

    try {
        await Patient.findByIdAndUpdate(req.body.patientId, {$set: {isAccountActive: false}});
        return res.redirect('/admin/patients');
    }catch(err: any) {
        return next(err);
    } 
}

export const adminActivePatient = async (req: RequestWithExtraProps, res: Response, next: NextFunction) => { 

    try {
        await Patient.findByIdAndUpdate(req.body.patientId, {$set: {isAccountActive: true}});
        return res.redirect('/admin/patients');
    }catch(err: any) {
        return next(err);
    }
}