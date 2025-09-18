/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes"
import { UserServices } from "./user.service";
import AppError from "../../errorHelpers/errorHelpers";
import { catchAsync } from "../../utils/catchAsync";
import { success } from "zod";
import { sendResponse } from "../../utils/sendResponse";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JWTAlgorithm } from "zod/v4/core/util.cjs";
import { JwtPayload } from "jsonwebtoken";


// type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>

// const catchAsync = (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) =>{
//     Promise.resolve(fn(req, res, next)).catch((err : any) => {
//         console.log(err);
//         next(err)
//     })
// }

//------------------------------------------

// const createUser = async (req: Request, res: Response, next: NextFunction) =>{
//     try{    

//         // throw new Error("Fake Error") 
//         throw new AppError(httpStatus.BAD_REQUEST, "fake error")

//         const user = await UserServices.createUser(req.body)
//         res.status(httpStatus.CREATED).json({
//             message: "User Created Successfully",
//             user
//         })

//     }
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     catch(error : any){
//         console.log(error);
//        next(error)
//     }
// }
const createUser = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
        const user = await UserServices.createUser(req.body)

        res.status(httpStatus.CREATED).json({
            message: "User Created Successfully",
            user
        })
})


const updateUser = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{
    const userId = req.params.id;
    // const token = req.headers.authorization
    // const verifiedToken = verifyToken(token as string, envVars.JWT_ACCESS_SECRET) as JwtPayload

    const verifiedToken = req.user;

    const payload = req.body
    const user = await UserServices.updateUser(userId, payload, verifiedToken as JwtPayload) 


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Updated Successfully",
        data: user
    })
})

const getAllUsers =  catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
        const result = await UserServices.getAllUsers();



        // res.status(httpStatus.OK).json({
        //     success: true,
        //     message: "All Users Retrieved Successfully",
        //     data: users
        // })

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "All Users Retrieved Successfully",
            data: result.data,
            meta: result.meta
            
        })


})

export const UserControllers = {
    createUser,
    getAllUsers,
    updateUser
}


// route matching  -> controller -> service -> model -> DB