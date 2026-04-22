# Rótula App (Expo + Firebase)

MVP mobile em React Native/Expo para escanear rótulos no Brasil.

## O que mudou neste upgrade

- Scanner real com câmera (`expo-camera`) + fallback manual.
- Busca de produto por código de barras via Open Food Facts Brasil.
- Cache de produto no Firestore (`products/{barcode}`) com score e classificação persistidos.
- Fluxo de contribuição real para produto não encontrado, com upload de imagens no Storage.
- Histórico e favoritos por usuário em subcoleções de `users/{uid}`.

## Arquitetura (camadas)

- **screen**: `app/*`
- **service/usecase**: `src/services/*`
- **repository**: `src/repositories/*`
- **firebase/api**: `src/lib/firebase/*` e `src/api/open-food-facts.ts`
- **domínio (score)**: `src/domain/product-score.ts`

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`
- `EXPO_PUBLIC_SENTRY_DSN` (opcional)
- `EXPO_PUBLIC_OPEN_FOOD_FACTS_BASE_URL` (opcional, padrão `https://br.openfoodfacts.org`)

## Rodando localmente

```bash
npm install
npm run start
```

Comandos úteis:

```bash
npm run lint
npm run typecheck
npm run check:routes
```

## Como testar scanner

1. Abra o app no dispositivo (Expo Go/dev build).
2. Faça login.
3. Vá em **Scanner**.
4. Conceda permissão de câmera.
5. Escaneie um EAN-13.
6. Confirme redirecionamento automático para `/product/[barcode]`.

## Fluxo de cache + score

1. App busca `products/{barcode}` no Firestore.
2. Se existir, usa cache.
3. Se não existir, busca no Open Food Facts.
4. Calcula score/classificação no domínio `product-score`.
5. Persiste no Firestore para próximas consultas.

## Fluxo de contribuição

Quando um produto não existe no catálogo:

1. Abrir tela `not-found-product`.
2. Enviar foto da tabela nutricional e ingredientes (frente opcional).
3. Upload no Storage em `product_submissions/{uid}/{submissionId}`.
4. Documento criado em `product_submissions/{id}` com URLs e status `pending`.

## Firebase (regras)

Depois de ajustar `firestore.rules` e `storage.rules`, publique:

```bash
npx -y firebase-tools@latest deploy --only firestore:rules
npx -y firebase-tools@latest deploy --only storage
```

> Importante: o app não faz diagnóstico médico. A classificação é uma heurística de apoio para leitura de rótulos.
