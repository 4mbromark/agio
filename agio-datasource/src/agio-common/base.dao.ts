import { AgioBaseSchema } from './base.schema';
import { Model, ObjectId } from 'mongoose';

export abstract class AgioDatabaseBaseDao<T extends AgioBaseSchema> {

    constructor(
        protected readonly model: Model<T>
    ) { }

    public async getAll(): Promise<T[]> { 
        const documentList: T[] = await this.model.find();
        return documentList;
    }

    public async getById(_id: ObjectId | string): Promise<T> { 
        const document: T = await this.model.findById(_id);
        return document;
    }
}