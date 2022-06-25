import { Provider } from './../agio-schema/provider.schema';
import { Injectable } from "@nestjs/common";
import { AgioDatabaseBaseService } from "../agio-common/base.service";
import { AgioProviderDao } from '../agio-dao/provider.dao';

@Injectable()
export class AgioProviderService extends AgioDatabaseBaseService<Provider> {

    constructor(
        protected readonly providerDao: AgioProviderDao
    ) {
        super(providerDao);
    }

}