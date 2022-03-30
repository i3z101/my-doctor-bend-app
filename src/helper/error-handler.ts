export default (message: string, statusCode: number, validations?: any)=> {
    const error = new Error() as any;
    error.message = message,
    error.statusCode = statusCode;
    error.validations = validations ? validations.map((value:any)=>value.msg) : [];
    throw error;
}