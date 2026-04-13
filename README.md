# Rótula App (Firebase-first)

Aplicativo Expo + React Native com arquitetura orientada a Firebase (Auth + Firestore + Storage), usando Expo Router e TypeScript.

## Nova direção visual (2026)

O frontend foi evoluído para uma experiência mais clara, escaneável e acessível, inspirada na lógica de UX de apps como Yuka (sem cópia literal):

- **Leitura em segundos** com hierarquia visual forte.
- **Nota do produto muito destacada** com semântica de cor.
- **Separação clara entre alertas e qualidades**.
- **Cards consistentes**, espaçamento respirável e navegação objetiva.
- **Estados de vazio, loading e erro** com linguagem mais humana.

## Princípios de UX adotados

1. **Clareza primeiro**: menos ruído visual, mais prioridade para a decisão de compra.
2. **Explorabilidade**: home com CTAs, atalhos e contexto para primeiro uso.
3. **Semântica visual**: verde (bom), amarelo (atenção), laranja (ruim), vermelho (evite).
4. **Acessibilidade mobile**: áreas de toque maiores, contraste melhor, labels e textos legíveis.
5. **Consistência**: tokens de tema, tipografia, espaçamento e componentes reutilizáveis.

## Design tokens principais

Arquivo base: `constants/theme.ts`.

- **Cores base**
  - `background`: `#F4F8F6`
  - `surface`: `#FFFFFF`
  - `tint` (primária): `#20965B`
- **Cores semânticas**
  - `success`: `#1F9D55`
  - `warning`: `#F2B11B`
  - `caution`: `#EE7E2E`
  - `danger`: `#DB3B2E`
- **Score**
  - `excelente`, `bom`, `atencao`, `ruim`, `evite` em `ScoreColors`
- **Escala de layout**
  - `spacing`, `radius`, `typography`

## Componentes de UI principais

Criados/refatorados em `components/ui`:

- `ScoreBadge`
- `ProductCard`
- `ProductHeader`
- `ProductInsightRow`
- `ScanCTA`
- `SectionCard`
- `ActionButton`
- `EmptyState`
- `LoadingState`
- `ErrorState`
- `StatusDot`

## Convenções de layout

- Preferir `ScreenShell` para estrutura base de telas com header e rolagem.
- Organizar conteúdo em **blocos/seções** com `SectionCard`.
- Exibir status de tela com componentes específicos (não string solta).
- Evitar lógica de negócio dentro de componentes visuais reutilizáveis.

## O que foi inspirado no padrão Yuka

- Score com grande destaque e leitura instantânea.
- Blocos independentes de “pontos de atenção”, “pontos positivos” e “alternativas”.
- Linguagem visual leve e orientada a decisão rápida.

## O que foi adaptado para manter originalidade

- Estrutura visual própria da marca Rótula.
- Tokens de cor e tipografia personalizados.
- Organização de telas e componentes alinhada com arquitetura existente (Expo Router + Firebase).

## Stack atual

- Expo SDK 54
- React Native 0.81
- Expo Router 6
- TypeScript (strict)
- Firebase JS SDK 12
  - Authentication
  - Cloud Firestore
  - Cloud Storage

## Como rodar localmente

```bash
npm install
npm run start
```

Também disponível:

```bash
npm run web
npm run android
npm run ios
npm run lint
npm run typecheck
```

## Arquitetura (alto nível)

```bash
app/
  (auth)/
  (onboarding)/
  (tabs)/
  product/[barcode].tsx
  scanner.tsx
components/
  screen-shell.tsx
  themed-text.tsx
  ui/
constants/
  theme.ts
src/
  services/
  repositories/
  providers/
```
