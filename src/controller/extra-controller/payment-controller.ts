import { NextFunction, Request, Response } from "express";
import errorHandler from "../../helper/error-handler";
import responseHandler from "../../helper/response-handler";
import Appointment from "../../model/appointments";
import Bill from "../../model/bills";

export const paymentPageController = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    const {amount, doctorFullName, date, time} = req.query;
    
    return res.render('payment/index', {
        amount,
        doctorFullName: doctorFullName?.toString().replace(/-/g, " "),
        date: date?.toString().replace(/-/g, " "),
        time: time?.toString().replace(/-/g, " ")
    });
}

export const paymentStatusController = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    const {status, date, time, appointmentAmount} = req.query;
    try {
        if(status == "paid") {
            await new Bill({
                date,
                time,
                amount: appointmentAmount
            }).save()
        }
        const bill = await Bill.findOne({status: "paid", date: date?.toString().replace(/-/g, " "), time: time?.toString().replace(/-/g, " ")});
        if(bill) {
            responseHandler(res, "Succeed", 200, {billId: bill._id});
        }else {
            errorHandler("Failed", 500);
        }
        
    }catch(err: any) {
        return next(err);
    }
}

export const socketPageController = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    const {receiver} = req.query;
    if(receiver) {
        return res.render('socket/receiver')
    }
    return res.render('socket/index');
}