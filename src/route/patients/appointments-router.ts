import express, { Request, Response } from 'express';
import { addNewAppointment, deleteAppointment, updateAppointment } from '../../controller/patients/appointments/appointments-controller';
import checkAuthorizationMiddleWare from '../../middleware/checkAuthorization-middleware';
const appointmentsRouter = express.Router();


appointmentsRouter.post("/add-new-appointment", checkAuthorizationMiddleWare ,addNewAppointment);

appointmentsRouter.patch("/update-appointment", checkAuthorizationMiddleWare ,updateAppointment);

appointmentsRouter.delete("/delete-appointment", checkAuthorizationMiddleWare ,deleteAppointment);

export default appointmentsRouter;
