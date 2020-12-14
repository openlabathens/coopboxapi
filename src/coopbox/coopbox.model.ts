import * as mongoose from 'mongoose';
import Coopbox from './coopbox.interface';

const coopboxSchema = new mongoose.Schema({
    token: {
        type: String
    },
});

const coopboxModel = mongoose.model<Coopbox & mongoose.Document>('Coopbox', coopboxSchema);

export default coopboxModel;