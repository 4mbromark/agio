import { CheckResult, SendResult } from './app/agio-namespace/process.namespace';
import { AgioSendProcessService } from './app/agio-service/send-process.service';
import { AgioCheckProcessService } from './app/agio-service/check-process.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AgioProcessScheduler {
  private readonly logger = new Logger(AgioProcessScheduler.name);
  
  constructor(
    private readonly checkProcessService: AgioCheckProcessService,
    private readonly sendProcessService: AgioSendProcessService
  ) { }

  @Cron(CronExpression.EVERY_30_SECONDS, { name: process.env.AGIO_PROCESS_CHECK_NAME }) // process.env.AGIO_PROCESS_CHECK_CRON
  public async checkProcessScheduler(): Promise<void> {
    try {
      const resultMessages: CheckResult = await this.checkProcessService.checkMessages();
      const resultMessageDispatches: CheckResult = await this.checkProcessService.checkMessageDispatches();

      if (resultMessages.processed > 0) {
        this.logger.log('[CHECK] Validati con successo [' + resultMessages.processed + '] messaggi, di cui [' + resultMessages.error + '] errori');
      }
      if (resultMessageDispatches.processed > 0) {
        this.logger.log('[CHECK] Validati con successo [' + resultMessageDispatches.processed + '] invii, di cui [' + resultMessageDispatches.error + '] errori');
      }     
    } catch (e) {
      this.logger.error('Errore non gestito nel processo di validazione');
      this.logger.log(e);
    }
  }

  @Cron(CronExpression.EVERY_30_SECONDS, { name: process.env.AGIO_PROCESS_SEND_NAME }) // process.env.AGIO_PROCESS_SEND_CRON
  public async sendProcessScheduler(): Promise<void> {
    try {
      const result: SendResult = await this.sendProcessService.send();
    } catch (e) {
      this.logger.error('Errore non gestito nel processo di invio');
      this.logger.log(e);
    }
  }
}
