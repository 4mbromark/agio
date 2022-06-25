import { ValidationReport } from './../agio-namespace/process.namespace';
import { Injectable, Logger } from "@nestjs/common";
import { AgioMessageService, Message, MessageDispatch } from "agio-datasource";
import { CheckResult } from "../agio-namespace/process.namespace";

@Injectable()
export class AgioCheckProcessService {
    private readonly logger = new Logger(AgioCheckProcessService.name);

    constructor(
        private readonly messageService: AgioMessageService
    ) { }

    public async checkMessages(): Promise<CheckResult> {
        const result = new CheckResult();
        this.logger.log('[CHECK-MESSAGE] Inizio');

        const messageList: Message[] = await this.messageService.getByStatusCreated();

        if (messageList.length === 0) {
            this.logger.log('[CHECK-MESSAGE] Non ci sono record da validare');
        }

        for (let message of messageList) {
            const id = message._id;
            this.logger.log('[CHECK-MESSAGE] Elaborazione record con ID = [{}]', id);

            message = await this.messageService.updateStatusValidating(message);

            console.log('precheck');
            console.log(message);

            if (!message) { // TODO
                this.logger.log('[CHECK-MESSAGE] Record con ID = [{}] elaborato da un altro processo' + id);
                messageList.splice(messageList.indexOf(message), 1);
                continue;
            }

            const force = false;
            const validation = this.validateMessage(message);

            console.log('adding validation');

            message = await this.messageService.addValidation(message, validation.isValid(), validation.errors, force);
            this.logger.log('[CHECK-MESSAGE] Record con ID = [{}] {}, FORCE = [{}]', id, validation.isValid() ? 'VALIDO' : 'NON VALIDO', force);
            validation.isValid() ? result.addSuccess() : result.addError();
        }

        this.logger.log('[CHECK-MESSAGE] Fine');
        return result;
    }

    private validateMessage(message: Message): ValidationReport {
        const report = new ValidationReport();

        console.log(1);

        if (!message.text) {
            console.log(2);
            report.addError('Messaggio mancante');
            console.log(3);
        } else {
            console.log(4);
            if (!message.text.object || message.text.object.trim() === '') {
                console.log(5);
                report.addError('Oggetto del messaggio vuoto o nullo');
                console.log(6);
            }
            if (!message.text.body || message.text.body.trim() === '') {
                console.log(7);
                report.addError('Corpo del messaggio vuoto o nullo');
                console.log(8);
            }
        }

        // if (message.dispatches.length === 0) {
        //    report.addError('Nessun invio programmato per il messaggio');
        // }
        console.log(9);
        return report;
    }

    public async checkMessageDispatches(): Promise<CheckResult> {
        const result = new CheckResult();
        this.logger.log('[CHECK-DISPATCH] Inizio');

        const dispatchList: MessageDispatch[] = await this.messageService.getDispatchesByStatusReady();

        if (dispatchList.length === 0) {
            this.logger.log('[CHECK-DISPATCH] Non ci sono record da validare');
        }

        for (let dispatch of dispatchList) {
            const id = dispatch._id;
            this.logger.log('[CHECK-DISPATCH] Elaborazione record con ID = [{}]', id);

            dispatch = await this.messageService.updateDispatchStatusValidating(dispatch);

            if (!dispatch) { // TODO
                this.logger.log('[CHECK-DISPATCH] Record con ID = [{}] elaborato da un altro processo' + id);
                dispatchList.splice(dispatchList.indexOf(dispatch), 1);
                continue;
            }

            const force = false;
            const validation = this.validateMessageDispatch(dispatch);

            dispatch = await this.messageService.addDispatchValidation(dispatch, validation.isValid(), validation.errors, force);
            this.logger.log('[CHECK-DISPATCH] Record con ID = [{}] {}, FORCE = [{}]', id, validation.isValid() ? 'VALIDO' : 'NON VALIDO', force);
            validation.isValid() ? result.addSuccess() : result.addError();
        }

        this.logger.log('[CHECK-DISPATCH] Fine');
        return result;
    }

    private validateMessageDispatch(dispatch: MessageDispatch): ValidationReport {
        const report = new ValidationReport();

        if (!dispatch.receiver) {

        } else {
            if (!dispatch.receiver.address || dispatch.receiver.address.trim() === '') {

            }
            //TODO REGEX receiver
        }

        // TODO count parameters

        return report;
    }
}