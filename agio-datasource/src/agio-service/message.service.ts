import { MessageLog } from './../agio-schema/message-log.schema';
import { MessageValidation } from './../agio-schema/message-validation.schema';
import { MessageDispatch } from './../agio-schema/message-dispatch.schema';
import { ObjectId } from 'mongoose';
import { Message } from './../agio-schema/message.schema';
import { Injectable } from "@nestjs/common";
import { AgioDatabaseBaseService } from "../agio-common/base.service";
import { AgioMessageDao } from '../agio-dao/message.dao';
import { MessageDispatchStatus, MessageStatus } from '../agio-namespace/message.namespace';

@Injectable()
export class AgioMessageService extends AgioDatabaseBaseService<Message> {

    constructor(
        protected readonly messageDao: AgioMessageDao
    ) {
        super(messageDao);
    }

    public async getByStatusCreated(): Promise<Message[]> {
        return await this.messageDao.getByStatusCreated();
    }

    public async insert(message: Message): Promise<Message> { 
        return await this.messageDao.insert(message);
    }


    // STATUSES

    public async updateStatusCreated(message: Message): Promise<Message> {
        return await this.messageDao.updateStatusCreated(message);
    }

    public async updateStatusValidating(message: Message): Promise<Message> {
        return await this.messageDao.updateStatusValidating(message);
    }

    public async updateStatusCompleted(message: Message): Promise<Message> {
        return await this.messageDao.updateStatusFromStatus(message, MessageStatus.COMPLETED, MessageStatus.OK);
    }


    // VALIDATION

    public async addValidation(message: Message, isValid: boolean, details?: string[], force?: boolean): Promise<Message> {
        let validation = new MessageValidation();
        validation.isValid = isValid;
        validation.details = details;
        validation.force = force;

        validation = await this.messageDao.insertValidation(validation);
        
        message = await this.messageDao.addValidation(message, validation);

        const status = validation.isValid ? MessageStatus.OK : MessageStatus.INVALID;
        return this.messageDao.updateStatusFromStatus(message, status, MessageStatus.VALIDATING);
    }

    public async updateValidationFromInvalid(message: Message, forced: boolean): Promise<Message> {
        await this.messageDao.forceValidation(message.validation, forced);

        const status = forced ? MessageStatus.OK : MessageStatus.REFUSED;
        return this.messageDao.updateStatusFromStatus(message, status, MessageStatus.INVALID);
    }


    // DISPATCH

    public async getDispatchesByStatusReady(): Promise<MessageDispatch[]> {
        return await this.messageDao.getDispatchesByStatusReady();
    }

    public async insertDispatch(dispatch: MessageDispatch): Promise<MessageDispatch> { 
        return await this.messageDao.insertDispatch(dispatch);
    }

    public async updateDispatchStatusReady(dispatch: MessageDispatch): Promise<MessageDispatch> {
        return await this.messageDao.updateDispatchStatusReady(dispatch);
    }

    public async updateDispatchStatusValidating(dispatch: MessageDispatch): Promise<MessageDispatch> {
        return await this.messageDao.updateDispatchStatusFromStatus(dispatch, MessageDispatchStatus.VALIDATING, MessageDispatchStatus.READY);
    }

    public async addDispatchValidation(dispatch: MessageDispatch, isValid: boolean, details?: string[], force?: boolean): Promise<MessageDispatch> {
        let validation = new MessageValidation();
        validation.isValid = isValid;
        validation.details = details;
        validation.force = force;   

        validation = await this.messageDao.insertValidation(validation);
        
        dispatch = await this.messageDao.addDispatchValidation(dispatch, validation);

        const status = validation.isValid ? MessageDispatchStatus.SCHEDULED : MessageDispatchStatus.INVALID;
        return this.messageDao.updateDispatchStatusFromStatus(dispatch, status, MessageDispatchStatus.VALIDATING);
    }

    public async updateDispatchValidationFromInvalid(dispatch: MessageDispatch, forced: boolean): Promise<MessageDispatch> {
        await this.messageDao.forceValidation(dispatch.validation, forced);

        const status = forced ? MessageDispatchStatus.SCHEDULED : MessageDispatchStatus.REFUSED;
        return this.messageDao.updateDispatchStatusFromStatus(dispatch, status, MessageDispatchStatus.INVALID);
    }

    public async getDispatchesByStatusScheduled(): Promise<MessageDispatch[]> {
        return await this.messageDao.getDispatchesByStatusScheduled(new Date());
    }

    public async updateDispatchStatusSending(dispatch: MessageDispatch): Promise<MessageDispatch> {
        return await this.messageDao.updateDispatchStatusFromStatus(dispatch, MessageDispatchStatus.SCHEDULED, MessageDispatchStatus.SENDING);
    }

    public async updateDispatchSent(dispatch: MessageDispatch, identifier: string, error: boolean, detail?: string): Promise<MessageDispatch> {
        dispatch.sent = new Date();
        dispatch.status = error ? MessageDispatchStatus.ERROR : MessageDispatchStatus.COMPLETED;
        dispatch.identifier = identifier;
        dispatch.detail = detail;        

        return await this.messageDao.updateDispatchFromStatus(dispatch, MessageDispatchStatus.SENDING);
    }

    /* public async rescheduleDispatch(dispatch: MessageDispatch): Promise<MessageDispatch> {
        const nextDispatch = new MessageDispatch();
        nextDispatch.message = dispatch.message;
        nextDispatch.provider = dispatch.provider;
        nextDispatch.receiver = dispatch.receiver;
        nextDispatch.parameters = dispatch.parameters;
        nextDispatch.attempt = dispatch.attempt + 1;
        nextDispatch.scheduled = null //TODO
    
        // TODO insert
        
        // return await this.updateDispatchStatusCreated(dispatch);
    } */


    // LOGS

    public async addLog(message: Message, text: string, isTechnical: boolean): Promise<MessageLog> {
        let log = new MessageLog();
        log.text = text;
        log.isTechnical = isTechnical;

        log = await this.messageDao.insertLog(log);
        return this.messageDao.addLog(message, log);
    }

    public async addDispatchLog(dispatch: MessageDispatch, text: string, isTechnical: boolean): Promise<MessageLog> {
        let log = new MessageLog();
        log.text = text;
        log.isTechnical = isTechnical;

        log = await this.messageDao.insertLog(log);
        return this.messageDao.addDispatchLog(dispatch, log);
    }
}