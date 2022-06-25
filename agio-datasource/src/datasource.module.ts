import { MessageText, MessageTextSchema } from './agio-schema/message-text.schema';
import { MessageTemplate, MessageTemplateSchema } from './agio-schema/message-template.schema';
import { AgioUserDao } from './agio-dao/user.dao';
import { AgioUserService } from './agio-service/user.service';
import { Provider, ProviderSchema } from './agio-schema/provider.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './agio-schema/user.schema';
import { Message, MessageSchema } from './agio-schema/message.schema';
import { AgioMessageDao } from './agio-dao/message.dao';
import { AgioProviderDao } from './agio-dao/provider.dao';
import { AgioMessageService } from './agio-service/message.service';
import { AgioProviderService } from './agio-service/provider.service';
import { MessageDispatchValidation, MessageDispatchValidationSchema } from './agio-schema/message-dispatch-validation.schema';
import { MessageDispatch, MessageDispatchSchema } from './agio-schema/message-dispatch.schema';
import { MessageLog, MessageLogSchema } from './agio-schema/message-log.schema';
import { MessageValidation, MessageValidationSchema } from './agio-schema/message-validation.schema';
import { MessageReceiver, MessageReceiverSchema } from './agio-schema/receiver.schema';
import { MessageDispatchParameter, MessageDispatchParameterSchema } from './agio-schema/message-dispatch-parameter.schema';

@Module({
  imports: [
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
      { name: MessageValidation.name, schema: MessageValidationSchema },
      { name: MessageDispatchValidation.name, schema: MessageDispatchValidationSchema }
    ])
  ],
  controllers: [],
  providers: [
    /** DATABASE SERVICES + DAO */
    AgioUserService, AgioUserDao,
    AgioProviderService, AgioProviderDao,
    AgioMessageService, AgioMessageDao
  ],
  exports: [
    /** EXPORTS ONLY SERVICES */
    AgioUserService,
    AgioProviderService,
    AgioMessageService
  ]
})
export class AgioDatasourceModule {}
