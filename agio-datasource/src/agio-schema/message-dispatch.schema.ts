import { Provider } from './provider.schema';
import { MessageDispatchParameter } from './message-dispatch-parameter.schema';
import { Message } from './message.schema';
import { MessageDispatchValidation } from './message-dispatch-validation.schema';
import { MessageStatus, MessageDispatchStatus } from '../agio-namespace/message.namespace';
import { MessageText } from './message-text.schema';
import { Collection } from '../agio-namespace/collection.namespace';
import { Document, ObjectId, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AgioBaseSchema } from '../agio-common/base.schema';
import { MessageTemplate } from './message-template.schema';
import { MessageReceiver } from './receiver.schema';
import { MessageLog } from './message-log.schema';

export type MessageDispatchDocument = MessageDispatch & Document;

@Schema({
    collection: Collection.MESSAGE_DISPATCH,
    timestamps: true
})
// TODO unique idMessage + idProvider + idReceiver + attempt
export class MessageDispatch extends AgioBaseSchema {

    @Prop({ type: Types.ObjectId, required: true })
    idMessage: ObjectId;

    @Prop({ type: Types.ObjectId, required: true })
    idProvider: ObjectId;

    @Prop({ type: Types.ObjectId, required: true })
    idReceiver: ObjectId;

    @Prop()
    status: MessageDispatchStatus;

    @Prop({ default: 1 })
    attempt: number;

    @Prop({ default: null })
    scheduled: Date;

    @Prop({ default: null })
    sent: Date;

    @Prop({ default: null })
    detail: string;

    @Prop({ default: null })
    identifier: string;

    @Prop({
        type: Types.ObjectId,
        ref: Message.name,
        autopopulate: true
    })
    message: Message; 

    @Prop({
        type: Types.ObjectId,
        ref: Provider.name,
        autopopulate: true
    })
    provider: Provider;

    @Prop({
        type: Types.ObjectId,
        ref: MessageReceiver.name,
        autopopulate: true
    })
    receiver: MessageReceiver; 

    @Prop({
        type: Types.ObjectId,
        ref: MessageDispatchValidation.name,
        autopopulate: true
    })
    validation: MessageDispatchValidation; 

    @Prop({ type: [{
        type: Types.ObjectId,
        ref: MessageDispatchParameter.name,
        autopopulate: true
    }]})
    parameters: MessageDispatchParameter; 

    @Prop({ type: [{
        type: Types.ObjectId,
        ref: MessageLog.name,
        autopopulate: false
    }]})
    logs: MessageLog[]; 
}

export const MessageDispatchSchema = SchemaFactory.createForClass(MessageDispatch);