export enum MessageStatus {
    CREATED = 'CREATED',

    VALIDATING = 'VALIDATING',
    INVALID = 'INVALID',

    REFUSED = 'REFUSED',
    OK = 'OK',

    COMPLETED = 'COMPLETED'
}

export enum MessageDispatchStatus {
    READY = 'READY',

    VALIDATING = 'VALIDATING',
    INVALID = 'INVALID',

    REFUSED = 'REFUSED',
    SCHEDULED = 'SCHEDULED',

    SENDING = 'SENDING',

    COMPLETED = 'COMPLETED',
    ERROR = 'ERROR'
}