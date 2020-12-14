import { NextFunction, Request, Response, Router } from 'express';
import Controller from '../interfaces/controller.interface';
import transactionModel from '../transaction/transaction.model';
import coopboxModel from '../coopbox/coopbox.model';
import TransanctionNotCompletedException from '../exceptions/TransanctionNotCompletedException';

class TransactionController implements Controller {
  public path = '/report';
  public pathTransactions = '/transactions';
  public router = Router();
  private transaction = transactionModel;
  private coopbox = coopboxModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.pathTransactions}/:id`, this.postTransactions);
  }

  private postTransactions = async (request: Request, response: Response, next: NextFunction) => {

    const coopboxId = request.params.id;
    const transactionData = request.body;
    const coopboxQuery = this.coopbox.findById(coopboxId);

    try {
      if (coopboxQuery != null) {
        coopboxQuery.populate('coopbox').exec();
      }
      const coopbox = await coopboxQuery;
      if (coopbox.token === process.env.JWT_SECRET) {
        const createdTransaction = new this.transaction({
          ...transactionData,
          coopbox: coopboxId,
        });
        response.sendStatus(201);
      }

    } catch {
      next(new TransanctionNotCompletedException(coopboxId));
    }
  }
}

export default TransactionController;
