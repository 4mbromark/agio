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

  @Cron(CronExpression.EVERY_30_SECONDS, { name: process.env.AGIO_PROCESS_CHECK_NAME })
  public async checkProcessScheduler(): Promise<void> {
    try {
      const resultMessages: CheckResult = await this.checkProcessService.checkMessages();
      const resultMessageDispatches: CheckResult = await this.checkProcessService.checkMessageDispatches();

      if (resultMessages.processed > 0) {
        this.logger.log('[CHECK] Validati con successo [$s] messaggi, di cui [%s] errori', resultMessages.processed, resultMessages.error);
      }
      if (resultMessageDispatches.processed > 0) {
        this.logger.log('[CHECK] Validati con successo [%s] invii, di cui [%s] errori', resultMessageDispatches.processed, resultMessageDispatches.error);
      }     
    } catch (e) {

    }
  }

  @Cron(CronExpression.EVERY_30_SECONDS, { name: process.env.AGIO_PROCESS_SEND_NAME })
  public async sendProcessScheduler(): Promise<void> {
    try {
      const result: SendResult = await this.sendProcessService.send();
    } catch (e) {

    }
  }
}
