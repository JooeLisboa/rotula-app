import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';
import { useLanguage } from '@/src/hooks/use-language';

export default function PrivacyScreen() { const { t } = useLanguage(); return <ScreenShell title={t('institutional.privacyTitle')} subtitle="Como tratamos seus dados"><ThemedText>Coletamos apenas os dados necessários para autenticação e funcionamento do app.</ThemedText><ThemedText>TODO: substituir por política jurídica final antes de produção.</ThemedText></ScreenShell>; }
