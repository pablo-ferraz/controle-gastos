# Devlog — Controle de Gastos (MVP)

Registro cronológico do desenvolvimento feito pelo Claude Code nesta branch.

| Horário | Evento |
|---|---|
| 2026-09-10 21:15 | Início da sessão. Repositório vazio (apenas README + git). |
| 2026-09-10 21:20 | Criada branch `feat/mvp-controle-gastos`. |
| 2026-09-10 21:20 | Scaffold Vite + React + TypeScript gerado. |
| 2026-09-10 21:22 | Instaladas dependências: Tailwind CSS v4, AG Grid, AG Charts, uuid, vite-plugin-pwa. |
| 2026-09-10 21:23 | Criado ROADMAP.md e definida a paleta (UI neutra + 8 cores categóricas claro/escuro). |
| 2026-09-10 21:30 | Criados tipos, utilitários (dinheiro em centavos, datas), tema claro/escuro e camada de repositório (localStorage). |
| 2026-09-10 21:35 | Commit: `feat: tipos, tema claro/escuro e camada de repositório`. |
| 2026-09-10 21:40 | Commit: `fix: remover parameter properties incompatíveis com erasableSyntaxOnly`. |
| 2026-09-10 21:40 | Commit: `feat: shell da aplicação com navegação por abas e tema claro/escuro`. |
| 2026-09-10 21:41 | Encontrado e corrigido erro de tipagem do AG Charts (union `AgChartOptions` → `AgCartesianChartOptions`; `axes` mudou de array para objeto `{ x, y }` na v14). |
| 2026-09-10 21:41 | Testado com Playwright (Chromium headless): fluxo completo de adicionar/editar/excluir lançamento, bloqueio de exclusão de categoria com lançamentos vinculados, e alternância de tema claro/escuro — sem erros de console. |
| 2026-09-10 21:42 | Encontrado e corrigido: AG Charts precisa de registro de módulos próprio (`ag-charts-community`'s `ModuleRegistry`), separado do AG Grid. |
| 2026-09-10 21:43 | Commit: `feat: tela de categorias (criar, editar, excluir)`. |
| 2026-09-10 21:44 | Commit: `feat: tela de lançamentos com AG Grid (CRUD, ordenar, filtrar)`. |
| 2026-09-10 21:45 | Commit: `feat: dashboard com resumo mensal e gráficos (AG Charts)`. |
| 2026-09-10 21:49 | Build de produção: bundle do AG Grid/AG Charts excedia o limite padrão do Workbox (2 MiB) — ajustado `maximumFileSizeToCacheInBytes` e adicionado code-splitting manual (React / AG Grid / AG Charts). |
| 2026-09-10 21:51 | Testado build de produção com Playwright: service worker ativa e o app carrega o dashboard normalmente com a rede desligada (offline). |
| 2026-09-10 21:52 | Commit: `feat: configuração de PWA (manifest, service worker, ícones)`. |
