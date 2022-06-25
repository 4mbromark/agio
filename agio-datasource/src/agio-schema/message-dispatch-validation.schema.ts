import { Collection } from '../agio-namespace/collection.namespace';
import { Document, ObjectId, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { MessageValidation } from './message-validation.schema';

export type MessageDispatchValidationDocument = MessageDispatchValidation & Document;

@Schema({
    collection: Collection.MESSAGE_DISPATCH_VALIDATION,
    timestamps: true
})
export class MessageDispatchValidation extends MessageValidation {

    @Prop({ type: Types.ObjectId, default: null })
    idDispatch: ObjectId;
}

export const MessageDispatchValidationSchema = SchemaFactory.createForClass(MessageDispatchValidation);