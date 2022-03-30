import express, { Request, Response } from 'express';

const medicinesRouter = express.Router();


medicinesRouter.get("/", (req: Request, res: Response)=> {
    res.json({
        message: "hi"
    })
});

export default medicinesRouter;
