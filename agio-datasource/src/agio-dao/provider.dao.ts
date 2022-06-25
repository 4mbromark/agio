import { Provider, ProviderDocument } from './../agio-schema/provider.schema';
import { Injectable } from "@nestjs/common";
import { AgioDatabaseBaseDao } from "../agio-common/base.dao";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AgioProviderDao extends AgioDatabaseBaseDao<Provider> {

    constructor(
        @InjectModel(Provider.name) protected readonly providerModel: Model<ProviderDocument>
    ) {
        super(providerModel);
    }

}