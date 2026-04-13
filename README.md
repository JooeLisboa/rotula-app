# Rótula App (Firebase-first)

Aplicativo Expo + React Native com arquitetura orientada a Firebase (Auth + Firestore + Storage), usando Expo Router e TypeScript.

## Visão geral

Esta base migrou de uma arquitetura HTTP/mock para **backend 100% Firebase no app client**:
- Autenticação real via Firebase Authentication.
- Dados de perfil, favoritos, histórico e produtos em Cloud Firestore.
- Base de Cloud Storage preparada para avatares e imagens de produtos.
- Regras iniciais de segurança para Firestore/Storage.

## Stack atual

- Expo SDK 54
- React Native 0.81
- Expo Router 6
- TypeScript (strict)
- Firebase JS SDK 12
  - Authentication
  - Cloud Firestore
  - Cloud Storage
- Firebase Hosting (web já existente no projeto)

## Arquitetura

```bash
app/
  (auth)/
  (onboarding)/
  (tabs)/
  product/[barcode].tsx
  scanner.tsx
src/
  config/env.ts
  lib/firebase/
    client.ts
    storage.ts
  providers/
    auth-provider.tsx
  hooks/
    use-auth.ts
  repositories/
    auth-repository.ts
    product-repository.ts
    user-repository.ts
  services/
    auth/
    products/
    user/
  types/
    auth.ts
    product.ts
    user.ts
    storage.ts
firestore.rules
storage.rules
```

## Firebase no projeto

### Authentication
- Login com e-mail/senha.
- Cadastro com e-mail/senha.
- Logout.
- Bootstrap de sessão por `onAuthStateChanged` no provider.
- Método preparado para reset de senha (`forgotPassword`) no serviço.
- Auth guard com redirecionamento entre onboarding/auth/área autenticada.

### Firestore
Coleções modeladas:
- `users`
- `user_profiles`
- `user_preferences`
- `scan_history`
- `favorites`
- `products`
- `product_alternatives`
- `categories`
- `brands`

### Storage
Base preparada para:
- `user_avatars/{uid}/...`
- `product_images/{barcode}/...`
- `assets/...`

Helpers implementados:
- `uploadUserAvatar`
- `uploadProductImage`

## Estrutura sugerida dos documentos

### `products/{barcode}`
```json
{
  "barcode": "7891000100103",
  "name": "Produto X",
  "brand": "Marca Y",
  "category": "alimento",
  "score": 83,
  "classification": "bom",
  "criticalIngredients": [],
  "positives": [],
  "warnings": [],
  "isFeatured": true,
  "updatedAt": "timestamp"
}
```

### `favorites/{uid_productId}`
```json
{
  "uid": "authUid",
  "productId": "productDocId",
  "barcode": "7891000100103",
  "createdAt": "timestamp"
}
```

### `scan_history/{autoId}`
```json
{
  "uid": "authUid",
  "barcode": "7891000100103",
  "productId": "productDocId",
  "productName": "Produto X",
  "scannedAt": "timestamp"
}
```

## Variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Preencha:

```bash
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

> `.env` já está fora do git via `.gitignore`.

## Como obter as chaves no Firebase Console

1. Acesse **Project settings** no Firebase Console.
2. Em **Your apps**, selecione app web existente (ou crie um).
3. Copie os campos de config para `.env`.
4. Em **Authentication**, habilite `Email/Password`.
5. Em **Firestore Database**, crie banco no modo produção.
6. Em **Storage**, habilite o bucket padrão.

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
```

## Como testar

### Auth
1. Abra `/ (auth) /register` e crie conta.
2. Faça logout em perfil.
3. Faça login novamente na tela de login.
4. Reinicie o app e valide restauração de sessão.

### Firestore
1. Abra um produto por barcode existente em `products`.
2. Favoritar/desfavoritar na tela de produto.
3. Verificar listagem em `Favoritos`.
4. Escanear/abrir produto e validar entrada no `Histórico`.

### Storage
Ainda não há UI de upload, mas os helpers já estão prontos em `src/lib/firebase/storage.ts`.

## Deploy web

Com Firebase Hosting já configurado, use fluxo já adotado pelo projeto. Exemplo comum:

```bash
npm run check:routes
firebase deploy --only hosting
```

## Segurança

- Regras em `firestore.rules`.
- Regras em `storage.rules`.
- Produtos públicos para leitura.
- Escritas de catálogo restritas a admin claim.
- Dados de favoritos/histórico/perfil isolados por `uid`.

## Observabilidade (eventos)

Eventos instrumentados:
- `auth_login_success`
- `auth_login_failure`
- `auth_register_success`
- `auth_logout`
- `barcode_scanned`
- `product_loaded`
- `product_not_found`
- `favorite_added`
- `favorite_removed`

## Migração e seeds

### Já migrado para Firebase
- Auth completo.
- Produtos por barcode.
- Favoritos por usuário.
- Histórico por usuário.
- Perfil por usuário.

### Ainda depende de seed/manual
- Catálogo inicial em `products`/`product_alternatives`.
- Taxonomias em `categories` e `brands`.
- Claims administrativas para escrita de catálogo.

Há utilitário de seed simples baseado em mocks no repositório de produtos (`seedProductsFromMockIfEmpty`) para bootstrap em ambiente de desenvolvimento/admin.

## Troubleshooting

- **Erro `Missing required env var`**: revisar `.env`.
- **Permissão negada no Firestore**: revisar login e regras.
- **Produto não encontrado**: conferir se `products/{barcode}` existe.
- **Falha de upload Storage**: validar regras e caminho de arquivo.

## Próximos passos recomendados

1. Adicionar tela de “esqueci minha senha”.
2. Criar fluxo de edição de perfil com upload de avatar.
3. Implementar busca de produtos com índice dedicado.
4. Adicionar Cloud Functions para escrita administrativa controlada.
5. Configurar analytics/monitoring remoto (ex.: Sentry SDK completo).
