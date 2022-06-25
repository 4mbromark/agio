import { Collection } from '../agio-namespace/collection.namespace';
import { Document, ObjectId, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AgioBaseSchema } from '../agio-common/base.schema';

export type MessageReceiverDocument = MessageReceiver & Document;

@Schema({
    collection: Collection.MESSAGE_RECEIVER,
    timestamps: true
})
export class MessageReceiver extends AgioBaseSchema {

    @Prop({ type: Types.ObjectId, required: true })
    idUser: ObjectId;

    @Prop({ required: true }) 
    address: string;
}

export const MessageReceiverSchema = SchemaFactory.createForClass(MessageReceiver);