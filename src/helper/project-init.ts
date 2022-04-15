import express, { Application, NextFunction, Request, Response } from "express";
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import patientsAuth from "../route/patients/patients-auth-router";
import medicalFilesRouter from "../route/patients/medical-files-router";
import medicinesRouter from "../route/patients/medicines-router";
import appointmentsRouter from "../route/patients/appointments-router";
import doctorAuth from "../route/doctors/doctors-auth-router";
import sharedEndPoints from "../route/shared/shared-endpoint";
import adminsRoute from "../route/admins/admins-route";
import htmlPages from "../route/extra-routes/extra-routes";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { appointmentsIo, emergencyIo } from "../controller/extra-controller/extra-controller";

export default class InititeProject {
    private readonly GROUPING_PATIENTS_URL = "/api/v1/patients";
    private readonly GROUPING_DOCTORS_URL = "/api/v1/doctors";
    private readonly app: Application = express();    

    private initiateServer = () => {
        this.app.use(express.static('public'));
        this.app.set('view engine', 'ejs');
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(express.json());
        this.app.use(cors());
        this.app.use(helmet({
            contentSecurityPolicy: false
        })); //Refer to it back for more understanding
        this.app.use(compression()) //Refer to it back for more understanding

        this.initiatePatientsRoutes();
        this.initiateDoctorsRoutes();
        this.initiateSharedRoutesAndHtmlPagesRoutes();
        this.initiateErrorHandler();
    }

    private initiatePatientsRoutes = () => {
        //FOR PATIENT
        this.app.use(`${this.GROUPING_PATIENTS_URL}`, patientsAuth),
        this.app.use(`${this.GROUPING_PATIENTS_URL}/medical-files`, medicalFilesRouter);
        this.app.use(`${this.GROUPING_PATIENTS_URL}/medicines`, medicinesRouter);
        this.app.use(`${this.GROUPING_PATIENTS_URL}/appointments`, appointmentsRouter);

       





    }

    private initiateDoctorsRoutes = () => {
        //FOR DOCTORS
        this.app.use(`${this.GROUPING_DOCTORS_URL}`, doctorAuth);
    }

    private initiateSharedRoutesAndHtmlPagesRoutes = () => {
        //FOR SHARED ROUTES BETWEEN PATIENTS & DOCTORS
        this.app.use("/api/v1/shared", sharedEndPoints);
        //FOR HTML PAGES
        this.app.use(htmlPages);
    }

    private initiateAdminsRoutes = () => {
        //For admins
        this.app.use("/admin", adminsRoute)
    }

    private initiateErrorHandler = () => {
        //FOR ERROR HANDLING
        this.app.use((err:any, req: Request, res: Response, next: NextFunction) => {
            return res.status(err.statusCode || 500).json({
                message: err.message || "",
                statusCode: err.statusCode || 500,
                validations: err.validations || []
            })
        })
    }

    public createApp = () => {
        this.initiateServer();
        
        mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@mydoctor-cluster.yiuwg.mongodb.net/my-doctor?retryWrites=true&w=majority`).then((m)=> {
        const server = this.app.listen(5000, ()=>{
            console.log("SERVER IS RUNNING");
        })
        const io = new Server(server);
        const appointment = io.of('/appointments');
        const emergency = io.of('/emergency');

        appointment.on('connection', client => {
            
            appointmentsIo(client);
        })
        
        emergency.on('connection', client => {
            emergencyIo(client)
        })

        })

    }
}