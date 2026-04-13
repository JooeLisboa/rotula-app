import { authRepository } from '@/src/repositories/auth-repository';
import type { ForgotPasswordInput, LoginInput, RegisterInput, Session } from '@/src/types/auth';

export const authService = {
  onSessionChanged: authRepository.onSessionChanged,
  login(input: LoginInput): Promise<Session> {
    return authRepository.login(input);
  },
  register(input: RegisterInput): Promise<Session> {
    return authRepository.register(input);
  },
  logout(): Promise<void> {
    return authRepository.logout();
  },
  forgotPassword(input: ForgotPasswordInput): Promise<void> {
    return authRepository.forgotPassword(input);
  },
};
