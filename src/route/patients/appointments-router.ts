import express, { Request, Response } from 'express';
import { addNewAppointment, deleteAppointment, updateAppointment } from '../../controller/patients/appointments/appointments-controller';
import checkAuthorizationMiddleWare from '../../middleware/checkAuthorization-middleware';
import Pdf from 'pdfkit';
import fs from 'fs';
import path from 'path';
const appointmentsRouter = express.Router();


appointmentsRouter.post("/add-new-appointment", checkAuthorizationMiddleWare, addNewAppointment);

appointmentsRouter.patch("/update-appointment", checkAuthorizationMiddleWare, updateAppointment);

appointmentsRouter.delete("/delete-appointment", checkAuthorizationMiddleWare, deleteAppointment);



export default appointmentsRouter;
