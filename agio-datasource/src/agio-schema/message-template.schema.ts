import { Collection } from '../agio-namespace/collection.namespace';
import { Document, ObjectId, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AgioBaseSchema } from '../agio-common/base.schema';

export type MessageTemplateDocument = MessageTemplate & Document;

@Schema({
    collection: Collection.MESSAGE_TEMPLATE,
    timestamps: true
})
export class MessageTemplate extends AgioBaseSchema {

    @Prop({ type: Types.ObjectId, required: true })
    idUser: ObjectId;

    @Prop({ required: true }) 
    object: string;

    @Prop({ required: true }) 
    body: string;

    @Prop({ required: true, default: false }) 
    isHtml: boolean;
}

export const MessageTemplateSchema = SchemaFactory.createForClass(MessageTemplate);