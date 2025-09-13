

class AppError extends Error {
    public statusCode: number;
    constructor(statusCode: number, message: string, stack =''){
        super(message)
        this.statusCode = statusCode
         if(stack){
            this.stack = stack  // amader nijeder stack
         }else{
            Error.captureStackTrace(this, this.constructor) /// defalt stack
         }
    }
}

export default AppError