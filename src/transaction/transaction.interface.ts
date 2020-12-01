interface Transaction {
    coopbox: string;
    datetime: Date;
    totalvalue: number;
    transactions: [{ datetime: Date; value:number }];
}

export default Transaction;
