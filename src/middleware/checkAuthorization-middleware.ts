import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import HelperClass from "../helper/helper-class";
import { RequestWithExtraProps } from "../helper/types";

const checkAuthorizationMiddleWare = async (req: RequestWithExtraProps, res: Response, next: NextFunction) => {
    try {
        
        const authToken: string|undefined = req.headers.authorization;
        if(!authToken) {
           HelperClass.errorHandler("You are not authorized", 401);
            return
        }else{
            const token: string = authToken.split(" ")[1];
            const user = jwt.verify(token, process.env.TOKEN_SECRET_KEY as string);
            req.user = user;
            
            next();
        }
    }catch(err: any) {
        return next(err);
    }
}

export default checkAuthorizationMiddleWare