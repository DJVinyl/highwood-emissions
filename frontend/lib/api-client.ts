import { Site, CreateMeasurement, SiteMetrics, SiteType, Coordinate } from '@highwood/shared';

import { ApiResponse } from '../types/types';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  }
  return process.env.API_URL || 'http://backend:3000';
};

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || {
            code: `HTTP_${response.status}`,
            message: data.message || 'An error occurred',
          },
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Network request failed',
        },
      };
    }
  }

  async createSite(siteData: {
    name: string;
    emissionLimit: number;
    totalEmissionsToDate: number;
    siteType: SiteType;
    coordinates: Coordinate;
  }): Promise<ApiResponse<Site>> {
    return this.request('/v1/sites', {
      method: 'POST',
      body: JSON.stringify(siteData),
    });
  }

  async ingestReadings(data: CreateMeasurement[]): Promise<ApiResponse<boolean>> {
    return this.request('/v1/ingest', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSiteMetrics(siteId: string): Promise<ApiResponse<SiteMetrics>> {
    return this.request(`/v1/sites/${siteId}/metrics`);
  }

  async getAllSites(): Promise<ApiResponse<Site[]>> {
    return this.request('/v1/sites');
  }
}

export const apiClient = new ApiClient(getBaseUrl());
