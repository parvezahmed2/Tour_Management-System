import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/errorHelpers";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";

export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) =>{
    try{
        const accessToken = req.headers.authorization;
        if(!accessToken){
            throw new AppError(403, "No token Recieved" )
        }

    // const verifiedToken  =jwt.verify(accessToken, "secret")
    const verifiedToken  = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload

    // check , authRoles = ["ADMIN", "SUPER_ADMIN"].includes("ADMIN")
    if(!authRoles.includes(verifiedToken.role)){
        throw new AppError(403, "You are not permitted to view this route!!" )
    }
    
    req.user = verifiedToken

    next()
    }
    catch(error){
         next(error)
    }
}
