import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';
import { useLanguage } from '@/src/hooks/use-language';

export default function TermsScreen() {
  const { t } = useLanguage();
  return <ScreenShell title={t('institutional.termsTitle')} subtitle={t('institutional.termsSubtitle')}><ThemedText>{t('institutional.termsLine1')}</ThemedText><ThemedText>{t('institutional.termsLine2')}</ThemedText></ScreenShell>;
}
