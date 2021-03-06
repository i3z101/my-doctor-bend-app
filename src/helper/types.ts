import { Request } from "express"
import mongoose from "mongoose"

export type AppointmentType = {
    doctor: mongoose.Types.ObjectId,
    patient:  mongoose.Types.ObjectId,
    bill: mongoose.Types.ObjectId,
    appointmentDate: string,
    appointmentTime: string,
    eventId: string|number,
    roomId: string,
    status: string
}

export type MedicalFileType = {
    fileName: string,
    disease: string,
    doctor: mongoose.Types.ObjectId,
    patient: mongoose.Types.ObjectId,
    clinic: string,
    patientName: string,
    medicine: string,
}


export type MedicineType = {
    medicineName: string,
    timesPerDay: number,
    tabletsPerTime: number,
    shouldTakeItEvery: number,
    numberOfDays: number,
    startTime: string,
    startDate: string,
    eventId: string,
    listDates: ListDatesType[],
    patient: mongoose.Types.ObjectId
}

export type ListDatesType = {
    day: string,
    time: string
}

export type PatientAuthType = {
    patientPhone: string,
    patientName: string,
    patientEmail?: string,
    pushToken: string,
    isAccountActive: boolean,
    updatePermitted: boolean
}

export type DoctorsAuthType = {
    doctorFullName: string,
    doctorPhone: string,
    doctorEmail: string,
    doctorClinic: string,
    doctorGraduatedFrom: string
    doctorCertificate: string,
    doctorPhoto: string
    doctorPricePerHour: number,
    isAccountActive: boolean,
    updatePermitted: boolean,
    acquiredAppointments: DoctorAcquiredAppointments[],
    pushToken: string
}

type DoctorAcquiredAppointments = {
    appointmentDate: string,
    acquiredTimes: string[]
}

export type ResponseType = {
    message: string,
    statusCode: number,
    [extraProps: string]: any
}

export type BillType = {
    date: string,
    time: string,
    amount: number,
    status: string,
    billPath: string
}

export type AdminType = {
    adminName: string,
    adminPassword: string
}

export interface RequestWithExtraProps extends Request {
    [extraProps: string]: any
}

