import { Response } from "express";

export default (res: Response, message: string, statusCode: number, otherData?: any) => {
    return res.status(statusCode).json({
        message: message,
        statusCode: statusCode,
        ...otherData
    })
}