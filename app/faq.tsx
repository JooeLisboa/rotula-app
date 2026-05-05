import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';
import { useLanguage } from '@/src/hooks/use-language';

export default function FAQScreen() {
  const { t } = useLanguage();
  return <ScreenShell title={t('institutional.faqTitle')} subtitle={t('institutional.faqSubtitle')}><ThemedText>• {t('institutional.faqItem1')}</ThemedText><ThemedText>• {t('institutional.faqItem2')}</ThemedText><ThemedText>• {t('institutional.faqItem3')}</ThemedText></ScreenShell>;
}
