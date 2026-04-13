import { env } from '@/src/config/env';
import type { ApiErrorPayload } from '@/src/types/api';

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(status: number, payload: ApiErrorPayload) {
    super(payload.message);
    this.status = status;
    this.code = payload.code;
    this.name = 'ApiError';
  }
}

export type TokenProvider = () => string | null;

class HttpClient {
  private tokenProvider: TokenProvider = () => null;

  setTokenProvider(provider: TokenProvider) {
    this.tokenProvider = provider;
  }

  async request<T>(path: string, init?: RequestInit): Promise<T> {
    const token = this.tokenProvider();
    const response = await fetch(`${env.apiBaseUrl}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init?.headers ?? {}),
      },
    });

    if (!response.ok) {
      let payload: ApiErrorPayload = { message: 'Erro inesperado ao processar requisição.' };

      try {
        payload = (await response.json()) as ApiErrorPayload;
      } catch {
        // noop
      }

      throw new ApiError(response.status, payload);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  }
}

export const apiClient = new HttpClient();
