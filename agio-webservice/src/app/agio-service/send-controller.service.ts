import { SendMessageResponse, SendMessageWarning } from './../agio-namespace/response.namespace';
import { SendMessageRequest } from './../agio-namespace/request.namespace';
import { Injectable, Logger } from "@nestjs/common";
import { AgioMessageService, Message, MessageDispatch, MessageDispatchParameter } from 'agio-datasource';

@Injectable()
export class AgioSendControllerService {
    private readonly logger = new Logger(AgioSendControllerService.name);

    constructor(
        private readonly messageService: AgioMessageService
    ) { }

    public async insertMessage(request: SendMessageRequest) {
        const response: SendMessageResponse = new SendMessageResponse();
        response.id = request.id;

        let message: Message = new Message();

        if (request.message && request.templateName) {
            response.warnings.push(SendMessageWarning.MULTIPLE_MESSAGE);
        }

        // TODO TEXT MESSAGE e TEMPLATES

        message = await this.messageService.insert(message);

        // TODO GROUP RECEIVERS
        for (let receiver of request.receivers) {
            let dispatch: MessageDispatch = new MessageDispatch();
            dispatch.message = message;
            dispatch.scheduled = receiver.schedule || request.schedule;

            const parameters: MessageDispatchParameter[] = [];
            for (let receiverParameter of receiver.parameters) {
                const parameter: MessageDispatchParameter = new MessageDispatchParameter();
                parameter.key = receiverParameter.key;
                parameter.value = receiverParameter.value;

                parameters.push(parameter);
            }
            dispatch.parameters = parameters;

            dispatch.provider = null; // TODO

            dispatch.receiver = null // TODO

            dispatch = await this.messageService.insertDispatch(dispatch);
        }

        message = await this.messageService.updateStatusCreated(message);

        response.success = true;
        return response;
    }
}