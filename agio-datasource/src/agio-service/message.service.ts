import { MessageLog } from './../agio-schema/message-log.schema';
import { MessageValidation } from './../agio-schema/message-validation.schema';
import { MessageDispatch } from './../agio-schema/message-dispatch.schema';
import { ObjectId } from 'mongoose';
import { Message } from './../agio-schema/message.schema';
import { Injectable } from "@nestjs/common";
import { AgioDatabaseBaseService } from "../agio-common/base.service";
import { AgioMessageDao } from '../agio-dao/message.dao';
import { MessageDispatchStatus, MessageStatus } from '../agio-namespace/message.namespace';
import { MessageDispatchValidation } from '../agio-schema/message-dispatch-validation.schema';

@Injectable()
export class AgioMessageService extends AgioDatabaseBaseService<Message> {

    constructor(
        protected readonly messageDao: AgioMessageDao
    ) {
        super(messageDao);
    }

    public async getByStatus(status: MessageStatus): Promise<Message[]> {
        return await this.messageDao.getByStatus(status);
    }

    public async getByStatusCreated(): Promise<Message[]> {
        return await this.messageDao.getByStatusCreated();
    }

    public async updateFromStatus(message: Message, oldStatus: MessageStatus): Promise<Message> {
        return await this.messageDao.updateFromStatus(message, oldStatus);
    }

    public async updateStatusFromStatus(_id: ObjectId, newStatus: MessageStatus, oldStatus: MessageStatus): Promise<Message> {
        return await this.messageDao.updateStatusFromStatus(_id, newStatus, oldStatus);
    }


    // STATUSES

    public async updateStatusCreated(message: Message): Promise<Message> {
        return await this.updateStatusFromStatus(message._id, MessageStatus.CREATED, null);
    }

    public async updateStatusValidating(message: Message): Promise<Message> {
        return await this.updateStatusFromStatus(message._id, MessageStatus.VALIDATING, MessageStatus.CREATED);
    }

    public async updateStatusCompleted(message: Message): Promise<Message> {
        return await this.updateStatusFromStatus(message._id, MessageStatus.COMPLETED, MessageStatus.OK);
    }


    // VALIDATION

    public async addValidation(message: Message, isValid: boolean, details?: string[], force?: boolean): Promise<Message> {
        const validation = new MessageValidation();
        validation.isValid = isValid;
        validation.details = details;
        validation.force = force;

        message.validation = validation;
        message.status = !isValid && !force ? MessageStatus.INVALID : MessageStatus.OK;

        return this.updateFromStatus(message, MessageStatus.VALIDATING);
    }

    public async updateValidationFromInvalid(message: Message, forced: boolean): Promise<Message> {
        message.validation.force = forced;
        message.status = forced ? MessageStatus.OK : MessageStatus.REFUSED;

        return this.updateFromStatus(message, MessageStatus.INVALID);
    }


    // DISPATCH

    public async getDispatchesByStatus(status: MessageDispatchStatus): Promise<MessageDispatch[]> {
        return await this.messageDao.getDispatchesByStatus(status);
    }

    public async getDispatchesByStatusReady(): Promise<MessageDispatch[]> {
        return await this.messageDao.getDispatchesByStatusReady();
    }

    public async updateDispatchFromStatus(dispatch: MessageDispatch, oldStatus: MessageDispatchStatus): Promise<MessageDispatch> {
        return await this.messageDao.updateDispatchFromStatus(dispatch, oldStatus);
    }

    public async updateDispatchStatusFromStatus(_id: ObjectId, newStatus: MessageDispatchStatus, oldStatus: MessageDispatchStatus): Promise<MessageDispatch> {
        return await this.messageDao.updateDispatchStatusFromStatus(_id, newStatus, oldStatus);
    }

    public async updateDispatchStatusCreated(dispatch: MessageDispatch): Promise<MessageDispatch> {
        return await this.updateDispatchStatusFromStatus(dispatch._id, MessageDispatchStatus.READY, null);
    }

    public async updateDispatchStatusValidating(dispatch: MessageDispatch): Promise<MessageDispatch> {
        return await this.updateDispatchStatusFromStatus(dispatch._id, MessageDispatchStatus.VALIDATING, MessageDispatchStatus.READY);
    }

    public async addDispatchValidation(dispatch: MessageDispatch, isValid: boolean, details?: string[], force?: boolean): Promise<MessageDispatch> {
        const validation = new MessageDispatchValidation();
        validation.isValid = isValid;
        validation.details = details;
        validation.force = force;

        dispatch.validation = validation;
        dispatch.status = !isValid && !force ? MessageDispatchStatus.INVALID : MessageDispatchStatus.SCHEDULED;

        return this.updateDispatchFromStatus(dispatch, MessageDispatchStatus.VALIDATING);
    }

    public async updateDispatchValidationFromInvalid(dispatch: MessageDispatch, forced: boolean): Promise<MessageDispatch> {
        dispatch.validation.force = forced;
        dispatch.status = forced ? MessageDispatchStatus.SCHEDULED : MessageDispatchStatus.REFUSED;

        return this.updateDispatchFromStatus(dispatch, MessageDispatchStatus.INVALID);
    }

    public async getDispatchesByStatusScheduled(): Promise<MessageDispatch[]> {
        return await this.messageDao.getDispatchesByStatusScheduled(new Date());
    }

    public async updateDispatchStatusSending(dispatch: MessageDispatch): Promise<MessageDispatch> {
        return await this.updateDispatchStatusFromStatus(dispatch._id, MessageDispatchStatus.SCHEDULED, MessageDispatchStatus.SENDING);
    }

    public async updateDispatchSent(dispatch: MessageDispatch, identifier: string, error: boolean, detail?: string): Promise<MessageDispatch> {
        dispatch.sent = new Date();
        dispatch.status = error ? MessageDispatchStatus.ERROR : MessageDispatchStatus.COMPLETED;
        dispatch.identifier = identifier;
        dispatch.detail = detail;        

        return await this.updateDispatchFromStatus(dispatch, MessageDispatchStatus.SENDING);
    }

    public async rescheduleDispatch(dispatch: MessageDispatch): Promise<MessageDispatch> {
        const nextDispatch = new MessageDispatch();
        nextDispatch.message = dispatch.message;
        nextDispatch.provider = dispatch.provider;
        nextDispatch.receiver = dispatch.receiver;
        nextDispatch.parameters = dispatch.parameters;
        nextDispatch.attempt = dispatch.attempt + 1;
        nextDispatch.scheduled = null //TODO
    
        // TODO insert
        
        return await this.updateDispatchStatusCreated(dispatch);
    }


    // LOGS

    public async addLog(message: Message, text: string, isTechnical: boolean): Promise<MessageLog> {
        const log = new MessageLog();
        // log.idMessage = message._id;
        log.text = text;
        log.isTechnical = isTechnical;

        return this.messageDao.addLog(message, log);
    }

    public async addDispatchLog(dispatch: MessageDispatch, text: string, isTechnical: boolean): Promise<MessageLog> {
        const log = new MessageLog();
        // log.idMessage = dispatch.message._id;
        // log.idDispatch = dispatch._id;
        log.text = text;
        log.isTechnical = isTechnical;

        return this.messageDao.addDispatchLog(dispatch, log);
    }
}