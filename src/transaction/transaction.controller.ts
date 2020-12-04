import { Request, Response, Router } from 'express';
import Controller from '../interfaces/controller.interface';
import userModel from '../user/user.model';
import transactionModel from '../transaction/transaction.model';

class TransactionController implements Controller {
  public path = '/report';
  public pathTransactions = '/transactions';
  public router = Router();
  private transaction = transactionModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    //this.router.get(`${this.path}`, this.generateReport);
    this.router.post(`${this.pathTransactions}/:id`, this.postTransactions );
  }

  private postTransactions = async (request: Request, response: Response) => {
  
    const CoopboxId = request.params.id;
    const transactionData = request.body;
    const createdTransaction = new this.transaction({
      ...transactionData,
      coopbox: CoopboxId,
    });
    const savedTransaction = await createdTransaction.save();
    //await savedTransaction.populate().execPopulate();
    //console.log(savedTransaction);
    response.send(201);
  }
 
  
  /* private generateReport = async (request: Request, response: Response) => {
    const usersByCountries = await this.user.aggregate(
      [
        {
          $match: {
            'address.country': {
              $exists: true,
            },
          },
        },
        {
          $group: {
            _id: {
              country: '$address.country',
            },
            users: {
              $push: {
                _id: '$_id',
                name: '$name',
              },
            },
            count: {
              $sum: 1,
            },
          },
        },
        {
          $lookup: {
            from: 'posts',
            localField: 'users._id',
            foreignField: 'author',
            as: 'articles',
          },
        },
        {
          $addFields: {
            amountOfArticles: {
              $size: '$articles',
            },
          },
        },
        {
          $sort: {
            amountOfArticles: 1,
          },
        },
      ],
    );
    response.send({
      usersByCountries,
    });
  }*/

}

export default TransactionController ;
