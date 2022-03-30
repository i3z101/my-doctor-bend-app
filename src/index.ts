import express, { Application, NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import appointmentsRouter from './route/patients/appointments-router';
import medicalFilesRouter from './route/patients/medical-files-router';
import medicinesRouter from './route/patients/medicines-router'
import patientsAuth from './route/patients/patients-auth-router';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import doctorAuth from './route/doctors/doctors-auth-router';
import sharedEndPoints from './route/shared/shared-endpoint';
import htmlPages from './route/extra-routes/extra-routes';
import {Server} from 'socket.io';
import {ExpressPeerServer} from 'peer';
import {createServer} from 'http'
import { connectIO } from './controller/shared/shared-endpoints-controller';

const PORT: number|string = process.env.PORT || 5000;
export const GROUPING_PATIENTS_URL = "/api/v1/patients"
export const GROUPING_DOCTORS_URL = "/api/v1/doctors"

const app: Application = express();
const server = createServer(app);

const peerServer = ExpressPeerServer(server, {
    path:'/'
})

export const io = new Server(server, {
    cors: {
        origin: "*"
    }
});


app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(cors({
    origin:'*',
}));
app.use(helmet({
    contentSecurityPolicy: false
})); //Refer to it back for more understanding
app.use(compression()) //Refer to it back for more understanding

//=========================//
//FOR PATIENTS
app.use(`${GROUPING_PATIENTS_URL}`,patientsAuth),
app.use(`${GROUPING_PATIENTS_URL}/medical-files`, medicalFilesRouter);
app.use(`${GROUPING_PATIENTS_URL}/medicines`, medicinesRouter);
app.use(`${GROUPING_PATIENTS_URL}/appointments`, appointmentsRouter);

//=========================//
//FOR DOCTORS//
app.use(`${GROUPING_DOCTORS_URL}`, doctorAuth);

//===============//
//FOR SHARED ROUTES BETWEEN PATIENTS & DOCTORS
app.use("/api/v1/shared", sharedEndPoints);

//===============//
//FOR HTML PAGES
app.use(htmlPages);

//===============//
//FOR ERROR HANDLING
app.use((err:any, req: Request, res: Response, next: NextFunction) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "",
        statusCode: err.statusCode || 500,
        validations: err.validations || []
    })
})

// app.use('/peerjs', peerServer);

mongoose.connect("mongodb://localhost:27017/my-doctor").then((m)=> {
    server.listen(5000, ()=>{
        console.log("SERVER IS RUNNING");
    })

    io.on('connection', client=> {
        connectIO(client);
    })
})




export default app;