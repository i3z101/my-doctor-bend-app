import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { addMedicine, updateMedcine } from '../../controller/patients/medicines/medicines-controller';
import checkAuthorizationMiddleWare from '../../middleware/checkAuthorization-middleware';

const medicinesRouter = express.Router();

medicinesRouter.post("/add-medicine", checkAuthorizationMiddleWare, [
    body("medicineName")
    .isString().withMessage("Disease name must be a string")
    .notEmpty().withMessage("Disease name is required")
    .matches(/[A-Za-z\s0-9]+$/).withMessage("Disease name should only have string and numeric characters")
    .isLength({min: 3, max: 150}).withMessage("Disease name must be between 3 and 100 characters"),
] ,addMedicine);

medicinesRouter.patch("/update-medicine", checkAuthorizationMiddleWare, updateMedcine);

export default medicinesRouter;
