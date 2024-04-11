import { Module } from '@nestjs/common';
import { AgioProcessScheduler } from './app.scheduler';
import { ConfigModule } from '@nestjs/config';
import { AgioDatasourceModule, AgioMessageDao, AgioMessageService, AgioProviderDao, AgioProviderService, AgioUserDao, AgioUserService, Message, MessageDispatch, MessageDispatchParameter, MessageLog, MessageReceiver, MessageTemplate, MessageText, MessageValidation, Provider, User } from 'agio-datasource';
import { AgioCheckProcessService } from './app/agio-service/check-process.service';
import { AgioSendProcessService } from './app/agio-service/send-process.service';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageDispatchParameterSchema } from 'agio-datasource/dist/agio-schema/message-dispatch-parameter.schema';
import { MessageDispatchSchema } from 'agio-datasource/dist/agio-schema/message-dispatch.schema';
import { MessageLogSchema } from 'agio-datasource/dist/agio-schema/message-log.schema';
import { MessageTemplateSchema } from 'agio-datasource/dist/agio-schema/message-template.schema';
import { MessageTextSchema } from 'agio-datasource/dist/agio-schema/message-text.schema';
import { MessageValidationSchema } from 'agio-datasource/dist/agio-schema/message-validation.schema';
import { MessageSchema } from 'agio-datasource/dist/agio-schema/message.schema';
import { ProviderSchema } from 'agio-datasource/dist/agio-schema/provider.schema';
import { MessageReceiverSchema } from 'agio-datasource/dist/agio-schema/receiver.schema';
import { UserSchema } from 'agio-datasource/dist/agio-schema/user.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),

    ScheduleModule.forRoot(),

    /** TEMP vvvvv */
    MongooseModule.forRoot(process.env.AGIO_DATA_MONGO_URL, {
      // useFindAndModify: false,
      connectionFactory: (connection) => {
        connection.plugin(require('mongoose-autopopulate'));
        return connection;
      },
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },

      { name: Provider.name, schema: ProviderSchema },

      { name: Message.name, schema: MessageSchema },
      { name: MessageTemplate.name, schema: MessageTemplateSchema },
      { name: MessageText.name, schema: MessageTextSchema },
      { name: MessageDispatch.name, schema: MessageDispatchSchema },
      { name: MessageDispatchParameter.name, schema: MessageDispatchParameterSchema },
      { name: MessageReceiver.name, schema: MessageReceiverSchema },
      { name: MessageLog.name, schema: MessageLogSchema },
      { name: MessageValidation.name, schema: MessageValidationSchema }
    ])

    //** TEMP */

    //AgioDatasourceModule
  ],
  controllers: [],
  providers: [
    /** MAIN SERVICE */
    AgioProcessScheduler,

    AgioCheckProcessService,
    AgioSendProcessService,

    AgioMessageService,
    AgioMessageDao
  ],
  exports: []
})
export class AgioProcessModule {}
