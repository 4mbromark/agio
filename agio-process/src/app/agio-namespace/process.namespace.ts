export abstract class Result {
    processed: number = 0;

    success: number = 0;
    error: number = 0;
    exception: number = 0

    public addSuccess(): void {
        this.processed++;
        this.success++;
    }

    public addError(): void {
        this.processed++;
        this.error++;
    }

    public addException(): void {
        this.processed++;
        this.exception++;
    }
}

export class CheckResult extends Result {
}

export class SendResult extends Result {
}

export class ValidationReport {
    errors: string[] = [];

    public addError(error: string): void {
        this.errors.push(error);
    }

    public isValid(): boolean {
        return this.errors.length === 0;
    }
}

export class SendReport {
    identifier: string;
    detail: string;
    error: boolean;

    public isFailed(): boolean {
        return this.error;
    }
}