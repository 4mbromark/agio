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
            this.logger.log('[CHECK-MESSAGE] Elaborazione record con ID = [' + id + ']');

            message = await this.messageService.updateStatusValidating(message);

            if (!message) {
                this.logger.warn('[CHECK-MESSAGE] Record con ID = [' + id + '] elaborato da un altro processo');
                messageList.splice(messageList.indexOf(message), 1);
                continue;
            }

            const force = false;
            const validation = this.validateMessage(message);

            message = await this.messageService.addValidation(message, validation.isValid(), validation.errors, force);
            this.logger.log('[CHECK-MESSAGE] Record con ID = [' + id + '] ' + (validation.isValid() ? 'VALIDO' : 'NON VALIDO') + ', FORCE = [' + force + ']');
            validation.isValid() ? result.addSuccess() : result.addError();
        }

        this.logger.log('[CHECK-MESSAGE] Fine');
        return result;
    }

    private validateMessage(message: Message): ValidationReport {
        const report = new ValidationReport();

        if (!message.text) {
            report.addError('Messaggio mancante');
        } else {
            if (!message.text.object || message.text.object.trim() === '') {
                report.addError('Oggetto del messaggio vuoto o nullo');
            }
            if (!message.text.body || message.text.body.trim() === '') {
                report.addError('Corpo del messaggio vuoto o nullo');
            }
        }

        // if (message.dispatches.length === 0) {
        //    report.addError('Nessun invio programmato per il messaggio');
        // }
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
            this.logger.log('[CHECK-DISPATCH] Elaborazione record con ID = [' + id + ']');

            dispatch = await this.messageService.updateDispatchStatusValidating(dispatch);

            if (!dispatch) {
                this.logger.warn('[CHECK-DISPATCH] Record con ID = [' + id + '] elaborato da un altro processo');
                dispatchList.splice(dispatchList.indexOf(dispatch), 1);
                continue;
            }

            const force = false;
            const validation = this.validateMessageDispatch(dispatch);

            dispatch = await this.messageService.addDispatchValidation(dispatch, validation.isValid(), validation.errors, force);
            this.logger.log('[CHECK-DISPATCH] Record con ID = [' + id + '] ' + (validation.isValid() ? 'VALIDO' : 'NON VALIDO') + ', FORCE = [' + force + ']');
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