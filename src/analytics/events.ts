import { featureFlags } from '@/src/config/feature-flags';

export enum EventName {
  AppOpened = 'app_opened',
  OnboardingStarted = 'onboarding_started',
  OnboardingCompleted = 'onboarding_completed',
  AuthGuardRedirect = 'auth_guard_redirect',
  LoginStarted = 'login_started',
  LoginSuccess = 'login_success',
  LoginFailure = 'login_failure',
  RegisterStarted = 'register_started',
  RegisterSuccess = 'register_success',
  RegisterFailure = 'register_failure',
  PasswordResetRequested = 'password_reset_requested',
  PasswordResetFailure = 'password_reset_failure',
  ProductSearchStarted = 'product_search_started',
  ProductSearchCompleted = 'product_search_completed',
  ProductSearchFailure = 'product_search_failure',
  ProductScanned = 'product_scanned',
  ProductLoaded = 'product_loaded',
  ProductNotFound = 'product_not_found',
  FavoriteAdded = 'favorite_added',
  FavoriteRemoved = 'favorite_removed',
  LanguageChanged = 'language_changed',
  CtaClicked = 'cta_clicked',
}

export function trackEvent(eventName: EventName, params?: Record<string, unknown>) {
  try {
    if (!featureFlags.enableAnalyticsEvents) return;
    if (__DEV__) console.log(`[analytics] ${eventName}`, params ?? {});
  } catch {
    // never break UX on analytics failures
  }
}
