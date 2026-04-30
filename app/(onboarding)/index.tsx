import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';
import { CommercialCTA } from '@/src/components/commercial-cta';
import { LanguageSwitcher } from '@/src/components/language-switcher';
import { Palette, radius, spacing } from '@/constants/theme';
import { EventName, trackEvent } from '@/src/analytics/events';
import { useLanguage } from '@/src/hooks/use-language';

function FeatureItem({ icon, title, description }: { icon: React.ComponentProps<typeof MaterialCommunityIcons>['name']; title: string; description: string }) {
  return <View style={styles.featureRow}><View style={styles.iconBadge}><MaterialCommunityIcons name={icon} size={22} color={Palette.primary} /></View><View style={styles.featureText}><ThemedText type="defaultSemiBold">{title}</ThemedText><ThemedText type="caption">{description}</ThemedText></View></View>;
}

export default function OnboardingScreen() {
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => { trackEvent(EventName.OnboardingStarted); }, []);

  return (
    <ScreenShell title={t('onboarding.title')} subtitle={t('onboarding.subtitle')}>
      <LanguageSwitcher />
      <View style={styles.container}>
        <View style={styles.featuresContainer}>
          <FeatureItem icon="barcode-scan" title={t('onboarding.benefit1Title')} description={t('onboarding.benefit1Desc')} />
          <FeatureItem icon="shield-check" title={t('onboarding.benefit2Title')} description={t('onboarding.benefit2Desc')} />
          <FeatureItem icon="history" title={t('onboarding.benefit3Title')} description={t('onboarding.benefit3Desc')} />
        </View>
        <ThemedText type="caption">{t('onboarding.trust')}</ThemedText>
        <CommercialCTA title={t('cta.premiumTitle')} description={t('cta.premiumDescription')} buttonLabel={t('onboarding.cta')} onPress={() => { trackEvent(EventName.OnboardingCompleted); router.push('/(auth)/login'); }} />
      </View>
    </ScreenShell>
  );
}
const styles = StyleSheet.create({ container: { gap: spacing.md, paddingVertical: spacing.lg }, featuresContainer: { gap: spacing.lg }, featureRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md }, iconBadge: { width: 48, height: 48, borderRadius: radius.md, backgroundColor: Palette.surfaceAlt, borderWidth: 1, borderColor: Palette.border, alignItems: 'center', justifyContent: 'center' }, featureText: { flex: 1 } });
