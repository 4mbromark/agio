import { MessageStatus } from './../agio-namespace/message.namespace';
import { User, UserDocument } from './../agio-schema/user.schema';
import { Injectable } from "@nestjs/common";
import { AgioDatabaseBaseDao } from "../agio-common/base.dao";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AgioUserDao extends AgioDatabaseBaseDao<User> {

    constructor(
        @InjectModel(User.name) protected readonly userModel: Model<UserDocument>
    ) {
        super(userModel);
    }

}