import express, { Request, Response } from 'express';

const medicalFilesRouter = express.Router();


medicalFilesRouter.post("/", (req: Request, res: Response)=> {
    res.json({
        message: "hi",
        statusCode: 401
    })
});

export default medicalFilesRouter;
