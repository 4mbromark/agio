import { Collection } from '../agio-namespace/collection.namespace';
import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AgioBaseSchema } from '../agio-common/base.schema';

export type UserDocument = User & Document;

@Schema({
    collection: Collection.USER,
    timestamps: true
})
export class User extends AgioBaseSchema {

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    mail: string;

    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;
}

export const UserSchema = SchemaFactory.createForClass(User);