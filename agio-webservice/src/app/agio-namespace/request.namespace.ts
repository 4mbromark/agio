import { IsNotEmpty, IsBoolean, IsDate, IsNumber, MaxLength } from 'class-validator';

export class AbstractMessageRequest {
    @IsNotEmpty()
    @MaxLength(100)
    id: string;
    @IsNotEmpty()
    @MaxLength(50)
    providerName: string;
    @IsDate()
    schedule?: Date;
    @IsBoolean()
    forceValidation?: boolean;
    @IsNumber()
    maxAttempts?: number;

    receivers?: ReceiverDetail[];
    receiverGroups?: string[];
}

export class SendMessageRequest extends AbstractMessageRequest {
    @IsNotEmpty()
    message: AbstractMessage;
    @IsNotEmpty()
    @MaxLength(50)
    templateName: string;
}

/* export class SendWithTemplateRequest extends AbstractMessageRequest {
    @IsNotEmpty()
    @MaxLength(50)
    templateName: string;
    receivers?: ReceiverDetail[];
    receiverGroups?: string[];
} */

/* export class SendSimpleMessageRequest extends AbstractMessageRequest {
    @IsNotEmpty()
    message: Message;
    @IsNotEmpty()
    receiver: string;
} */

export abstract class AbstractMessage {
    @IsNotEmpty()
    body: string;
}

export class MailMessage extends AbstractMessage {
    object: string;
}

export class TelegramMessage extends AbstractMessage {
}

export class SmsMessage extends AbstractMessage {
}

export class ReceiverDetail {
    receiver: AbstractReceiver
    parameters: Parameter[];
    @IsDate()
    schedule?: Date;
}

export class Parameter {
    @IsNotEmpty()
    @MaxLength(30)
    key: string;
    @IsNotEmpty()
    @MaxLength(100) 
    value: string;
}

export abstract class AbstractReceiver {

}

export class MailReceiver extends AbstractReceiver {
    @IsNotEmpty()
    @MaxLength(100)
    address: string;
    @IsNotEmpty()
    cc: string[];
    @IsNotEmpty()
    ccn: string[];
}

export class TelegramReceiver extends AbstractReceiver {
    @IsNotEmpty()
    @MaxLength(100)
    id: string;
}

export class SmsReceiver extends AbstractReceiver {
    @IsNotEmpty()
    @MaxLength(100)
    number: string;
}
