# Rótula App (Expo Router + React Native + Firebase)

App transacional mobile para leitura de rótulos com suporte web secundário via Expo Web.

## Stack real
- Expo + Expo Router
- React Native + TypeScript strict
- Firebase Auth, Firestore e Storage

## Importante sobre plataforma
Este repositório **não é Next.js**. É um app Expo/React Native.
Para SEO orgânico forte (Google), recomenda-se criar uma landing page separada em Next.js no futuro.

## Rodando localmente
```bash
npm install
npm run start
```

## Scripts
```bash
npm run lint
npm run typecheck
npm run check:routes
```

## Estrutura principal
- `app/*`: rotas/telas
- `components/*`: UI compartilhada
- `src/services/*`: regras de aplicação
- `src/repositories/*`: acesso a dados
- `src/i18n/*`: internacionalização PT/EN
- `src/analytics/*`: eventos padronizados

## i18n
- Idiomas: `pt` (padrão) e `en`
- Persistência com AsyncStorage
- Hook `useLanguage()` com `language`, `setLanguage`, `toggleLanguage` e `t(key)`

## Rotas principais
- Onboarding: `/(onboarding)`
- Auth: `/(auth)/login`, `/(auth)/register`, `/(auth)/forgot-password`
- Tabs: `/(tabs)`
- Scanner: `/scanner`
- Institucionais: `/faq`, `/contact`, `/privacy`, `/terms`

## Expo Web
Expo Web existe como suporte secundário para validação e navegação básica. O foco principal do produto é experiência mobile.
