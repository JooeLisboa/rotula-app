import { featureFlags } from '@/src/config/feature-flags';

export enum EventName {
  AppOpened = 'app_opened',
  OnboardingStarted = 'onboarding_started',
  OnboardingCompleted = 'onboarding_completed',
  LoginStarted = 'login_started',
  LoginSuccess = 'login_success',
  RegisterStarted = 'register_started',
  ProductSearchStarted = 'product_search_started',
  ProductScanned = 'product_scanned',
  ProductViewed = 'product_viewed',
  FavoriteAdded = 'favorite_added',
  PasswordResetRequested = 'password_reset_requested',
  LanguageChanged = 'language_changed',
  CtaClicked = 'cta_clicked',
}

export function trackEvent(eventName: EventName, params?: Record<string, unknown>) {
  if (!featureFlags.enableAnalyticsEvents) return;
  if (__DEV__) {
    console.log(`[analytics] ${eventName}`, params ?? {});
  }
}
