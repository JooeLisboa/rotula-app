# Rótula App

Base mobile profissional com Expo + Expo Router + TypeScript para leitura de produtos por código de barras, autenticação e evolução para backend real.

## O que evoluiu nesta base
- Auth provider com sessão persistida e fluxo login/logout.
- Auth guard centralizado para separar rotas públicas e privadas.
- Camada de dados com HTTP client central, tipos e services por domínio.
- Observabilidade inicial (eventos + captura global de erros).
- Pipeline de CI (lint + typecheck + validação de rotas/build web).

## Stack
- React Native 0.81
- Expo SDK 54
- Expo Router 6
- TypeScript (strict)
- ESLint (Expo config)

## Arquitetura
```bash
app/
  _layout.tsx
  index.tsx
  (onboarding)/
  (auth)/
  (tabs)/
  scanner.tsx
  product/[barcode].tsx
src/
  config/env.ts
  providers/auth-provider.tsx
  hooks/use-auth.ts
  components/auth-gate.tsx
  lib/api/http-client.ts
  lib/storage/persistent-store.ts
  lib/observability/*
  services/auth/*
  services/products/*
  services/user/*
  types/*
.github/workflows/ci.yml
```

## Fluxo de autenticação
1. App inicia e o `AuthProvider` reidrata sessão persistida.
2. `AuthGate` decide redirecionamento:
   - sem sessão: apenas `(onboarding)` e `(auth)`
   - com sessão: redireciona para `(tabs)`
3. Login/registro persistem tokens e usuário.
4. Logout limpa sessão e retorna para área pública.

## Camada de API
- `src/lib/api/http-client.ts`: cliente HTTP centralizado com suporte a `Authorization`.
- `src/config/env.ts`: configuração de ambiente (`EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_API_MODE`).
- Services por domínio:
  - `authService`
  - `productsService`
  - `userService`

### Modo mock vs live
- `EXPO_PUBLIC_API_MODE=mock` (default): usa dados e respostas locais estruturadas.
- `EXPO_PUBLIC_API_MODE=live`: usa `fetch` para backend real.

## Observabilidade
- `initMonitoring()` registra handler global de erro.
- `trackEvent()` para eventos relevantes de produto/autenticação.
- `captureError()` centraliza logging de exceções.

Eventos já instrumentados:
- `login_success`
- `login_failure`
- `register_success`
- `register_failure`
- `logout`
- `auth_guard_redirect`
- `barcode_scanned`
- `product_loaded`
- `product_not_found`
- `favorite_toggled`

## Scanner
No estado atual do repositório, o scanner roda em **modo manual (fallback)** para manter compatibilidade com as dependências disponíveis no ambiente. O fluxo de leitura e navegação está pronto para receber módulo de câmera nativo em próximo passo (ex.: `expo-camera`).

## CI
Workflow em `.github/workflows/ci.yml` com:
- `npm ci`
- `npm run lint`
- `npm run typecheck`
- `npm run check:routes` (export web para validar árvore de rotas/build)

## Pré-requisitos
- Node.js 20+
- npm 10+
- Expo Go (para testes em dispositivo)

## Instalação
```bash
npm install
```

## Execução
```bash
npm run start
npm run web
npm run android
```

## Comandos de qualidade
```bash
npm run lint
npm run typecheck
npm run check:routes
```

## Variáveis de ambiente
Crie `.env` (ou defina no shell):
```bash
EXPO_PUBLIC_API_URL=https://api.rotula.app/v1
EXPO_PUBLIC_API_MODE=mock
EXPO_PUBLIC_SENTRY_DSN=
```

## Troubleshooting rápido
- **Abre na web e não abre no celular:** teste `npx expo start --tunnel`.
- **Erro de rota:** rode `npm run check:routes` para validar árvore gerada.
- **Erro de auth/redirect:** verifique logs de evento `auth_guard_redirect` no terminal.

## O que ainda está mockado
- Endpoints de auth, produtos e usuário em `API_MODE=mock`.
- Scanner em fallback manual (sem leitura por câmera nativa instalada).
- Integração de transporte com Sentry DSN está preparada no env, mas envio remoto não foi ativado por SDK dedicado.

## Próximos passos recomendados
1. Instalar SDK de câmera e ativar leitura em tempo real.
2. Trocar `API_MODE=live` e conectar backend real.
3. Adicionar refresh token automático na camada auth.
4. Integrar transporte real de erros (Sentry SDK) e breadcrumbs.
5. Adicionar testes automatizados de serviços e fluxos críticos.
