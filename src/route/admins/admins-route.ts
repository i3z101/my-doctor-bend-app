import express, { Request, Response } from 'express'
import { adminAppointments, adminDeleteAppointment, adminDisableDoctor, adminDeleteMedicalFile, adminDoctors, adminHomeController, adminLogin, adminLoginHandler, adminLogoutHandler, adminMedicalFies, adminMedicines, adminPatients, adminActiveDoctor, adminDisablePatient, adminActivePatient } from '../../controller/admins/admins-controller'
import {compareSync, hashSync, compare} from 'bcryptjs'
import Admin from '../../model/admins'
import jwt from 'jsonwebtoken';
import cookie from 'cookie'
import checkAdminAuthorizationMiddleWare from '../../middleware/checkAdminAuthorization-middleware';
const adminsRoute = express.Router()


adminsRoute.get('/login', adminLogin);
adminsRoute.post('/login', adminLoginHandler);
adminsRoute.post('/logout', adminLogoutHandler);

adminsRoute.get('/', checkAdminAuthorizationMiddleWare, adminHomeController)
adminsRoute.get('/appointments', checkAdminAuthorizationMiddleWare, adminAppointments)
adminsRoute.post('/appointments/delete-appointment', checkAdminAuthorizationMiddleWare, adminDeleteAppointment)

adminsRoute.get('/medical-files', checkAdminAuthorizationMiddleWare, adminMedicalFies)
adminsRoute.post('/medical-files/delete-medical-file', checkAdminAuthorizationMiddleWare, adminDeleteMedicalFile)

adminsRoute.get('/medicines',checkAdminAuthorizationMiddleWare, adminMedicines)

adminsRoute.get('/doctors', checkAdminAuthorizationMiddleWare, adminDoctors)
adminsRoute.post('/doctors/disable-doctor',checkAdminAuthorizationMiddleWare, adminDisableDoctor);
adminsRoute.post('/doctors/active-doctor',checkAdminAuthorizationMiddleWare, adminActiveDoctor);

adminsRoute.get('/patients',checkAdminAuthorizationMiddleWare, adminPatients)
adminsRoute.post('/patients/disable-patient',checkAdminAuthorizationMiddleWare, adminDisablePatient);
adminsRoute.post('/patients/active-patient',checkAdminAuthorizationMiddleWare, adminActivePatient);




export default adminsRoute