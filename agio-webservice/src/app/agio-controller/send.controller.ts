import { SendMessageRequest } from './../agio-namespace/request.namespace';
import { Body, Controller, HttpException, HttpStatus, Logger, Post, RequestMapping, Res } from "@nestjs/common";
import { AgioSendControllerService } from "../agio-service/send-controller.service";
import { Response } from 'express';

@Controller('/send')
export class AgioSendController {
    private readonly logger = new Logger(AgioSendController.name);

    constructor(
        private readonly controllerService: AgioSendControllerService
    ) { }

    @Post('/')
    public async send(
        @Body() body: SendMessageRequest,
        @Res() res: Response
    ) {
        try {
            this.logger.log('[SEND-WEBSERVICE] Nuova richiesta');

            await this.controllerService.insertMessage(body);        
            res.status(HttpStatus.OK).send();
            this.logger.error('[SEND-WEBSERVICE] Risposta inviata');
        } catch (e) {
            if (e instanceof HttpException) {
                this.logger.warn('[SEND-WEBSERVICE] Problema rilevato');
                throw e;
            }
            this.logger.error('[SEND-WEBSERVICE] Errore non gestito');
            this.logger.log(e);
            res.status(HttpStatus.OK).send();
            this.logger.error('[SEND-WEBSERVICE] Risposta di errore inviata');
        }
    }
}