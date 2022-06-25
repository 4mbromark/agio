import { MessageDispatchDocument } from './../agio-schema/message-dispatch.schema';
import { MessageLog } from './../agio-schema/message-log.schema';
import { Message, MessageDocument } from './../agio-schema/message.schema';
import { Injectable } from "@nestjs/common";
import { AgioDatabaseBaseDao } from "../agio-common/base.dao";
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { MessageDispatchStatus, MessageStatus } from '../agio-namespace/message.namespace';
import { MessageDispatch } from './../agio-schema/message-dispatch.schema';
import { resolve } from 'path';

@Injectable()
export class AgioMessageDao extends AgioDatabaseBaseDao<Message> {

    constructor(
        @InjectModel(Message.name) protected readonly messageModel: Model<MessageDocument>,
        @InjectModel(MessageDispatch.name) protected readonly messageDispatchModel: Model<MessageDispatchDocument>
    ) {
        super(messageModel);
    }

    public async getByStatus(status: MessageStatus): Promise<Message[]> {
        return await this.messageModel.find({
            $and: [
                { status: status }
            ]
        })
    }

    public async getByStatusCreated(): Promise<Message[]> {
        return await this.messageModel.find({
            $and: [
                { status: MessageStatus.CREATED }
            ]
        }).sort({ createdAt: 1 }).limit(50);
    }

    public async getDispatchesByStatus(status: MessageDispatchStatus): Promise<MessageDispatch[]> {
        return await this.messageDispatchModel.find({
            $and: [
                { status: status }
            ]
        })
    }

    public async getDispatchesByStatusReady(): Promise<MessageDispatch[]> {
        return await this.messageDispatchModel.find({
            $and: [
                {
                    message: {
                        status: MessageStatus.OK
                    }
                },
                { status: MessageDispatchStatus.READY },
                { sent: null },
                { detail: null },
                { identifier: null },
            ]
        }).sort({ createdAt: 1 }).limit(50);
    }

    public async getDispatchesByStatusScheduled(date: Date): Promise<MessageDispatch[]> {
        return await this.messageDispatchModel.find({
            $and: [
                {
                    message: {
                        status: MessageStatus.OK
                    }
                },
                { status: MessageDispatchStatus.SCHEDULED },
                { 
                    scheduled: {
                        $lte: date
                    }
                },
                { sent: null },
                { detail: null },
                { identifier: null },
            ]
        }).sort({ scheduled: 1 }).limit(50);
    }

    public async updateFromStatus(message: Message, oldStatus: MessageStatus): Promise<Message> {
        return await this.messageModel.findOneAndUpdate({
            $and: [
                { _id: message._id },
                { status: oldStatus }
            ]
        }, message);
    }

    public async updateStatusFromStatus(_id: ObjectId, newStatus: MessageStatus, oldStatus: MessageStatus): Promise<Message> {
        return new Promise<Message>((resolve, reject) => {
            this.messageModel.findOneAndUpdate({
                $and: [
                    { _id: _id },
                    { status: oldStatus }
                ]
            }, {
                $set: {
                    status: newStatus
                }
            }, { new: true }, (error, doc) => {
                console.log(doc);
                resolve(doc ? doc.toObject() : null);
            });
        }); 
    }

    public async updateDispatchFromStatus(dispatch: MessageDispatch, oldStatus: MessageDispatchStatus): Promise<MessageDispatch> {
        return await this.messageDispatchModel.findOneAndUpdate({
            $and: [
                { _id: dispatch._id },
                { 
                    message: {
                        status: MessageStatus.OK
                    }
                },
                { status: oldStatus }
            ]
        }, dispatch);
    }

    public async updateDispatchStatusFromStatus(_id: ObjectId, newStatus: MessageDispatchStatus, oldStatus: MessageDispatchStatus): Promise<MessageDispatch> {
        return await this.messageDispatchModel.findOneAndUpdate({
            $and: [
                { _id: _id },
                { 
                    message: {
                        status: MessageStatus.OK
                    }
                },
                { status: oldStatus }
            ]
        }, {
            $set: {
                status: newStatus
            }
        });
    }

    public async addLog(message: Message, log: MessageLog): Promise<MessageLog> {
        return await this.messageModel.findByIdAndUpdate(message._id, {
            $push: {
                logs: log
            }
        });
    }

    public async addDispatchLog(dispatch: MessageDispatch, log: MessageLog): Promise<MessageLog> {
        return await this.messageDispatchModel.findByIdAndUpdate(dispatch._id, {
            $push: {
                logs: log
            }
        });
    }
}