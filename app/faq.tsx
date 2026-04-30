import { ScreenShell } from '@/components/screen-shell';
import { ThemedText } from '@/components/themed-text';
import { useLanguage } from '@/src/hooks/use-language';

export default function FAQScreen() { const { t } = useLanguage(); return <ScreenShell title={t('institutional.faqTitle')} subtitle="Dúvidas comuns"><ThemedText>• Como o score é calculado? Pela composição e grau de processamento.</ThemedText><ThemedText>• O app substitui profissional de saúde? Não.</ThemedText><ThemedText>• Posso salvar favoritos? Sim, com conta ativa.</ThemedText></ScreenShell>; }
