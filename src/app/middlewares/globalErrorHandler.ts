/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/errorHelpers"
import { handlerDuplicateError } from "../helpers/handleDuplicateError"
import { handlerCastError } from "../helpers/handleCastError"
import { handleerValidationError } from "../helpers/handlerValidationError"
import { handlerZodError } from "../helpers/handleZodError"
import { TErrorSources } from "../interfaces/error.types"
 

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export const  globalErrorHandler = (err: any, req: Request, res: Response, next : NextFunction) =>{
    if(envVars.NODE_ENV === "development"){
        console.log(err);
    }

    let errorSources : TErrorSources[] = []
    let statusCode = 500
    let message = "Something Went Wrong!!"

    // mongodb duplicate error ----------
    
    if(err.code === 11000){
        const simplifiedError = handlerDuplicateError(err)
        statusCode =  simplifiedError.statusCode
        message =  simplifiedError.message
    }
    // Object ID error , cust error
    else if(err.name === "CastError"){
       const simplifiedError = handlerCastError(err)
        statusCode =  simplifiedError.statusCode
        message =  simplifiedError.message
    }
    // Mongoose Validation Error
    else if(err.name === "ValidationError"){
        const simplifiedError = handleerValidationError(err)
        statusCode = simplifiedError.statusCode
        errorSources =  simplifiedError.errorSources as TErrorSources[]
        message = simplifiedError.message
    }

    else if(err.name === "ZodError"){
        const simplifiedEror = handlerZodError(err)
        statusCode = simplifiedEror.statusCode
        message = simplifiedEror.message
        errorSources = simplifiedEror.errorSources as TErrorSources[]
    }
   else if(err instanceof AppError){
        statusCode = err.statusCode
        message = err.message
    }
    else if(err instanceof Error){
        statusCode = 500;
        message = err.message
    }

    res.status(statusCode).json({
        success : false,
        message,
        errorSources,
        err : envVars.NODE_ENV === "development" ? err : null,
        stack: envVars.NODE_ENV === "development" ? err.stack : null
    })
}

 