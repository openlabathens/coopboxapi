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

    //Get data from request
    const bearerHeader = request.headers['authorization'];
    const coopboxId = request.params.id;
    const transactionData = request.body;

    //Find Coopbox
    const coopbox = await this.coopbox.findById(coopboxId);
    
    //If found continue
    if (coopbox) {
      //Check if token exists
      if (bearerHeader) {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        //Check if token is right
        if (coopbox.token === bearerToken) {
          //Process transaction for date
          transactionData.datetime = this.unixToISO(transactionData.datetime);
          for (let transaction of transactionData.transactions) {
            transaction.datetime = this.unixToISO(transaction.datetime);
          }
          //Store transaction
          const createdTransaction = new this.transaction({
            ...transactionData,
            coopbox: coopboxId,
          });
          const savedTransaction = await createdTransaction.save();
          response.sendStatus(201);
        } else {
          next(new TransanctionNotCompletedException(coopboxId, '401'));
        }
      } else {
        next(new TransanctionNotCompletedException(coopboxId, '401'));
      }
    } else {
      next(new TransanctionNotCompletedException(coopboxId, '404'));
    }
  }

  private unixToISO(unix:number){
    const milliseconds = unix * 1000 
    const isoDate =  new Date(milliseconds).toISOString();
    return isoDate ;
  }
}

export default TransactionController;
