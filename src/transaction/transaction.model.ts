import * as mongoose from 'mongoose';
import Transaction from './transaction.interface';

const transactionSchema = new mongoose.Schema({
    /*coopbox: {
        ref: 'Coopbox',
        type: mongoose.Schema.Types.ObjectId,
    },*/
    coopbox:{
        type:String
    },
    datetime: {
        type: Date,
    },
    totalvalue: {
        type: Number,
    },
    transactions: [{
        datetime: {
            type: Date,
        },
        value: {
            type: Number,
        }
    }]
});

const transactionModel = mongoose.model<Transaction & mongoose.Document>('Transaction', transactionSchema);

export default transactionModel;
