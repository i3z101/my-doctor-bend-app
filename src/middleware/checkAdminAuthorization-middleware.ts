import { CookieOptions, NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { RequestWithExtraProps } from "../helper/types";

const checkAdminAuthorizationMiddleWare = async (req: RequestWithExtraProps, res: Response, next: NextFunction) => {
    try {
        
        if(!req.headers.cookie) {
            return res.redirect('/admin/login')
        }else {
            const cookies: any = cookie.parse(req.headers.cookie);
            if(cookies.authToken == null || cookies.authToken == undefined) {
                return res.redirect('/admin/login')
            }else{
                const token: string = cookies.authToken;
                const user = jwt.verify(token, process.env.TOKEN_SECRET_KEY as string);
                req.user = user;   
                next();
            }
        }
    }catch(err: any) {
        return next(err);
    }
}

export default checkAdminAuthorizationMiddleWare