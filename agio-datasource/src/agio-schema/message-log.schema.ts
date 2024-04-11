import { Collection } from '../agio-namespace/collection.namespace';
import { Document, ObjectId, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AgioBaseSchema } from '../agio-common/base.schema';

export type MessageLogDocument = MessageLog & Document;

@Schema({
    collection: Collection.MESSAGE_LOG,
    timestamps: true
})
export class MessageLog extends AgioBaseSchema {

    @Prop({ required: true }) 
    text: string;

    @Prop({ required: true, default: false }) 
    isTechnical: boolean;
}

export const MessageLogSchema = SchemaFactory.createForClass(MessageLog);