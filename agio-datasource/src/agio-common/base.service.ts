import { AgioBaseSchema } from './base.schema';
import { ObjectId } from 'mongoose';
import { AgioDatabaseBaseDao } from './base.dao';

export abstract class AgioDatabaseBaseService<T extends AgioBaseSchema> {

    constructor(
        protected readonly dao: AgioDatabaseBaseDao<T>
    ) { }

    public async getAll(): Promise<T[]> { 
        return await this.dao.getAll();
    }

    public async getById(_id: ObjectId | string): Promise<T> { 
        return await this.dao.getById(_id);
    }
}