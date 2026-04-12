# Rótula App

Aplicativo mobile em React Native + Expo para leitura de código de barras e interpretação de rótulos com foco em decisão de compra rápida.

## Visão geral
O Rótula foi organizado com **Expo Router** e rotas por domínio para suportar:
- onboarding inicial
- autenticação (login/registro)
- navegação principal por tabs
- fluxo de scanner e resultado por código de barras
- telas auxiliares (compare, premium, configurações)

Nesta revisão, a base foi ajustada para reduzir warnings de roteamento, melhorar previsibilidade de boot e facilitar testes em dispositivo físico.

## Stack técnica
- **Mobile:** React Native 0.81 + Expo SDK 54
- **Linguagem:** TypeScript
- **Roteamento:** Expo Router v6
- **UI base:** componentes próprios + tema centralizado
- **Dados atuais:** mocks locais (pronto para evolução para API)

## Estrutura de pastas
```bash
app/
  _layout.tsx                # Root layout global
  index.tsx                  # Redirect inicial para onboarding
  (onboarding)/
    _layout.tsx
    index.tsx
  (auth)/
    _layout.tsx
    login.tsx
    register.tsx
  (tabs)/
    _layout.tsx
    index.tsx
    search.tsx
    favorites.tsx
    history.tsx
    profile.tsx
  scanner.tsx
  scan-loading.tsx
  camera-permission.tsx
  product/[barcode].tsx
  compare.tsx
  premium.tsx
  settings.tsx
  not-found-product.tsx
components/
constants/
src/
```

## Pré-requisitos
- Node.js 20+
- npm 10+
- Expo Go instalado no celular (Android/iOS)
- Celular e computador na mesma rede local (quando usar modo LAN)

> Dica: sempre use as versões de dependências já fixadas no `package.json` para evitar incompatibilidades com Expo Go.

## Instalação
```bash
npm install
```

## Como iniciar o projeto
```bash
npm run start
```

Depois de iniciar, o Expo mostra opções no terminal:
- pressione `w` para abrir Web
- pressione `a` para Android Emulator (se configurado)
- escaneie QR Code com Expo Go no celular

## Testar em Web
```bash
npm run web
```

Use Web para validar rapidamente:
- boot do app
- navegação inicial
- erros de runtime (stack trace no terminal/browser)

## Testar em Android
### Opção 1: dispositivo físico (Expo Go)
1. Abra `npm run start`.
2. Escaneie o QR Code no Expo Go.
3. Aguarde bundle carregar até abrir a tela inicial.

### Opção 2: emulator Android
```bash
npm run android
```
Requer Android Studio + emulator ativo.

## Quando usar `--tunnel`
Use tunnel quando o QR Code não abre no celular por rede local (Wi-Fi corporativo, roteador isolando dispositivos, VPN etc.).

```bash
npx expo start --tunnel
```

Use tunnel também quando:
- celular e computador não conseguem se enxergar na LAN
- abre “Connecting…” e nunca finaliza
- aparece timeout de conexão ao Metro

## Passo a passo prático de validação (recomendado)
1. **Instalar dependências:** `npm install`.
2. **Lint básico:** `npm run lint`.
3. **Subir projeto:** `npm run start`.
4. **Validar Web primeiro:** pressione `w` e confirme que o app abre sem crash.
5. **Validar fluxo inicial:** onboarding → login → register (ou entrada para tabs).
6. **Validar tabs:** home, busca, favoritos, histórico, perfil.
7. **Validar rotas fora das tabs:** scanner, settings, compare, premium, `product/[barcode]`.
8. **Testar no celular com Expo Go (LAN).**
9. Se falhar no celular, **retestar com tunnel** (`npx expo start --tunnel`).
10. **Comparar sintomas de rede x runtime** (tabela abaixo).

## Como identificar problema de rede vs problema do app

### Sintomas de rede (Expo/Metro)
- QR abre Expo Go, mas fica em “Connecting…” indefinidamente.
- Timeout de conexão com bundler.
- Em Web funciona, mas celular não baixa bundle.

Ações:
- trocar para `--tunnel`
- desativar VPN/proxy
- confirmar mesma rede e sem isolamento AP/client

### Sintomas de runtime (código)
- bundle carrega e fecha com erro vermelho (red screen)
- navegação abre rota errada ou tela em branco
- erro JS no terminal/overlay

Ações:
- revisar logs do Metro
- validar rotas e redirects
- verificar imports e APIs não suportadas

## Troubleshooting

### 1) Warning de rota no Expo Router
- Verifique se nomes declarados em `<Stack.Screen name="..." />` existem exatamente no filesystem.
- Evite declarar manualmente grupos incompletos no root layout quando a árvore já é inferível.

### 2) App abre no navegador, mas não no celular
- provável rede/descoberta do Metro
- rode: `npx expo start --tunnel`

### 3) App abre, mas cai na navegação inicial
- confirme existência de rota inicial explícita (`app/index.tsx` com redirect)
- cheque se arquivos `_layout.tsx` de grupos estão presentes

### 4) Dependência incompatível no Expo Go
- rode: `npx expo install --check`
- ajuste pacotes para versões compatíveis com SDK 54

## Comandos úteis
```bash
npm run start
npm run web
npm run android
npm run lint
npx expo start --tunnel
npx expo install --check
```

## Observações arquiteturais atuais
- Estrutura de rotas por grupos está pronta para evolução com guards de autenticação.
- Root layout mantém responsabilidade global (tema + stack raiz) sem acoplamento a telas específicas.
- Mocks locais simplificam desenvolvimento inicial e permitem migração progressiva para backend.

## Próximos passos técnicos
1. Implementar guard de sessão (auth state + redirecionamento automático).
2. Introduzir camada de dados remotos (React Query + API).
3. Integrar scanner real com câmera e fallback manual robusto.
4. Adicionar monitoramento de erro (Sentry) e analytics de navegação.
5. Configurar pipeline CI (lint + typecheck + testes).
