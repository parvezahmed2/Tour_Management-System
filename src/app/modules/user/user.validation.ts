import z from "zod";
import { IsActive, Role } from "./user.interface";

 export const createUserZodSchema = z.object({
        name: z.string({ error: "Name must be string" }).min(2, { message: "Name bust be at least 2 characters long" }).max(50, { message: "Name cannot exceed 50 characters." }),

        email: z.string({error: "Email bust be string"}).toLowerCase().trim().refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
            { message: "Invalid email format" }),
        // 1uppercase, 1special character, 1digit, 8 character min

        //   (?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
        password: z.string().min(8).regex(/^(?=.*[A-Z])/, {
            message: "Password must contain at least 1 uppercase letter.",
        }).regex(/^(?=.*[!@$%^&*])/, {
            message: "Password must contain at least 1 special character.",
        }).regex(/^(?=.*\d)/, {
            message: "Password must contain at least 1 number",
        }),


        phone: z.string({error: "Phone Number must be string"}).regex(/^(?:\+8801\d{9}|01\d{9})$/,{
            message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
        }).optional(),
       
         address: z.string({error: "Address must be string"}).max(200,{message: "Address cannot exceed 200 characters."}).optional()         
    })
 export const updateUserZodSchema = z.object({
        name: z.string({ error: "Name must be string" }).min(2, { message: "Name bust be at least 2 characters long" }).max(50, { message: "Name cannot exceed 50 characters." }).optional(),

         
        // 1uppercase, 1special character, 1digit, 8 character min

        //   (?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
        password: z.string().min(8).regex(/^(?=.*[A-Z])/, {
            message: "Password must contain at least 1 uppercase letter.",
        }).regex(/^(?=.*[!@$%^&*])/, {
            message: "Password must contain at least 1 special character.",
        }).regex(/^(?=.*\d)/, {
            message: "Password must contain at least 1 number",
        }).optional(),


        phone: z.string({error: "Phone Number must be string"}).regex(/^(?:\+8801\d{9}|01\d{9})$/,{
            message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
        }).optional(),



        role: z.enum(Object.values(Role) as [string]).optional(),
        isActive: z.enum(Object.values(IsActive) as [string]).optional(),
        isDeleted: z.boolean({error: "isDeleted must be true or false"}).optional(),
        isVerified: z.boolean({error: "isVerified must be true or false"}).optional(),

       
         address: z.string({error: "Address must be string"}).max(200,{message: "Address cannot exceed 200 characters."}).optional()         
    })