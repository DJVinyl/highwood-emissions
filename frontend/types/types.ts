import { CreateMeasurement } from '@highwood/shared';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export type PendingReadings = {
  id: string;
  siteId: string;
  readings: CreateMeasurement[];
  createdAt: Date;
  retryCount: number;
  lastRetryAt?: Date;
};
