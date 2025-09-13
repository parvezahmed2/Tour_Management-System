import  express, {  Request, Response }  from "express";
import { router } from "./app/routes";
 
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
 
 
const app = express()
app.use(express.json())
app.use("/api/v1", router)
// app.use(cors())


app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to Tour Management System Basckend",
    })
})


// global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
app.use(globalErrorHandler)
//Route Not Found
app.use(notFound)



export default app