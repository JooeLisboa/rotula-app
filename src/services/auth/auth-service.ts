import { isMockApi } from '@/src/config/env';
import { apiClient } from '@/src/lib/api/http-client';
import type { LoginInput, RegisterInput, Session } from '@/src/types/auth';

function buildMockSession(email: string, name = 'Usuário Rótula'): Session {
  return {
    accessToken: `access-${Date.now()}`,
    refreshToken: `refresh-${Date.now()}`,
    user: {
      id: 'user-1',
      email,
      name,
    },
  };
}

export const authService = {
  async login(input: LoginInput): Promise<Session> {
    if (isMockApi) {
      if (!input.email.includes('@') || input.password.length < 4) {
        throw new Error('Credenciais inválidas.');
      }
      return buildMockSession(input.email);
    }

    return apiClient.request<Session>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  async register(input: RegisterInput): Promise<Session> {
    if (isMockApi) {
      if (!input.email.includes('@') || input.password.length < 4 || input.name.length < 2) {
        throw new Error('Dados de cadastro inválidos.');
      }
      return buildMockSession(input.email, input.name);
    }

    return apiClient.request<Session>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  async logout(): Promise<void> {
    if (isMockApi) {
      return;
    }

    await apiClient.request<void>('/auth/logout', {
      method: 'POST',
    });
  },

  async refresh(refreshToken: string): Promise<Pick<Session, 'accessToken' | 'refreshToken'>> {
    if (isMockApi) {
      return {
        accessToken: `access-${Date.now()}`,
        refreshToken,
      };
    }

    return apiClient.request<Pick<Session, 'accessToken' | 'refreshToken'>>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },
};
