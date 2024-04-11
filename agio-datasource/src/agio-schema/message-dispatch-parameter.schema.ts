import { MessageStatus } from '../agio-namespace/message.namespace';
import { MessageText } from './message-text.schema';
import { Collection } from '../agio-namespace/collection.namespace';
import { Document, ObjectId, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AgioBaseSchema } from '../agio-common/base.schema';
import { MessageTemplate } from './message-template.schema';

export type MessageDispatchParameterDocument = MessageDispatchParameter & Document;

@Schema({
    collection: Collection.MESSAGE_DISPATCH_PARAMETER,
    timestamps: true
})
// TODO unique idTrace + key
export class MessageDispatchParameter extends AgioBaseSchema {

    @Prop({ required: true })
    key: string

    @Prop({ required: true })
    value: string
}

export const MessageDispatchParameterSchema = SchemaFactory.createForClass(MessageDispatchParameter);