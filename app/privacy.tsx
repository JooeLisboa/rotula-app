import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';
import { useLanguage } from '@/src/hooks/use-language';

export default function PrivacyScreen() {
  const { t } = useLanguage();
  return <ScreenShell title={t('institutional.privacyTitle')} subtitle={t('institutional.privacySubtitle')}><ThemedText>{t('institutional.privacyLine1')}</ThemedText><ThemedText>{t('institutional.privacyLine2')}</ThemedText></ScreenShell>;
}
