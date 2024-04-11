export class SendMessageResponse {
    id: string;
    warnings: SendMessageWarning[];
    success: boolean;
}

export enum SendMessageWarning {
    MULTIPLE_MESSAGE = "Per il messaggio è stato indicato sia il testo che il template. Verrà utilizzato il testo."
}