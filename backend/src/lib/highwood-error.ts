export enum ErrorCode {
  REQUEST_FAILED = 'REQUEST_FAILED',
  DATA_VALIDATION = 'DATA_VALIDATION',
  DATABASE_ERROR = 'DATABASE_ERROR',
  UNKNOWN = 'UNKNOWN',
}

export const errorCodeToHTTPStatusCode: Record<ErrorCode, number> = {
  [ErrorCode.REQUEST_FAILED]: 400,
  [ErrorCode.DATA_VALIDATION]: 400,
  [ErrorCode.DATABASE_ERROR]: 500,
  [ErrorCode.UNKNOWN]: 500,
};

export class HighwoodError extends Error {
  readonly errorCode: ErrorCode;
  readonly name: string;
  readonly statusCode: number;

  constructor(errorCode: ErrorCode, message: string, originalError?: Error) {
    super(message);
    this.errorCode = errorCode;
    this.name = 'HighwoodError';
    this.statusCode = errorCodeToHTTPStatusCode[errorCode];

    if (originalError) {
      this.stack = originalError.stack;
    }
  }
}
