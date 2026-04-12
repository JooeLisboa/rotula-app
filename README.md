# Rótula App

Aplicativo mobile brasileiro para escanear código de barras e traduzir rótulos em decisões de compra claras, rápidas e confiáveis.

## Visão geral
Rótula ajuda usuários a avaliar alimentos, cosméticos, higiene e autocuidado por meio de:
- nota geral (0-100)
- classificação por cor
- ingredientes críticos
- alternativas melhores
- histórico e favoritos

## Proposta de valor
**“Escaneie. Entenda. Escolha melhor.”**

## Stack
- Mobile: React Native + Expo + TypeScript
- Navegação: Expo Router
- Estado inicial: local + mocks (pronto para API)
- Backend recomendado: NestJS + PostgreSQL + Prisma
- Observabilidade recomendada: Sentry + logs estruturados

## Estrutura de pastas
```bash
app/
  (onboarding)/
  (auth)/
  (tabs)/
  product/[barcode].tsx
  scanner.tsx
  ...
components/
  screen-shell.tsx
  ui/score-badge.tsx
constants/
  theme.ts
src/
  mocks/products.ts
  services/product-service.ts
  types/product.ts
docs/
  product-strategy.md
  checklists.md
  handoff.md
  prompts.md
```

## Pré-requisitos
- Node.js 20+
- npm 10+
- Expo CLI (opcional)

## Instalação local
```bash
npm install
npm run start
```

## Rodar app
```bash
npm run ios
npm run android
npm run web
```

## Backend (planejado)
```bash
# sugestão futura
cd backend
npm install
npm run start:dev
```

## Variáveis de ambiente (futuro)
```bash
EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_SENTRY_DSN=
```

## Scripts principais
- `npm run start`
- `npm run lint`
- `npm run web`

## Convenções
- TypeScript estrito
- Componentes pequenos e reutilizáveis
- Rotas por domínio/feature

## Fluxo de desenvolvimento
1. Criar branch por feature
2. Implementar tela/serviço/teste
3. Rodar lint
4. Abrir PR

## Estratégia de branches
- `main`: estável
- `develop`: integração
- `feature/*`, `fix/*`

## Qualidade de código
- ESLint Expo
- Convenção de componentes funcionais
- Tokens de tema centralizados

## Commit pattern
- `feat:` novas funcionalidades
- `fix:` correções
- `docs:` documentação
- `refactor:` melhoria estrutural

## Build e publicação
- EAS Build para Android/iOS
- Pipeline sugerido: lint + typecheck + build

## Observações de produção
- Substituir mocks por API versionada `/v1`
- Habilitar auth real com refresh token
- Adicionar políticas LGPD e privacidade

## Roadmap
- MVP: scanner, score, alternativas
- Fase 2: comparação e personalização
- Fase 3: comunidade e gamificação

## Próximos passos
1. Integrar backend NestJS
2. Implementar scanner real com câmera
3. Conectar analytics e monetização

## Licença
Proprietária (ajustável para MIT caso open-source).

## Contato
Equipe de produto Rótula — documento estratégico em `docs/product-strategy.md`.
