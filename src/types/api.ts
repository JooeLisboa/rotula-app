export interface ApiErrorPayload {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}
