import { Router, Request, Response, NextFunction } from "express";
import Controller from "../interfaces/controller.interface";
import coopboxModel from "../coopbox/coopbox.model";
import CoopboxNotFoundException from "../exceptions/CoopboxNotFoundException";

class CoopboxController implements Controller {

    public path = '/coopboxes';
    public router = Router();
    private coopbox = coopboxModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/:id`, this.getCoopboxById);
    }

    private getCoopboxById = async (request: Request, response: Response, next: NextFunction) => {
        const coopboxId = request.params.id
        const coopboxQuery = this.coopbox.findById(coopboxId);
        try {
            if (coopboxQuery != null) {
                coopboxQuery.populate('coopbox').exec();
            }
            const coopbox = await coopboxQuery;
            if (coopbox.token === process.env.JWT_SECRET) {
                response.sendStatus(200);
            }
        } catch {
            next(new CoopboxNotFoundException(coopboxId));
        };


    }
}

export default CoopboxController;