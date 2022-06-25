import { Collection } from '../agio-namespace/collection.namespace';
import { Document, ObjectId, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AgioBaseSchema } from '../agio-common/base.schema';

export type ProviderDocument = Provider & Document;

@Schema({
    collection: Collection.USER,
    timestamps: true
})
export class Provider extends AgioBaseSchema {

    @Prop({ type: Types.ObjectId, required: true })
    idUser: ObjectId;
}

export const ProviderSchema = SchemaFactory.createForClass(Provider);