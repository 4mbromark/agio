import { Module, Provider } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, Message, MessageTemplate, MessageText, MessageDispatch, MessageDispatchParameter, MessageReceiver, MessageLog, MessageValidation } from 'agio-datasource';
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

    PassportModule,
    /* JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION },
    }) */

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
  ],
  controllers: [],
  providers: [],
  exports: []
})
export class AgioWebserviceModule {}
