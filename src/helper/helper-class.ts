import { Response } from "express";
import twilio from "twilio";

export default class HelperClass {

    private static readonly twilioSMS = twilio(process.env.ACCOUNT_ID, process.env.AUTH_TOKEN);

    public static errorHandler = (message: string, statusCode: number, validations?: any) => {
        const error = new Error() as any;
        error.message = message,
        error.statusCode = statusCode;
        error.validations = validations ? validations.map((value:any)=>value.msg) : [];
        throw error;
    }

    public static responseHandler = (res: Response, message: string, statusCode: number, otherData?: any) => {
        return res.status(statusCode).json({
            message: message,
            statusCode: statusCode,
            ...otherData
        })
    }



    public static sendSms = async (phone: string): Promise<any> => {
        const smsMsg = await this.twilioSMS.verify.services(process.env.SERVICE_SID as string).verifications.create({
            to: `+${phone}`,
            channel: 'sms'
        });
        if(smsMsg.status != "pending") {
            this.errorHandler("Doctor is registered already", 422);
        }
    }
    
    public static verfiySms = async (code: string, phone: string): Promise<any> => {
        const smsCodeVerfication = await this.twilioSMS.verify.services(process.env.SERVICE_SID as string).verificationChecks.create({
            to: `+${phone}`,
            code,
        });
        if(smsCodeVerfication.status != "approved") {
            this.errorHandler("Code is expired", 500);
         }
    }

}