import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes"
 
import { AuthServices } from "./auth.service";
import AppError from "../../errorHelpers/errorHelpers";
import { setAuthCookie } from "../../utils/setCookie";
import { JwtPayload } from "jsonwebtoken";
import { createUserTokens } from "../../utils/userTokens";
import { envVars } from "../../config/env";
import passport from "passport";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const credentialsLogin = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{
    // const loginInfo = await AuthServices.credentialsLogin(req.body) // with service  
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    passport.authenticate("local", async(err: any, user: any, info: any) => {
        if(err){
            // return new AppError(401, err)
            // return next(err)

            return next(new AppError(401, err))

        }
        if(!user){
           return next(new AppError(401, info.message))
        }

        const userTokens = await createUserTokens(user)

        // delete user.toObject().password
         // eslint-disable-next-line @typescript-eslint/no-unused-vars
         const { password : pass, ...rest } = user.toObject()

    setAuthCookie(res, userTokens)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged In Successfully",
        data:  {
            accessToken : userTokens.accessToken,
            refreshToken: userTokens.refreshToken,
            user : rest
        },
    })

    })(req, res, next)
     

    // res.cookie("accessToken", loginInfo.accessToken, {
    //     httpOnly: true,
    //     secure: false
    // })

    
    /// brouwser refresh token set kor dibe 
    // res.cookie("refreshToken", loginInfo.refreshToken, {
        //     httpOnly: true,
        //     secure: false
        // })

    
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getNewAccessToken = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{

    const refreshToken = req.cookies.refreshToken;
    // const refreshToken = req.headers.authorization;

    if(!refreshToken){
        throw new AppError(httpStatus.BAD_REQUEST, "No refresh token recieved from cookies")
    }

     

    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken as string)

    //  res.cookie("accessToken", tokenInfo.accessToken, {
    //     httpOnly: true,
    //     secure: false
    // })

    setAuthCookie(res, tokenInfo)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "New Access Token Retrive Successfully",
        data: tokenInfo,
    })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logout = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{


    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User LogOut Successfully",
        data:  null,
    })
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const resetPassword = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{
   
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user
     await AuthServices.resentPassword(oldPassword,  newPassword, decodedToken as JwtPayload )

   
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password Change Successfully",
        data:  null,
    })
})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const googleCallbackController = catchAsync ( async(req: Request, res: Response, next : NextFunction) => {

    let  redirectTo = req.query.state ? req.query.state as string : "" 
    if(redirectTo.startsWith("/")){
       redirectTo = redirectTo.slice(1)
    }
    const user = req.user;
    console.log(user)
    if(!user){
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }
    const tokenInfo =  createUserTokens(user)
    setAuthCookie(res, tokenInfo)

    // sendResponse(res, {
    //     success: true,
    //     statusCode: httpStatus.OK,
    //     message: "Password Changed Successfully",
    //     data: null
    // })

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
})


export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    googleCallbackController
}