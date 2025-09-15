import { NextFunction, Request, Response } from "express";
import { ZodObject, ZodTypeAny } from "zod";

type AnyZodObject = ZodObject<Record<string, ZodTypeAny>>;
export const validateRequest = (zodSchema: AnyZodObject) =>async (req: Request, res: Response, next: NextFunction) => {
   try{
    
    req.body = await zodSchema.parseAsync(req.body)
    next()

   }
   catch(error){
        next(error)
   }
}
