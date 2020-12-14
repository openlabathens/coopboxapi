import HttpException from "./HttpException";

class CoopboxNotFoundException extends HttpException {
    constructor(id: string) {
        super(404, `Coopbox with id: ${id} not found`);
    }
}

export default CoopboxNotFoundException;