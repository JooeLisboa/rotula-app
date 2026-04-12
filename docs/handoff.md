# Handoff

## Para Desenvolvimento
1. Iniciar pelo fluxo crítico scanner->resultado.
2. Substituir `mockProducts` por API `/v1/products/:barcode`.
3. Implementar estado global com TanStack Query + persistência.
4. Integrar analytics de funil (scan started, scan success, premium click).

## Para Design
1. Entregar biblioteca Figma com tokens equivalentes ao `constants/theme.ts`.
2. Prototipar microinterações: scan, loading, score reveal.
3. Definir variações de cards para alimento, cosmético e farmácia.

## Evolução futura
- OCR de rótulo para produtos sem código.
- Recomendação personalizada por perfil de consumo.
- Motor de comparação em lote para lista de compras.
