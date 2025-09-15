/* eslint-disable no-console */
import {Server}  from "http"
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
 
 

let server : Server;
 

const startServer = async () =>{
   try{     

    await mongoose.connect(envVars.DB_URL)

    console.log("Connected to DB");
     server = app.listen(5000, () =>{
        console.log("Server is listening to port 5000");
    })

   }catch(error){
        console.log(error)
   }
}

(async() =>{
   await startServer()
await seedSuperAdmin()
})()


process.on("unhandledRejection", (err) => {
    console.log("UnhandledRejection detected... Server shutting down...", err)
    if(server){
        server.close(() => {
            process.exit(1) /// node js server off 
        });
    }
    process.exit(1)
})
process.on("uncaughtException", (err) => {
    console.log("uncaughtException... Server shutting down...", err)
    if(server){
        server.close(() => {
            process.exit(1) /// node js server off 
        });
    }
    process.exit(1)
})


process.on("SIGTERM", ( ) =>{
    console.log("Sigterm signal recieved... server shutting down..." )
    if(server){
        server.close(() => {
            process.exit(1) // node js server off 
        })
    }
})
process.on("SIGINT", ( ) =>{
    console.log("Sigint  signal recieved... server shutting down..." )
    if(server){
        server.close(() => {
            process.exit(1) // node js server off 
        })
    }
})

// unhandled rejection 
// Promise.reject(new Error("I forgot to catch this promise"))


// uncaught exception 
// throw new Error("I forgot to handle this local error")


/**
 * unhandled rejection error 
 * uncaught rejection error 
 * signal termination sigterm
 */