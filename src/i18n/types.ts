export type Language = 'pt' | 'en';

export type TranslationKey =
  | 'common.loading' | 'common.back' | 'common.save' | 'common.cancel' | 'common.search' | 'common.scanNow' | 'common.analyzeProduct' | 'common.understandProduct'
  | 'common.error' | 'common.tryAgain' | 'common.or'
  | 'tab.home' | 'tab.search' | 'tab.favorites' | 'tab.history' | 'tab.profile'
  | 'onboarding.title' | 'onboarding.subtitle' | 'onboarding.benefit1Title' | 'onboarding.benefit1Desc' | 'onboarding.benefit2Title' | 'onboarding.benefit2Desc' | 'onboarding.benefit3Title' | 'onboarding.benefit3Desc' | 'onboarding.cta' | 'onboarding.trust'
  | 'auth.loginTitle' | 'auth.loginSubtitle' | 'auth.email' | 'auth.password' | 'auth.login' | 'auth.loggingIn' | 'auth.createAccount' | 'auth.registerTitle' | 'auth.registerSubtitle' | 'auth.name' | 'auth.register' | 'auth.registering' | 'auth.forgotPassword' | 'auth.forgotTitle' | 'auth.forgotSubtitle' | 'auth.sendReset' | 'auth.sendingReset' | 'auth.resetSent' | 'auth.emptyEmail' | 'auth.emptyPassword' | 'auth.invalidEmail' | 'auth.weakPassword' | 'auth.emptyName'
  | 'home.title' | 'home.subtitle' | 'home.manualSearch' | 'home.featured' | 'home.quickAccess' | 'home.methodology' | 'home.socialProof' | 'home.favorites' | 'home.history' | 'home.faq'
  | 'search.title' | 'search.subtitle' | 'search.placeholder' | 'search.empty' | 'search.idleTitle' | 'search.idleDescription' | 'search.loading' | 'search.noResultsTitle' | 'search.noResultsDescription' | 'search.errorTitle' | 'search.errorDescription' | 'search.scanAction'
  | 'scanner.title' | 'scanner.subtitle' | 'scanner.permissionTitle' | 'scanner.permissionSubtitle' | 'scanner.manualTitle' | 'scanner.manualSubtitle' | 'scanner.reading'
  | 'product.loadingTitle' | 'product.loadingSubtitle' | 'product.loadingLabel' | 'product.notFoundTitle' | 'product.notFoundSubtitle' | 'product.notFoundEmptyTitle' | 'product.notFoundEmptyDescription' | 'product.contribute' | 'product.searchAction' | 'product.scanAgainAction' | 'product.resultTitle' | 'product.resultSubtitle' | 'product.warningsTitle' | 'product.warningsSubtitle' | 'product.noWarnings' | 'product.positivesTitle' | 'product.positivesSubtitle' | 'product.noPositives' | 'product.compositionTitle' | 'product.compositionSubtitle' | 'product.noCritical' | 'product.removeFavorite' | 'product.saveFavorite' | 'product.scanAnother'
  | 'institutional.faqTitle' | 'institutional.faqSubtitle' | 'institutional.faqItem1' | 'institutional.faqItem2' | 'institutional.faqItem3' | 'institutional.contactTitle' | 'institutional.contactSubtitle' | 'institutional.contactEmail' | 'institutional.contactWhatsapp' | 'institutional.contactFallback' | 'institutional.privacyTitle' | 'institutional.privacySubtitle' | 'institutional.privacyLine1' | 'institutional.privacyLine2' | 'institutional.termsTitle' | 'institutional.termsSubtitle' | 'institutional.termsLine1' | 'institutional.termsLine2'
  | 'cta.premiumTitle' | 'cta.premiumDescription' | 'cta.premiumButton';

export type Translations = Record<Language, Record<TranslationKey, string>>;
