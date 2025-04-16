class ApiResponse {
    constructor(
        statusCode , 
        message = "Successful" ,
        success = true ,
        data
    ) {
         this.statusCode = statusCode  ,
         this.message = message ,
        this.success = success ,
         this.data = data;
    }
}