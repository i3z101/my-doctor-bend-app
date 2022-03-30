import twilio from "twilio";
import errorHandler from "./error-handler";

const twilioSMS = twilio(process.env.ACCOUNT_ID, process.env.AUTH_TOKEN);

export const sendSms = async (phone: string): Promise<any> => {
    const smsMsg = await twilioSMS.verify.services(process.env.SERVICE_SID as string).verifications.create({
        to: `+${phone}`,
        channel: 'sms'
    });
    if(smsMsg.status != "pending") {
        errorHandler("Doctor is registered already", 422);
    }
}

export const verfiySms = async (code: string, phone: string): Promise<any> => {
    const smsCodeVerfication = await twilioSMS.verify.services(process.env.SERVICE_SID as string).verificationChecks.create({
        to: `+${phone}`,
        code,
    });
    if(smsCodeVerfication.status != "approved") {
        errorHandler("Code is expired", 500);
     }
}