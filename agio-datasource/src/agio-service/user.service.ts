import { AgioUserDao } from './../agio-dao/user.dao';
import { User } from './../agio-schema/user.schema';
import { Injectable } from "@nestjs/common";
import { AgioDatabaseBaseService } from "../agio-common/base.service";

@Injectable()
export class AgioUserService extends AgioDatabaseBaseService<User> {

    constructor(
        protected readonly userDao: AgioUserDao
    ) {
        super(userDao);
    }

}