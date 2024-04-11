import { Prop } from '@nestjs/mongoose';
import { ObjectId, Types } from 'mongoose';

export abstract class AgioBaseSchema {

    /* @Prop({
        type: Types.ObjectId,
        required: true,
        default: function () { new Types.ObjectId() }
    }) */
    _id: ObjectId;

    @Prop({
        type: Date
    })
    createdAt: Date;

    @Prop({
        type: Date
    })
    updatedAt: Date;
}