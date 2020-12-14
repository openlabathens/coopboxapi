import HttpException from "./HttpException";

class TransanctionNotCompletedException extends HttpException {
    constructor(id: string,type:string) {
        if(type=='404'){
            super(404, `Transaction could not be completed for Coopbox. Coopbox with id ${id} was not found.`)
        }else if(type=='401'){
            super(401, `Transaction could not be completed for Coopbox.Transaction autorization was wrong for Coobox with id ${id}.`)
        }
        else{
            super(404, `Transaction could not be completed for Coopbox. Unkown error. Faild with id ${id}.`)
        }
       
    }
}

export default TransanctionNotCompletedException;