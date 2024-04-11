import { MessageDispatch } from './message-dispatch.schema';
import { MessageLog } from './message-log.schema';
import { MessageStatus } from './../agio-namespace/message.namespace';
import { MessageText } from './message-text.schema';
import { Collection } from '../agio-namespace/collection.namespace';
import { Document, ObjectId, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AgioBaseSchema } from '../agio-common/base.schema';
import { MessageValidation } from './message-validation.schema';
import { User } from './user.schema';

export type MessageDocument = Message & Document;

@Schema({
    collection: Collection.MESSAGE,
    timestamps: true
})
export class Message extends AgioBaseSchema {

    @Prop({
        type: Types.ObjectId,
        ref: User.name,
        required: true
    })
    user: User;

    @Prop()
    status: MessageStatus;

    @Prop({
        type: Types.ObjectId,
        ref: MessageText.name,
        autopopulate: true
    })
    text: MessageText; 

    /* @Prop({
        type: [MessageDispatch],
        ref: MessageDispatch.name
    })
    dispatches: MessageDispatch[]; */

    @Prop({
        type: Types.ObjectId,
        ref: MessageValidation.name,
        autopopulate: true
    })
    validation: MessageValidation; 

    @Prop({ type: [{
        type: Types.ObjectId,
        ref: MessageLog.name
    }]})
    logs: MessageLog[]; 
}

export const MessageSchema = SchemaFactory.createForClass(Message);