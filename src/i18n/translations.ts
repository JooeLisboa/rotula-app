import type { Translations } from '@/src/i18n/types';

export const translations: Translations = {
  pt: {
    'common.loading':'Carregando...','common.back':'Voltar','common.save':'Salvar','common.cancel':'Cancelar','common.search':'Buscar','common.scanNow':'Escanear agora','common.analyzeProduct':'Analisar produto','common.understandProduct':'Entender este produto','common.error':'Erro','common.tryAgain':'Tentar novamente','common.or':'ou',
    'tab.home':'Início','tab.search':'Buscar','tab.favorites':'Favoritos','tab.history':'Histórico','tab.profile':'Perfil',
    'onboarding.title':'Decisões inteligentes na palma da mão','onboarding.subtitle':'Escaneie rótulos, compare opções e compre com mais segurança.','onboarding.benefit1Title':'Leitura instantânea','onboarding.benefit1Desc':'Aponte a câmera e receba uma análise rápida.','onboarding.benefit2Title':'Metodologia clara','onboarding.benefit2Desc':'Score transparente de 0 a 100 com critérios objetivos.','onboarding.benefit3Title':'Histórico estratégico','onboarding.benefit3Desc':'Salve, compare e evolua suas escolhas.','onboarding.cta':'Começar minha análise','onboarding.trust':'Aviso: o app auxilia decisões e não substitui orientação profissional.',
    'auth.loginTitle':'Bem-vindo de volta','auth.loginSubtitle':'Entre para continuar suas análises e recomendações.','auth.email':'E-mail','auth.password':'Senha','auth.login':'Entrar e continuar','auth.loggingIn':'Entrando...','auth.createAccount':'Criar conta grátis','auth.registerTitle':'Criar conta','auth.registerSubtitle':'Comece grátis e tenha mais clareza nas suas compras.','auth.name':'Nome','auth.register':'Criar minha conta','auth.registering':'Criando conta...','auth.forgotPassword':'Esqueci minha senha','auth.forgotTitle':'Recuperar senha','auth.forgotSubtitle':'Enviaremos um link seguro para redefinição.','auth.sendReset':'Enviar link de recuperação','auth.sendingReset':'Enviando...','auth.resetSent':'Se o e-mail existir, enviamos o link de recuperação.','auth.emptyEmail':'Informe seu e-mail para continuar.','auth.emptyPassword':'Informe sua senha para continuar.','auth.invalidEmail':'Informe um e-mail válido.','auth.weakPassword':'A senha deve ter pelo menos 6 caracteres.','auth.emptyName':'Informe seu nome para continuar.',
    'home.title':'Olá! Vamos escolher melhor hoje?','home.subtitle':'Compare produtos em segundos e compre com confiança.','home.manualSearch':'Busca inteligente','home.featured':'Produto em destaque','home.quickAccess':'Acesso rápido','home.methodology':'Metodologia: score baseado em ingredientes, processamento e composição nutricional.','home.socialProof':'Mais clareza para decisões do dia a dia.','home.favorites':'Favoritos','home.history':'Histórico','home.faq':'FAQ',
    'search.title':'Busca inteligente','search.subtitle':'Digite o nome e descubra alternativas mais claras.','search.placeholder':'Ex.: granola sem açúcar','search.empty':'Digite um termo para começar sua análise.','search.idleTitle':'Comece pela busca','search.idleDescription':'Digite um termo para buscar um produto.','search.loading':'Buscando produtos...','search.noResultsTitle':'Nenhum resultado encontrado','search.noResultsDescription':'Tente outro termo ou escaneie o código de barras.','search.errorTitle':'Não foi possível buscar agora','search.errorDescription':'Verifique sua conexão e tente novamente.','search.scanAction':'Escanear código de barras',
    'scanner.title':'Scanner inteligente','scanner.subtitle':'Leia códigos EAN-13 e entenda o produto antes de comprar.','scanner.permissionTitle':'Permissão de câmera','scanner.permissionSubtitle':'Precisamos da câmera para análise automática.','scanner.manualTitle':'Análise manual','scanner.manualSubtitle':'Digite o código de barras para continuar.','scanner.reading':'Lendo código de barras...','scanner.waiting':'Aguardando leitura do código de barras.','scanner.processing':'Processando leitura...','scanner.tryAgain':'Tentar novamente','scanner.invalidBarcode':'Digite um código de barras válido.','scanner.manualPlaceholder':'Ex.: 7891000100103'
    ,'product.loadingTitle':'Analisando produto','product.loadingSubtitle':'Estamos carregando os detalhes da composição.','product.loadingLabel':'Buscando informações do rótulo...','product.notFoundTitle':'Produto não encontrado','product.notFoundSubtitle':'Ainda não localizamos este item no catálogo.','product.notFoundEmptyTitle':'Sem cadastro para este código','product.notFoundEmptyDescription':'Você pode tentar uma busca manual, escanear novamente ou contribuir com o cadastro.','product.contribute':'Contribuir com este produto','product.searchAction':'Buscar manualmente','product.scanAgainAction':'Tentar escanear novamente','product.resultTitle':'Resultado da análise','product.resultSubtitle':'Leitura clara para decidir rápido e com confiança.','product.warningsTitle':'Pontos de atenção','product.warningsSubtitle':'Fatores que merecem cuidado','product.noWarnings':'Sem alertas críticos identificados.','product.positivesTitle':'Pontos positivos','product.positivesSubtitle':'Aspectos favoráveis deste produto','product.noPositives':'Nenhum destaque positivo informado.','product.compositionTitle':'Composição','product.compositionSubtitle':'Ingredientes críticos ou relevantes','product.noCritical':'Não há ingredientes críticos cadastrados para este item.','product.removeFavorite':'Remover dos favoritos','product.saveFavorite':'Salvar nos favoritos','product.scanAnother':'Escanear outro produto',
    'institutional.faqTitle':'Perguntas frequentes','institutional.faqSubtitle':'Dúvidas comuns','institutional.faqItem1':'Como o score é calculado? Pela composição e grau de processamento.','institutional.faqItem2':'O app substitui profissional de saúde? Não.','institutional.faqItem3':'Posso salvar favoritos? Sim, com conta ativa.','institutional.contactTitle':'Contato','institutional.contactSubtitle':'Fale com nosso time','institutional.contactEmail':'','institutional.contactWhatsapp':'','institutional.contactFallback':'Estamos estruturando nossos canais oficiais de atendimento.','institutional.privacyTitle':'Privacidade','institutional.privacySubtitle':'Como tratamos seus dados','institutional.privacyLine1':'Coletamos apenas dados necessários para autenticação e funcionamento do app.','institutional.privacyLine2':'Não vendemos dados pessoais e seguimos princípios de minimização de dados.','institutional.termsTitle':'Termos de uso','institutional.termsSubtitle':'Condições de uso','institutional.termsLine1':'O app apoia leitura de rótulos e decisões de compra.','institutional.termsLine2':'As informações não substituem orientação profissional de saúde.',
    'cta.premiumTitle':'Pronto para comprar com mais segurança?','cta.premiumDescription':'Use o scanner e receba uma leitura clara da composição em segundos.','cta.premiumButton':'Escanear agora'
  },
  en: { ...{} as any }
};
translations.en = { ...translations.pt,
  'common.loading':'Loading...','common.back':'Back','common.save':'Save','common.cancel':'Cancel','common.search':'Search','common.scanNow':'Scan now','common.analyzeProduct':'Analyze product','common.understandProduct':'Understand this product','common.error':'Error','common.tryAgain':'Try again','common.or':'or',
  'tab.home':'Home','tab.search':'Search','tab.favorites':'Favorites','tab.history':'History','tab.profile':'Profile', 'auth.loginTitle':'Welcome back','auth.loginSubtitle':'Sign in to continue your analysis journey.','auth.email':'Email','auth.password':'Password','auth.login':'Sign in and continue','auth.loggingIn':'Signing in...','auth.createAccount':'Create free account','auth.registerTitle':'Create account','auth.registerSubtitle':'Start free and shop with more clarity.','auth.name':'Name','auth.register':'Create my account','auth.registering':'Creating account...','auth.forgotPassword':'Forgot password','auth.forgotTitle':'Reset password','auth.forgotSubtitle':'We will send a secure reset link.','auth.sendReset':'Send reset link','auth.sendingReset':'Sending...','auth.resetSent':'If the email exists, we sent a reset link.','auth.emptyEmail':'Please enter your email.','auth.emptyPassword':'Please enter your password.','auth.invalidEmail':'Please enter a valid email.','auth.weakPassword':'Password must have at least 6 characters.','auth.emptyName':'Please enter your name.'
};

Object.assign(translations.en, {
  'scanner.waiting':'Waiting for barcode reading.',
  'scanner.processing':'Processing scan...',
  'scanner.tryAgain':'Try again',
  'scanner.invalidBarcode':'Enter a valid barcode.',
  'scanner.manualPlaceholder':'Ex.: 7891000100103',
  'product.loadingTitle':'Analyzing product',
  'product.loadingSubtitle':'We are loading product composition details.',
  'product.loadingLabel':'Fetching label information...',
  'product.notFoundTitle':'Product not found',
  'product.notFoundSubtitle':'We could not find this item in the catalog yet.',
  'product.notFoundEmptyTitle':'No record for this code',
  'product.notFoundEmptyDescription':'Try manual search, scan again, or contribute this product.',
  'product.contribute':'Contribute this product',
  'product.searchAction':'Search manually',
  'product.scanAgainAction':'Scan again',
  'product.resultTitle':'Analysis result',
  'product.resultSubtitle':'Clear reading to decide quickly and confidently.',
  'product.warningsTitle':'Points of attention',
  'product.warningsSubtitle':'Factors that deserve care',
  'product.noWarnings':'No critical alerts identified.',
  'product.positivesTitle':'Positive points',
  'product.positivesSubtitle':'Favorable aspects of this product',
  'product.noPositives':'No positive highlights informed.',
  'product.compositionTitle':'Composition',
  'product.compositionSubtitle':'Critical or relevant ingredients',
  'product.noCritical':'No critical ingredients registered for this item.',
  'product.removeFavorite':'Remove from favorites',
  'product.saveFavorite':'Save to favorites',
  'product.scanAnother':'Scan another product',
  'institutional.faqSubtitle':'Common questions',
  'institutional.faqItem1':'How is the score calculated? By composition and processing level.',
  'institutional.faqItem2':'Does the app replace health professionals? No.',
  'institutional.faqItem3':'Can I save favorites? Yes, with an active account.',
  'institutional.contactSubtitle':'Talk to our team',
  'institutional.contactFallback':'We are setting up our official support channels.',
  'institutional.privacySubtitle':'How we handle your data',
  'institutional.privacyLine1':'We collect only data required for authentication and app operation.',
  'institutional.privacyLine2':'We do not sell personal data and follow data minimization principles.',
  'institutional.termsSubtitle':'Terms of use',
  'institutional.termsLine1':'The app supports label reading and purchase decisions.',
  'institutional.termsLine2':'Information does not replace professional health guidance.'
});
