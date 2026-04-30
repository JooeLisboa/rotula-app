import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';
import { useLanguage } from '@/src/hooks/use-language';

export default function ContactScreen() { const { t } = useLanguage(); return <ScreenShell title={t('institutional.contactTitle')} subtitle="Fale com nosso time"><ThemedText>{t('institutional.contactEmail')}</ThemedText><ThemedText>{t('institutional.contactWhatsapp')}</ThemedText></ScreenShell>; }
