import { MessageTemplate } from './message-template.schema';
import { Collection } from '../agio-namespace/collection.namespace';
import { Document, ObjectId, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type MessageTextDocument = MessageText & Document;

@Schema({
    collection: Collection.MESSAGE_TEXT,
    timestamps: true
})
export class MessageText extends MessageTemplate {

    @Prop({ type: Types.ObjectId, required: true, unique: true })
    idMessage: ObjectId;
}

export const MessageTextSchema = SchemaFactory.createForClass(MessageText);