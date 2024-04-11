import { Collection } from '../agio-namespace/collection.namespace';
import { Document, ObjectId, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AgioBaseSchema } from '../agio-common/base.schema';
import { User } from './user.schema';

export type MessageReceiverDocument = MessageReceiver & Document;

@Schema({
    collection: Collection.MESSAGE_RECEIVER,
    timestamps: true
})
export class MessageReceiver extends AgioBaseSchema {

    @Prop({
        type: Types.ObjectId,
        ref: User.name,
        required: true
    })
    user: User;

    @Prop({ required: true }) 
    address: string;
}

export const MessageReceiverSchema = SchemaFactory.createForClass(MessageReceiver);