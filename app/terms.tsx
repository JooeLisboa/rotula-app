import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';
import { useLanguage } from '@/src/hooks/use-language';

export default function TermsScreen() { const { t } = useLanguage(); return <ScreenShell title={t('institutional.termsTitle')} subtitle="Condições de uso"><ThemedText>Uso destinado a apoio de leitura de rótulos.</ThemedText><ThemedText>Não fornecemos diagnóstico médico.</ThemedText><ThemedText>TODO: substituir por termo jurídico final antes de produção.</ThemedText></ScreenShell>; }
