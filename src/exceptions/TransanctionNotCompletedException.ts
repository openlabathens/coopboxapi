import HttpException from "./HttpException";

class TransanctionNotCompletedException extends HttpException {
    constructor(id: string) {
        super(404, `Transaction could not be completed for Coopbox with id ${id}.`)
    }
}

export default TransanctionNotCompletedException;