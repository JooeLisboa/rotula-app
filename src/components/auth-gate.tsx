import { useAuth } from '@/src/hooks/use-auth';
import { EventName, trackEvent } from '@/src/analytics/events';
import { usePathname, useRouter, useSegments } from 'expo-router';
import { useEffect, useRef } from 'react';

const PUBLIC_GROUPS = new Set(['(auth)', '(onboarding)']);

export function AuthGate() {
  const { isAuthenticated, isInitializing } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const pathname = usePathname();
  const previousPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (isInitializing) {
      return;
    }

    const first = segments[0] as string | undefined;
    const inPublicArea = first ? PUBLIC_GROUPS.has(first) : true;

    if (!isAuthenticated && !inPublicArea) {
      if (previousPathRef.current !== '/(onboarding)') {
        trackEvent(EventName.AuthGuardRedirect, { area: 'onboarding' });
      }
      previousPathRef.current = '/(onboarding)';
      router.replace('/(onboarding)');
      return;
    }

    if (isAuthenticated && inPublicArea) {
      if (previousPathRef.current !== '/(tabs)') {
        trackEvent(EventName.AuthGuardRedirect, { area: 'tabs' });
      }
      previousPathRef.current = '/(tabs)';
      router.replace('/(tabs)');
      return;
    }

    previousPathRef.current = pathname;
  }, [isAuthenticated, isInitializing, pathname, router, segments]);

  return null;
}
