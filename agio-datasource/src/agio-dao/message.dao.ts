import { MessageValidation, MessageValidationDocument } from './../agio-schema/message-validation.schema';
import { MessageDispatchDocument } from './../agio-schema/message-dispatch.schema';
import { MessageLog, MessageLogDocument } from './../agio-schema/message-log.schema';
import { Message, MessageDocument } from './../agio-schema/message.schema';
import { Injectable } from "@nestjs/common";
import { AgioDatabaseBaseDao } from "../agio-common/base.dao";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageDispatchStatus, MessageStatus } from '../agio-namespace/message.namespace';
import { MessageDispatch } from './../agio-schema/message-dispatch.schema';

@Injectable()
export class AgioMessageDao extends AgioDatabaseBaseDao<Message> {

    private static MESSAGE_VALID = {
        message: {
            status: MessageStatus.OK,
            validation: {
                $or: [
                    { isValid: true },
                    { force: true }
                ]
            }
        }
    };

    constructor(
        @InjectModel(Message.name) protected readonly messageModel: Model<MessageDocument>,
        @InjectModel(MessageDispatch.name) protected readonly messageDispatchModel: Model<MessageDispatchDocument>,
        @InjectModel(MessageValidation.name) protected readonly messageValidationModel: Model<MessageValidationDocument>,
        @InjectModel(MessageLog.name) protected readonly messageLogModel: Model<MessageLogDocument>
    ) {
        super(messageModel);
    }

    public async getByStatus(status: MessageStatus): Promise<Message[]> {
        return await this.messageModel.find({
            $and: [
                { status: status }
            ]
        });
    }

    public async getByStatusCreated(): Promise<Message[]> {
        return await this.messageModel.find({
            $and: [
                { status: MessageStatus.CREATED },
                { validation: null }
            ]
        }).sort({ createdAt: 1 }).limit(50);
    }

    public async getDispatchesByStatus(status: MessageDispatchStatus): Promise<MessageDispatch[]> {
        return await this.messageDispatchModel.find({
            $and: [
                { status: status }
            ]
        });
    }

    public async getDispatchesByStatusReady(): Promise<MessageDispatch[]> {
        return await this.messageDispatchModel.find({
            $and: [
                // AgioMessageDao.MESSAGE_VALID,
                { status: MessageDispatchStatus.READY },
                { validation: null },
                { sent: null },
                { detail: null },
                { identifier: null }
            ]
        }).sort({ createdAt: 1 }).limit(50);
    }

    public async getDispatchesByStatusScheduled(date: Date): Promise<MessageDispatch[]> {
        return await this.messageDispatchModel.find({
            $and: [
                // AgioMessageDao.MESSAGE_VALID,
                { status: MessageDispatchStatus.SCHEDULED },
                {
                    scheduled: {
                        $lte: date
                    }
                },
                { sent: null },
                { detail: null },
                { identifier: null }
            ]
        }).sort({ scheduled: 1 }).limit(50);
    }

    public async insert(message: Message): Promise<Message> { 
        return await this.model.create(message);
    }

    public async insertDispatch(dispatch: MessageDispatch): Promise<MessageDispatch> { 
        return await this.messageDispatchModel.create(dispatch);
    }

    public async updateFromStatus(message: Message, oldStatus: MessageStatus): Promise<Message> {
        return await this.messageModel.findOneAndUpdate({
            $and: [
                { _id: message._id },
                { status: oldStatus }
            ]
        }, message);
    }

    public async updateStatusFromStatus(message: Message, newStatus: MessageStatus, oldStatus: MessageStatus): Promise<Message> {
        return await this.messageModel.findOneAndUpdate({
            $and: [
                { _id: message._id },
                { status: oldStatus }
            ]
        }, {
            $set: {
                status: newStatus
            }
        }, { new: true });
    }

    public async updateStatusCreated(message: Message): Promise<Message> {
        return await this.messageModel.findOneAndUpdate({
            $and: [
                { _id: message._id },
                { status: null },
                { validation: null }
            ]
        }, {
            $set: {
                status: MessageStatus.CREATED
            }
        }, { new: true });
    }

    public async updateStatusValidating(message: Message): Promise<Message> {
        return await this.messageModel.findOneAndUpdate({
            $and: [
                { _id: message._id },
                { status: MessageStatus.CREATED },
                { validation: null }
            ]
        }, {
            $set: {
                status: MessageStatus.VALIDATING
            }
        }, { new: true });
    }

    public async updateDispatchFromStatus(dispatch: MessageDispatch, oldStatus: MessageDispatchStatus): Promise<MessageDispatch> {
        return await this.messageDispatchModel.findOneAndUpdate({
            $and: [
                { _id: dispatch._id },
                // AgioMessageDao.MESSAGE_VALID,
                { status: oldStatus }
            ]
        }, dispatch, { new: true });
    }

    public async updateDispatchStatusFromStatus(dispatch: MessageDispatch, newStatus: MessageDispatchStatus, oldStatus: MessageDispatchStatus): Promise<MessageDispatch> {
        return await this.messageDispatchModel.findOneAndUpdate({
            $and: [
                { _id: dispatch._id },
                // AgioMessageDao.MESSAGE_VALID,
                { status: oldStatus }
            ]
        }, {
            $set: {
                status: newStatus
            }
        }, { new: true });
    }

    public async updateDispatchStatusReady(dispatch: MessageDispatch): Promise<MessageDispatch> {
        return await this.messageDispatchModel.findOneAndUpdate({
            $and: [
                { _id: dispatch._id },
                // AgioMessageDao.MESSAGE_VALID,
                { status: null },
                { validation: null },
                { sent: null },
                { detail: null },
                { identifier: null }
            ]
        }, {
            $set: {
                status: MessageDispatchStatus.READY
            }
        }, { new: true });
    }

    public async updateDispatchStatusValidating(dispatch: MessageDispatch): Promise<MessageDispatch> {
        return await this.messageDispatchModel.findOneAndUpdate({
            $and: [
                { _id: dispatch._id },
                // AgioMessageDao.MESSAGE_VALID,
                { status: MessageDispatchStatus.READY },
                { validation: null },
                { sent: null },
                { detail: null },
                { identifier: null }
            ]
        }, {
            $set: {
                status: MessageDispatchStatus.VALIDATING
            }
        }, { new: true });
    }

    public async insertValidation(validation: MessageValidation): Promise<MessageValidation> {
        return await this.messageValidationModel.create(validation);
    }

    public async forceValidation(validation: MessageValidation, forced: boolean): Promise<MessageValidation> {
        return await this.messageValidationModel.findOneAndUpdate({
            $and: [
                { _id: validation._id },
                { isValid: false },
                { force: null }
            ]
        }, {
            $set: {
                force: forced
            }
        }, { new: true });
    }

    public async insertLog(log: MessageLog): Promise<MessageLog> {
        return await this.messageValidationModel.create(log);
    }

    public async addValidation(message: Message, validation: MessageValidation): Promise<Message> {
        return await this.messageModel.findOneAndUpdate({
            $and: [
                { _id: message._id },
                { status: MessageStatus.VALIDATING },
                { validation: null }
            ]
        }, {
            $set: {
                validation: validation._id
            }
        }, { new: true });
    }

    public async addDispatchValidation(dispatch: MessageDispatch, validation: MessageValidation): Promise<MessageDispatch> {
        return await this.messageDispatchModel.findOneAndUpdate({
            $and: [
                { _id: dispatch._id },
                // AgioMessageDao.MESSAGE_VALID,
                { status: MessageDispatchStatus.VALIDATING },
                { validation: null },
                { sent: null },
                { detail: null },
                { identifier: null }
            ]
        }, {
            $set: {
                validation: validation._id
            }
        }, { new: true });
    }

    public async addLog(message: Message, log: MessageLog): Promise<MessageLog> {
        return await this.messageModel.findOneAndUpdate(message._id, {
            $push: {
                logs: log._id
            }
        }, { new: true });
    }

    public async addDispatchLog(dispatch: MessageDispatch, log: MessageLog): Promise<MessageLog> {
        return await this.messageDispatchModel.findOneAndUpdate(dispatch._id, {
            $push: {
                logs: log._id
            }
        }, { new: true });
    }
}