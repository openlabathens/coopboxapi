import { NextFunction, Request, Response, Router } from 'express';
import Controller from '../interfaces/controller.interface';
import userModel from '../user/user.model';
import transactionModel from '../transaction/transaction.model';
import coopboxModel from '../coopbox/coopbox.model';
import CoopboxNotFoundException from '../exceptions/CoopboxNotFoundException';

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
    //this.router.get(`${this.path}`, this.generateReport);
    this.router.post(`${this.pathTransactions}/:id`, this.postTransactions);
  }

  private postTransactions = async (request: Request, response: Response, next: NextFunction) => {

    const coopboxId = request.params.id;
    const transactionData = request.body;
    const coopboxQuery = this.coopbox.findById(coopboxId);
    
    if (coopboxQuery != null) {
      coopboxQuery.populate('coopbox').exec();
    } else {
      //response.sendStatus(404);
      next(new CoopboxNotFoundException(coopboxId));
    };
    const coopbox = await coopboxQuery;
    if (coopbox.token === process.env.JWT_SECRET) {
      //response.sendStatus(200);
      const createdTransaction = new this.transaction({
        ...transactionData,
        coopbox: coopboxId,
      });
      const savedTransaction = await createdTransaction.save();
      //await savedTransaction.populate().execPopulate();
      //console.log(savedTransaction);
      response.sendStatus(201);
    }

  }
}

export default TransactionController;
