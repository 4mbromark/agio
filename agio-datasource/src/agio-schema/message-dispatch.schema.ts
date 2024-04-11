import { MessageValidation } from './message-validation.schema';
import { Provider } from './provider.schema';
import { MessageDispatchParameter } from './message-dispatch-parameter.schema';
import { Message } from './message.schema';
import { MessageDispatchStatus } from '../agio-namespace/message.namespace';
import { Collection } from '../agio-namespace/collection.namespace';
import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AgioBaseSchema } from '../agio-common/base.schema';
import { MessageReceiver } from './receiver.schema';
import { MessageLog } from './message-log.schema';

export type MessageDispatchDocument = MessageDispatch & Document;

@Schema({
    collection: Collection.MESSAGE_DISPATCH,
    timestamps: true
})
// TODO unique idMessage + idProvider + idReceiver + attempt
export class MessageDispatch extends AgioBaseSchema {

    @Prop({
        type: Types.ObjectId,
        ref: Message.name,
        required: true,
        autopopulate: true
    })
    message: Message; 

    @Prop({
        type: Types.ObjectId,
        ref: Provider.name,
        required: true
    })
    provider: Provider; 

    @Prop({
        type: Types.ObjectId,
        ref: MessageReceiver.name,
        required: true,
        autopopulate: true
    })
    receiver: MessageReceiver; 

    @Prop()
    status: MessageDispatchStatus;

    @Prop({ required: true, default: 1 })
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
        ref: MessageValidation.name,
        autopopulate: true
    })
    validation: MessageValidation; 

    @Prop({ type: [{
        type: Types.ObjectId,
        ref: MessageDispatchParameter.name,
        autopopulate: true
    }]})
    parameters: MessageDispatchParameter[]; 

    @Prop({ type: [{
        type: Types.ObjectId,
        ref: MessageLog.name
    }]})
    logs: MessageLog[]; 
}

export const MessageDispatchSchema = SchemaFactory.createForClass(MessageDispatch);