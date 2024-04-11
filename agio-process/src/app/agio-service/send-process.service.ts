import { Injectable, Logger } from "@nestjs/common";
import { AgioMessageService, Message, MessageDispatch } from "agio-datasource";
import { SendReport, SendResult } from "../agio-namespace/process.namespace";

@Injectable()
export class AgioSendProcessService {
    private readonly logger = new Logger(AgioSendProcessService.name);

    constructor(
        private readonly messageService: AgioMessageService
    ) { }

    public async send(): Promise<SendResult> {
        const result = new SendResult();
        this.logger.log('[SEND-DISPATCH] Inizio');

        const dispatchList: MessageDispatch[] = await this.messageService.getDispatchesByStatusScheduled();

        if (dispatchList.length === 0) {
            this.logger.log('[SEND-DISPATCH] Non ci sono record da inviare');
        }

        for (let dispatch of dispatchList) {
            const id = dispatch._id;
            this.logger.log('[SEND-DISPATCH] Elaborazione record con ID = [' + id + ']');

            dispatch = await this.messageService.updateDispatchStatusSending(dispatch);

            if (!dispatch) { // TODO
                this.logger.warn('[SEND-DISPATCH] Record con ID = [' + id + '] elaborato da un altro processo');
                dispatchList.splice(dispatchList.indexOf(dispatch), 1);
                continue;
            }

            // SEND
            const report = new SendReport();

            dispatch = await this.messageService.updateDispatchSent(dispatch, report.identifier, report.isFailed(), report.detail);
            this.logger.log('[SEND-DISPATCH] Record con ID = [' + id + '] e IDENTIFIER = [' + report.identifier + '] ' + (report.isFailed() ? 'INVIO FALLITO' : 'INVIO RIUSCITO') + ', ' + report.detail);
            report.isFailed() ? result.addError() : result.addSuccess();

            // TODO SCHEDULE ANOTHER
        }

        this.logger.log('[SEND-DISPATCH] Fine');
        return result;
    }

    // TODO complete()
}