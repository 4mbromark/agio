import { Collection } from '../agio-namespace/collection.namespace';
import { Document, ObjectId, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AgioBaseSchema } from '../agio-common/base.schema';

export type MessageValidationDocument = MessageValidation & Document;

@Schema({
    collection: Collection.MESSAGE_VALIDATION,
    timestamps: true
})
export class MessageValidation extends AgioBaseSchema {

    @Prop({ type: Types.ObjectId, required: true })
    idMessage: ObjectId;

    @Prop({ default: null })
    isValid: boolean;

    @Prop({ type: [String], default: null })
    details: string[];

    @Prop({ default: null })
    force: boolean;
}

export const MessageValidationSchema = SchemaFactory.createForClass(MessageValidation);