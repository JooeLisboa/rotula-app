# Rótula — Product Blueprint (Brasil)

## A) Nomes sugeridos (20)
Rótula, Leia+, NutriScan, Escolha+, ClaraCompra, RótuloIQ, MiraLabel, CompraCerta, Selo, PratoIQ, VittaScan, Labelly, BemEscolha, Veredito, ComparaBem, ScanVida, RaioRótulo, Vero, Lumo, Guia360.

**Nome escolhido: `Rótula`**
- Curto, memorável, brasileiro, diretamente associado a rótulo + leitura inteligente.
- Permite expansão de marca (Rótula Premium, Rótula Kids, Rótula Pro).

## B) Visão geral do produto
- **Proposta de valor:** “Aponte, escaneie e entenda em segundos se o produto vale a pena para sua saúde”.
- **Problema:** rótulos complexos, termos técnicos e pouco tempo de decisão no ponto de venda.
- **Diferencial:** score simples + explicação transparente + alternativas melhores + curadoria local brasileira.
- **Por que no Brasil:** alta sensibilidade a preço/qualidade, crescimento de wellness e aumento de consumo de ultraprocessados.
- **Modelo comercial:** freemium com insights premium e histórico avançado.

### Horizonte
- **Curto (0-3 meses):** scanner, score, favoritos, histórico, alternativas.
- **Médio (3-9 meses):** comparação, alertas por perfil alimentar, comunidade.
- **Longo (9-24 meses):** B2B de inteligência de consumo e APIs para varejo/saúde.

## C) MVP completo
### Entra no MVP
1. Splash + onboarding focado em valor imediato.
2. Login/cadastro social/e-mail.
3. Home com CTA de scanner.
4. Scanner + busca manual.
5. Resultado com nota 0-100, ingredientes críticos e alertas.
6. Alternativas melhores.
7. Histórico e favoritos.
8. Perfil + configurações.
9. Paywall premium inicial (sem hard paywall).

### Fica fora
- Comunidade completa, gamificação, dieta detalhada, OCR avançado offline.

### Racional
- Maximiza percepção de valor no primeiro scan e reduz time-to-market.

## D) Roadmap
### Fase 2
Comparação lado a lado, preferências alimentares, alergias, metas semanais.

### Fase 3
Feed da comunidade, avaliação de usuários, ranking por categoria, lista inteligente.

### Expansão Premium
Relatórios mensais, alertas inteligentes recorrentes, plano família com perfis.

## E) Estrutura de telas (resumo)
- Splash, onboarding, login/cadastro, home, scanner, busca manual, loading scan, permissão câmera, resultado, comparação, favoritos, histórico, perfil, premium, configurações, erro/not found.
- Cada tela deve contemplar: estado vazio, erro, loading, CTA primário e secundário, feedback háptico no scan, transição curta (<250ms).

## F) UX/UI Design System
- **Conceito:** clínico + humano + retail-tech.
- **Paleta:** verde confiança, azul tecnologia, neutros claros, semânticas de risco.
- **Tipografia:** Inter/SF Pro com escala 12/14/16/20/28.
- **Grid:** 4-pt, cards com raio 12-16, botões preenchidos e ghost.
- **Sistema de nota:**
  - 85-100 excelente (verde escuro)
  - 70-84 bom (verde oliva)
  - 50-69 atenção (âmbar)
  - 30-49 ruim (vermelho)
  - 0-29 evite (vinho)

## G) Scoring (MVP defensável)
### Lógica
`Score = 100 - penalidades + bônus`, limitado a 0..100.

### Pesos sugeridos
- Açúcar: até -20
- Sódio: até -15
- Gorduras saturadas/trans: até -15
- Aditivos/conservantes: até -15
- Grau de processamento (NOVA): até -20
- Ingredientes controversos: até -10
- Alergênicos: -5 (informativo, não punitivo universal)

### Bônus
- Alta densidade nutricional (+5)
- Baixo teor de açúcar/sódio (+5)
- Fórmula curta e limpa (+5)

### Exibição
- Gauge/score badge + chips por fator (“Açúcar alto”, “Sem parabenos”).
- “Por que essa nota?” com breakdown transparente.

## H) Fontes de dados no Brasil
- **Fontes abertas:** Open Food Facts, dados públicos regulatórios quando disponíveis.
- **Seed manual:** top SKUs de supermercados/farmácias por categoria.
- **Contribuição do usuário:** envio de fotos + fila de revisão.
- **Admin + curadoria:** revisão humana para publicação.
- **Anti-dependência:** pipeline com múltiplas fontes + `product_sources` com versionamento.

## I) Arquitetura técnica
- **Mobile:** Expo + TypeScript + Expo Router + feature folders.
- **Backend escolhido:** **NestJS** (ecossistema TypeScript unificado, guardas/auth robustos, velocidade de squad full-stack JS).
- **DB:** PostgreSQL + Prisma.
- **Auth:** JWT curto + refresh token rotativo; suporte social login posterior.
- **Storage:** S3 compatível (Cloudflare R2/Supabase Storage) para imagens.
- **Observabilidade:** OpenTelemetry + Sentry + logs estruturados.
- **API:** REST versionada `/v1`, contratos OpenAPI.

## J) Modelagem de dados (resumo)
Tabelas centrais:
`users, products, brands, categories, ingredients, product_ingredients, scans, favorites, alternatives, subscriptions, reports, product_images, user_preferences, audit_logs, review_queue, product_sources`.

### Índices essenciais
- `products(barcode unique)`, `products(name gin_trgm)`, `scans(user_id, scanned_at desc)`, `favorites(user_id, product_id unique)`, `review_queue(status, created_at)`.

## K) Painel admin
- Login admin com RBAC.
- Dashboard: scans/dia, produtos mais escaneados, buscas sem match.
- CRUD: produtos, ingredientes, categorias, alternativas.
- Fila de moderação de contribuições.
- Ajuste de parâmetros de scoring por categoria.

## L) Monetização
- **Freemium:** scans básicos, score, favoritos limitados.
- **Premium:** comparação avançada, alertas inteligentes, histórico expandido, relatórios.
- **Preço sugerido:** mensal R$19,90; anual R$149,90; família anual R$249,90.
- **Hipótese inicial:** 2-4% conversão premium em 6 meses.

## M) Go-to-market Brasil
1. Landing com waitlist + incentivo de convite.
2. Conteúdo vertical (Reels/TikTok): “3 produtos para evitar”, “comparativo em 20s”.
3. Microinfluenciadores de nutrição/maternidade/fitness.
4. Comunidades nichadas (Telegram/WhatsApp) para beta.
5. Ciclo quinzenal de feedback com melhorias públicas.

## N) App Store / Play Store (base)
- **Nome curto:** Rótula
- **Slogan:** “Escaneie. Entenda. Escolha melhor.”
- **Subtítulo:** “Avaliação inteligente de produtos do dia a dia.”
- **Keywords:** rótulo, scanner, alimentação, cosmético, saúde, ingredientes, comparação.
- **Screenshots:** scanner, score, alternativas, histórico, premium.

## O) Geração do app
Implementado neste repositório:
- estrutura de rotas essenciais
- design tokens
- componentes-base reutilizáveis
- mocks e serviço de produto para integração posterior com backend real

## P) README
README atualizado com arquitetura, setup, fluxo de desenvolvimento e roadmap.

## Q) Documentação complementar
Ver `docs/checklists.md`, `docs/handoff.md` e `docs/prompts.md`.

## R) Prompts finais
Disponíveis em `docs/prompts.md` para UI, mobile, backend, admin, landing e branding.

## S) Resumos obrigatórios
### MVP 30 dias
- Semana 1: UX flows + design system + arquitetura.
- Semana 2: scanner/busca/resultado + auth.
- Semana 3: histórico/favoritos/admin inicial + scoring.
- Semana 4: QA, analytics, paywall, soft launch.

### Roadmap 90 dias
- M1: estabilidade e baseline de catálogo.
- M2: comparação, alertas e preferências.
- M3: premium avançado + crescimento orgânico.

### Resumo para investidores/parceiros
Rótula resolve assimetria de informação no varejo brasileiro com experiência de scan instantâneo, score explicável e modelo freemium escalável.

### Resumo executivo para desenvolvimento
Construir mobile RN/Expo com backend NestJS + Postgres, priorizando scanner->score->alternativa->retenção.

### Pitch comercial curto
“Rótula é o app brasileiro que traduz rótulos complexos em decisões simples e inteligentes em segundos.”
