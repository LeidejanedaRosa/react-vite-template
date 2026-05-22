# React Vite Template

Template profissional para projetos React, criado para eliminar o trabalho repetitivo de configuração inicial. Inclui toda a stack de qualidade — testes unitários, E2E, acessibilidade WCAG 2.1, SEO estruturado, monitoramento de erros e git hooks — pronta e funcionando desde o primeiro commit.

> **Tipo de aplicação**: Ponto de partida (template) para qualquer projeto React que precise de uma base sólida, escalável e production-ready. Da landing page simples à aplicação complexa com múltiplas features.

**Última atualização:** 22 de maio de 2026

---

## Índice

- [Por que este template foi criado](#por-que-este-template-foi-criado)
- [Stack de Tecnologias](#stack-de-tecnologias)
- [Bibliotecas de Teste](#bibliotecas-de-teste)
- [Componentes Inclusos](#componentes-inclusos)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Primeiros Passos (Quick Start)](#primeiros-passos-quick-start)
- [Configuração do Projeto](#configuração-do-projeto)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Arquitetura e Decisões Técnicas](#arquitetura-e-decisões-técnicas)
- [Acessibilidade](#acessibilidade)
- [SEO e Dados Estruturados](#seo-e-dados-estruturados)
- [Monitoramento de Erros (Sentry)](#monitoramento-de-erros-sentry)
- [Performance (Core Web Vitals)](#performance-core-web-vitals)
- [Qualidade de Código](#qualidade-de-código)
- [Deploy e Produção](#deploy-e-produção)
- [Documentação Adicional](#documentação-adicional)

---

## Por que este template foi criado

Cada novo projeto React parte da mesma base: configurar ESLint, Prettier, Husky, TypeScript, testes, Sentry, acessibilidade, SEO estruturado. São horas de trabalho que se repetem. E muitas vezes alguma peça fica faltando — o lint não tem os plugins de acessibilidade, os testes não têm thresholds de cobertura, o Sentry não filtra erros de extensões do browser.

Este template consolida decisões já tomadas e validadas em projetos reais. Cada escolha de biblioteca tem uma justificativa, cada configuração tem um motivo. Ao usar este template, você começa com:

- Code splitting manual para React e Sentry em chunks separados
- ESLint com 10+ plugins (incluindo acessibilidade, segurança, SonarJS e Unicorn)
- Cobertura de testes com threshold mínimo de 80% em branches, funções, linhas e statements
- Testes E2E rodando em Chromium, WebKit, Chrome mobile e Safari mobile
- 4 suites de testes Playwright dedicadas a SEO, acessibilidade WCAG e performance
- Componentes de acessibilidade pré-construídos (SkipLink, AccessibleButton, AccessibleLink)
- 5 schemas Schema.org prontos para customização
- Sentry configurado com filtros de erros de extensões e scripts externos
- Git hooks que bloqueiam commits com erros de lint/tipo e pushes com testes falhando

---

## Stack de Tecnologias

### Core

| Tecnologia                                        | Versão | Por que foi escolhida                                                                                                                                                 |
| ------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **[React](https://react.dev/)**                   | 19.x   | Versão mais recente com suporte nativo a meta tags no JSX — elimina a necessidade de `react-helmet`. Novas otimizações de rendering e tipagem TypeScript mais precisa |
| **[Vite](https://vitejs.dev/)**                   | 6.x    | HMR instantâneo, build com Rollup, code splitting automático e ecossistema de plugins rico. Dev server na porta `5173` com auto-open                                  |
| **[TypeScript](https://www.typescriptlang.org/)** | 5.7    | Tipagem estática em strict mode. `noUnusedLocals` e `noUnusedParameters` habilitados para forçar código limpo                                                         |
| **[Tailwind CSS](https://tailwindcss.com/)**      | 4.x    | Engine CSS nativo (versão 4 não precisa de `tailwind.config.js`). Zero CSS morto em produção, utilitários inline, integrado ao Vite via `@tailwindcss/vite`           |
| **[pnpm](https://pnpm.io/)**                      | 9.x    | Mais rápido que npm/yarn, economiza espaço em disco com hard links e evita dependências fantasma. Obrigatório — `engines` no `package.json` bloqueia npm              |

### Dependências de Produção

| Biblioteca                                                      | Finalidade                                                                                         |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **[clsx](https://github.com/lukeed/clsx)**                      | Composição condicional de classes CSS                                                              |
| **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** | Resolve conflitos entre classes Tailwind (ex: `p-4` + `p-2` → `p-2`). Usado pelo utilitário `cn()` |
| **[web-vitals](https://web.dev/articles/vitals)**               | Medição dos Core Web Vitals (LCP, INP, CLS, FCP, TTFB) em browsers reais                           |

### Dependências de Build/Dev

| Ferramenta                                                                                        | Finalidade                                                                                                                                                      |
| ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **[@sentry/react](https://docs.sentry.io/platforms/javascript/guides/react/)**                    | Error tracking e performance monitoring em produção. Inicializado via `src/lib/sentry.ts`                                                                       |
| **[@sentry/vite-plugin](https://docs.sentry.io/platforms/javascript/sourcemaps/uploading/vite/)** | Upload automático de source maps para o Sentry no build de produção. Ativado apenas quando `SENTRY_AUTH_TOKEN`, `SENTRY_ORG` e `SENTRY_PROJECT` estão definidos |
| **[rollup-plugin-visualizer](https://github.com/btd/rollup-plugin-visualizer)**                   | Gera `dist/stats.html` com análise visual do bundle. Ativado com `pnpm build:analyze`                                                                           |
| **[@tailwindcss/vite](https://tailwindcss.com/docs/vite)**                                        | Plugin oficial do Tailwind 4 para Vite                                                                                                                          |
| **[@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react)**                           | Suporte ao Fast Refresh e JSX transform do React                                                                                                                |

---

## Bibliotecas de Teste

O projeto tem **duas camadas de teste** independentes e complementares.

### Camada 1 — Testes Unitários e de Integração (Vitest)

Executados com `pnpm test`. Rodam em ambiente jsdom (DOM simulado), sem browser real.

| Biblioteca                                                                                  | O que faz                                                                                                                                                                                               |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **[Vitest](https://vitest.dev/)**                                                           | Test runner compatível com a API do Jest, integrado ao Vite. Usa o mesmo pipeline de transformação — TypeScript e aliases de path funcionam sem configuração extra. Cobertura com `@vitest/coverage-v8` |
| **[@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/)** | Renderiza componentes em jsdom e expõe queries semânticas (`getByRole`, `getByText`, `getByLabelText`). Filosofia: testar comportamento do usuário, não detalhes de implementação                       |
| **[@testing-library/jest-dom](https://github.com/testing-library/jest-dom)**                | Matchers customizados para o DOM: `toBeInTheDocument()`, `toHaveAttribute()`, `toBeVisible()`. Torna os `expect` mais legíveis e os erros mais descritivos                                              |
| **[@testing-library/user-event](https://testing-library.com/docs/user-event/intro/)**       | Simula interações reais do usuário (clique, digitação, Tab, Escape) de forma mais fiel que `fireEvent`. Essencial para testar fluxos de acessibilidade por teclado                                      |
| **[jsdom](https://github.com/jsdom/jsdom)**                                                 | Implementação do DOM em Node.js. Ambiente de execução dos testes unitários                                                                                                                              |
| **[@vitest/ui](https://vitest.dev/guide/ui)**                                               | Interface visual no browser para explorar e rodar testes interativamente (`pnpm test:ui`)                                                                                                               |
| **[@vitest/coverage-v8](https://vitest.dev/guide/coverage)**                                | Relatório de cobertura de código. Threshold mínimo configurado: **80% em branches, funções, linhas e statements**                                                                                       |

**Arquivo de setup** ([src/test/setup.ts](src/test/setup.ts)):

- Importa `@testing-library/jest-dom` para os matchers DOM
- Chama `cleanup()` após cada teste
- Mock de `window.matchMedia` (não existe no jsdom)
- Mock de `IntersectionObserver` (não existe no jsdom)

**Utilitários de teste** ([src/test/test-utils.ts](src/test/test-utils.ts)):

- Exporta `customRender` com wrapper configurável para Context/Provider
- Re-exporta tudo do `@testing-library/react`
- Exporta `userEvent` para simulação de interações

### Camada 2 — Testes End-to-End (Playwright)

Executados com `pnpm test:e2e`. Rodam em browsers reais.

| Biblioteca                                                                                             | O que faz                                                                                                                     |
| ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| **[@playwright/test](https://playwright.dev/)**                                                        | Framework E2E que controla browsers reais (Chromium, WebKit, Firefox). Testa fluxos completos como o usuário experimenta      |
| **[@axe-core/playwright](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright)** | Integração do motor de acessibilidade Axe com Playwright. Roda análise automática de violações WCAG 2.1 durante os testes E2E |
| **[@lhci/cli](https://github.com/GoogleChrome/lighthouse-ci)**                                         | Lighthouse CI — audita performance, acessibilidade, SEO e boas práticas em ambiente de CI/CD                                  |
| **[dotenv-cli](https://github.com/entropitor/dotenv-cli)**                                             | Injeta variáveis de ambiente de arquivos `.env` específicos nos scripts npm                                                   |

**Browsers configurados no Playwright:**

| Projeto         | Device         |
| --------------- | -------------- |
| `chromium`      | Desktop Chrome |
| `webkit`        | Desktop Safari |
| `Mobile Chrome` | Pixel 5        |
| `Mobile Safari` | iPhone 12      |

**Configurações do Playwright:**

- `baseURL`: `http://localhost:5173` (ou `PLAYWRIGHT_BASE_URL`)
- `timeout` por teste: 60 segundos
- `navigationTimeout`: 30 segundos
- `actionTimeout`: 15 segundos
- `trace`: capturado na primeira falha
- `screenshot`: apenas em falha
- `video`: retido em falha
- Em CI: `retries: 2`, `workers: 1`, execução sequencial (não paralela)

**Suites de teste E2E disponíveis:**

```
tests/
└── seo/
    ├── README.md                    # Documentação detalhada de cada suite
    ├── accessibility.spec.ts        # Conformidade WCAG 2.1 AA com axe-core
    ├── metadata.spec.ts             # Meta tags, Open Graph, Twitter Cards
    ├── performance-keywords.spec.ts # Core Web Vitals e qualidade de conteúdo
    └── semantic-html.spec.ts        # Estrutura HTML semântica
```

---

## Componentes Inclusos

O template vem com componentes prontos para uso ou customização, organizados por categoria.

### UI Primitivos (`src/components/ui/`)

| Componente               | Arquivo             | Descrição                                                                                                                                                        |
| ------------------------ | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`                 | `Button.tsx`        | Botão com variantes `primary`, `secondary`, `ghost`, `danger` e tamanhos `sm`, `md`, `lg`. Estado `loading` com spinner embutido. Suporta `ref` via `forwardRef` |
| `AccessibleButton`       | `Accessibility.tsx` | Botão com ARIA completo — `aria-label`, `aria-disabled`, estado de loading com texto acessível. Variantes `primary`, `secondary`, `ghost`                        |
| `AccessibleLink`         | `Accessibility.tsx` | Link com `aria-current` para navegação ativa, ícone automático para links externos, `rel="noopener noreferrer"` automático em `external={true}`                  |
| `SkipLink`               | `Accessibility.tsx` | Link "pular para conteúdo" visível apenas no foco — requisito WCAG 2.4.1. Posicionado com `z-index` alto para ficar acima de qualquer overlay                    |
| `MainContent`            | `Accessibility.tsx` | Wrapper `<main>` com `id="main-content"`, `tabIndex={-1}` e `focus:outline-none` — alvo do SkipLink                                                              |
| `ScreenReaderOnly`       | `Accessibility.tsx` | Envolve conteúdo em `sr-only` para leitores de tela. Suporta `asChild` para aplicar a classe a um elemento filho existente                                       |
| `LoadingSpinner`         | `Loading.tsx`       | Spinner SVG animado com `role="status"` e `aria-label`. Tamanhos `sm`, `md`, `lg`                                                                                |
| `SectionSkeleton`        | `Loading.tsx`       | Skeleton de seção com `animate-pulse` — 3 cards com header, descrição e linhas de conteúdo. Usado como fallback de `Suspense`                                    |
| `PlayIcon` / `PauseIcon` | `icons/`            | Ícones SVG inline com `aria-hidden="true"`                                                                                                                       |

### Layout (`src/components/layout/`)

| Componente  | Arquivo         | Descrição                                                                                                                          |
| ----------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `Container` | `Container.tsx` | Wrapper centralizado com padding responsivo. Prop `size`: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px, padrão), `full` |

### SEO (`src/components/seo/`)

| Componente           | Arquivo                  | Descrição                                                                                                          |
| -------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `JsonLdScript`       | `JsonLdScript.tsx`       | Injeta `<script type="application/ld+json">` com sanitização de `</script>` para evitar XSS. Suporta `prettyPrint` |
| `OrganizationSchema` | `OrganizationSchema.tsx` | Gera schemas `Organization` e `WebSite` a partir de `companyInfo.ts`. Filtra links sociais com placeholder         |
| `BreadcrumbSchema`   | `OrganizationSchema.tsx` | Gera `BreadcrumbList` a partir de array `{ name, url }[]`. Último item sem URL (página atual)                      |
| `ArticleSchema`      | `OrganizationSchema.tsx` | Schema `Article` para posts de blog com `datePublished`, `dateModified` e `author`                                 |
| `ProductSchema`      | `OrganizationSchema.tsx` | Schema `Product` com oferta de preço e `AggregateRating` opcionais                                                 |
| `FAQSchema`          | `OrganizationSchema.tsx` | Schema `FAQPage` a partir de array `{ question, answer }[]`                                                        |

### Dados (`src/components/data/`)

| Arquivo          | Descrição                                                                                                                                                                    |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `companyInfo.ts` | Centraliza dados da empresa/projeto. **Preencher antes do primeiro deploy.** Exporta helpers: `hasPlaceholderData()`, `getFullAddress()`, `getSocialLinks()`, `formatCNPJ()` |

### Erros (`src/components/error/`)

| Componente             | Descrição                                                                                                                                                                                                                                                 |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ErrorBoundary`        | Captura erros React. Em produção: envia para Sentry com contexto (componentStack, URL, userAgent). Em dev: loga no console. Aceita `fallback` estático ou render prop `(error, resetError) => ReactNode`. Botões "Tentar novamente" e "Recarregar página" |
| `SectionErrorFallback` | Fallback compacto para usar como `fallback` do `ErrorBoundary` em seções individuais                                                                                                                                                                      |

### Utilitários (`src/utils/`)

| Função                       | Arquivo              | Descrição                                                                                                                                            |
| ---------------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cn(...inputs)`              | `cn.ts`              | Combina classes Tailwind com `clsx` + `tailwind-merge`. Resolve conflitos de classes                                                                 |
| `reportWebVitals(callback?)` | `reportWebVitals.ts` | Registra LCP, INP, CLS, FCP, TTFB. Sem callback: em dev loga no console, em prod envia para `window.gtag` e `navigator.sendBeacon('/api/analytics')` |

### Biblioteca (`src/lib/`)

| Função         | Arquivo     | Descrição                                                                                                                                                                                             |
| -------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `initSentry()` | `sentry.ts` | Inicializa Sentry com `browserTracingIntegration` e `replayIntegration`. Filtra erros de extensões do browser e scripts externos (Google, Facebook, analytics). Configurado via variáveis de ambiente |

---

## Estrutura do Projeto

A estrutura atual do template (o que já existe) e a estrutura recomendada para expansão.

```
react-vite-template/
├── public/                          # Assets estáticos servidos diretamente
│   ├── robots.txt
│   └── sitemap.xml
│
├── scripts/
│   └── pre-deploy-validation.sh     # type-check + lint + cobertura + build
│
├── docs/                            # Documentação técnica
│   ├── ARCHITECTURE.md              # Stack e decisões arquiteturais
│   ├── BETTER-AUTH-GUIDE.md         # Guia de autenticação
│   ├── CHANGELOG.md                 # Histórico de versões
│   ├── CONTRIBUTING.md              # Guia de contribuição
│   ├── FOLDER-STRUCTURE.md          # Convenções de estrutura para escalar
│   ├── SETUP-GUIDE.md               # Guia completo de configuração
│   └── TESTES-SEO.md                # Guia dos testes de SEO e acessibilidade
│
├── tests/                           # Testes E2E com Playwright
│   └── seo/
│       ├── README.md
│       ├── accessibility.spec.ts
│       ├── metadata.spec.ts
│       ├── performance-keywords.spec.ts
│       └── semantic-html.spec.ts
│
├── src/
│   ├── main.tsx                     # Entry point — inicializa Sentry e Web Vitals em produção
│   ├── App.tsx                      # Componente raiz com meta tags nativas do React 19
│   ├── index.css                    # Estilos globais + @import Tailwind 4
│   │
│   ├── components/
│   │   ├── data/
│   │   │   ├── companyInfo.ts       # Dados da empresa — CUSTOMIZAR ANTES DO DEPLOY
│   │   │   ├── index.ts
│   │   │   └── __tests__/
│   │   ├── error/
│   │   │   ├── ErrorBoundary.tsx    # Error boundary com integração Sentry
│   │   │   ├── SectionErrorFallback.tsx
│   │   │   ├── index.ts
│   │   │   └── __tests__/
│   │   ├── layout/
│   │   │   ├── Container.tsx        # Container responsivo com variantes de tamanho
│   │   │   ├── index.ts
│   │   │   └── __tests__/
│   │   ├── seo/
│   │   │   ├── JsonLdScript.tsx     # Injeção segura de JSON-LD
│   │   │   ├── OrganizationSchema.tsx  # Organization, Breadcrumb, Article, Product, FAQ
│   │   │   ├── index.ts
│   │   │   └── __tests__/
│   │   └── ui/
│   │       ├── Accessibility.tsx    # SkipLink, MainContent, ScreenReaderOnly, AccessibleButton, AccessibleLink
│   │       ├── Button.tsx           # Botão base com variantes e estados
│   │       ├── Loading.tsx          # LoadingSpinner + SectionSkeleton
│   │       ├── index.ts
│   │       └── icons/
│   │           ├── PlayIcon.tsx
│   │           ├── PauseIcon.tsx
│   │           ├── index.ts
│   │           └── __tests__/
│   │
│   ├── lib/
│   │   ├── sentry.ts                # initSentry() com filtros de erros
│   │   └── __tests__/
│   │
│   ├── test/
│   │   ├── setup.ts                 # Mocks de matchMedia e IntersectionObserver
│   │   └── test-utils.ts            # customRender + re-exports do testing-library
│   │
│   ├── types/
│   │   ├── accessibility.ts         # Tipos base para componentes de acessibilidade
│   │   └── global.d.ts              # Declarações globais (window.gtag, etc)
│   │
│   └── utils/
│       ├── cn.ts                    # clsx + tailwind-merge
│       ├── reportWebVitals.ts       # Coleta e envio de Core Web Vitals
│       └── __tests__/
│
├── .env.example                     # Modelo de variáveis (commitar)
├── .env.local                       # Variáveis locais (NÃO commitar)
├── .husky/
│   ├── pre-commit                   # lint-staged + type-check
│   └── pre-push                     # vitest run
├── .lintstagedrc.json
├── .prettierrc
├── .prettierignore
├── .vscode/
│   ├── extensions.json              # Extensões recomendadas
│   └── settings.json
├── eslint.config.js
├── index.html
├── LICENSE
├── package.json
├── playwright.config.ts
├── pnpm-lock.yaml
├── tsconfig.json
├── tsconfig.app.json                # Config do código fonte
├── tsconfig.node.json               # Config de arquivos de config (vite.config.ts, etc)
├── tsconfig.test.json               # Config dos testes
├── vite.config.ts
└── vitest.config.ts
```

### Path Aliases configurados

| Alias         | Aponta para       |
| ------------- | ----------------- |
| `@`           | `src/`            |
| `@components` | `src/components/` |
| `@features`   | `src/features/`   |
| `@hooks`      | `src/hooks/`      |
| `@utils`      | `src/utils/`      |
| `@assets`     | `src/assets/`     |
| `@types`      | `src/types/`      |
| `@lib`        | `src/lib/`        |
| `@services`   | `src/services/`   |

Aliases configurados em `tsconfig.app.json`, `tsconfig.test.json` e `vite.config.ts` / `vitest.config.ts`.

---

## Primeiros Passos (Quick Start)

### Pré-requisitos

- Node.js >= 20
- pnpm >= 9 (`npm install -g pnpm`)

### Usando como template

```bash
# Clone e reinicie o histórico git
git clone https://github.com/seu-usuario/react-vite-template.git meu-projeto
cd meu-projeto
rm -rf .git
git init

# Instale as dependências
pnpm install

# Copie o arquivo de ambiente
cp .env.example .env.local

# Inicie o dev server
pnpm dev
```

Acesse `http://localhost:5173`.

### Checklist de customização inicial

1. **`package.json`** — atualizar `name`, `description` e `author`
2. **`src/components/data/companyInfo.ts`** — preencher dados da empresa antes de qualquer deploy
3. **`index.html`** — atualizar `og:url`, `og:image` e `canonical`
4. **`public/robots.txt`** — atualizar URL do sitemap
5. **`public/sitemap.xml`** — atualizar URL e datas
6. **`.env.local`** — configurar `VITE_SENTRY_DSN` se usar Sentry
7. **`src/App.tsx`** — substituir pelo componente raiz do projeto real

---

## Configuração do Projeto

### TypeScript — tsconfig.app.json

Modo strict completo:

```json
{
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noFallthroughCasesInSwitch": true
}
```

O projeto tem 3 tsconfigs separados:

- **`tsconfig.app.json`** — código fonte (`src/`), exclui arquivos de teste
- **`tsconfig.test.json`** — testes unitários, inclui `@types/vitest`
- **`tsconfig.node.json`** — arquivos de configuração (`vite.config.ts`, `vitest.config.ts`, `playwright.config.ts`)

### Tailwind CSS 4

Tailwind 4 funciona sem `tailwind.config.js`. A configuração é feita via CSS:

```css
/* src/index.css */
@import 'tailwindcss';

@theme {
  --color-primary-600: #3b82f6; /* substitua pelas cores do projeto */
}
```

Para definir cores customizadas, breakpoints ou tokens de design, use a diretiva `@theme` no CSS.

### Vite — vite.config.ts

Configuração principal:

- **Plugins**: Tailwind, React, Sentry (condicional), Visualizer (condicional)
- **Aliases**: `@`, `@components`, `@features`, etc.
- **Build**: target `es2022`, source maps `hidden` em produção, CSS code split ativado
- **Code splitting manual**: `vendor-react` (React + ReactDOM) e `vendor-sentry` (@sentry/react)
- **Dev server**: porta `5173`, `open: true`, `host: true`
- **Preview server**: porta `4173`, `host: true`

O plugin Sentry só é ativado quando as três variáveis de ambiente estão presentes: `SENTRY_AUTH_TOKEN`, `SENTRY_ORG` e `SENTRY_PROJECT`.

---

## Variáveis de Ambiente

Copie `.env.example` para `.env.local` e preencha conforme necessário.

| Variável                                   | Obrigatória | Descrição                                                 |
| ------------------------------------------ | ----------- | --------------------------------------------------------- |
| `VITE_APP_NAME`                            | Não         | Nome da aplicação                                         |
| `VITE_APP_ENV`                             | Não         | Ambiente atual (`development`, `production`)              |
| `VITE_API_URL`                             | Não         | URL base da API                                           |
| `VITE_SENTRY_DSN`                          | Produção    | DSN do projeto no Sentry para error tracking              |
| `VITE_SENTRY_ENVIRONMENT`                  | Produção    | Ambiente no Sentry. Padrão: `production`                  |
| `VITE_SENTRY_TRACES_SAMPLE_RATE`           | Não         | Taxa de amostragem de traces. Padrão: `1.0`               |
| `VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE`  | Não         | Amostragem de Session Replay. Padrão: `0.1`               |
| `VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE` | Não         | Amostragem de Replay em erros. Padrão: `1.0`              |
| `VITE_GA_MEASUREMENT_ID`                   | Não         | ID do Google Analytics 4                                  |
| `VITE_FEATURE_NEW_UI`                      | Não         | Feature flag para nova UI. Padrão: `false`                |
| `VITE_FEATURE_BETA`                        | Não         | Feature flag para features beta. Padrão: `false`          |
| `SENTRY_AUTH_TOKEN`                        | CI/CD       | Token para upload de source maps no build                 |
| `SENTRY_ORG`                               | CI/CD       | Slug da organização no Sentry                             |
| `SENTRY_PROJECT`                           | CI/CD       | Nome do projeto no Sentry                                 |
| `VITE_APP_VERSION`                         | CI/CD       | Versão da release para o Sentry                           |
| `PLAYWRIGHT_BASE_URL`                      | Não         | URL base para testes E2E. Padrão: `http://localhost:5173` |

---

## Scripts Disponíveis

### Desenvolvimento

| Comando              | Descrição                                                 |
| -------------------- | --------------------------------------------------------- |
| `pnpm dev`           | Servidor de desenvolvimento com HMR em `localhost:5173`   |
| `pnpm build`         | Build de produção (`tsc -b && vite build`)                |
| `pnpm build:analyze` | Build + abre `dist/stats.html` com visualização do bundle |
| `pnpm preview`       | Serve a build de produção localmente na porta `4173`      |
| `pnpm type-check`    | Verifica tipos TypeScript sem emitir arquivos             |

### Qualidade de Código

| Comando             | Descrição                                               |
| ------------------- | ------------------------------------------------------- |
| `pnpm lint`         | ESLint — falha em qualquer warning (`--max-warnings 0`) |
| `pnpm lint:fix`     | ESLint com correção automática                          |
| `pnpm format`       | Prettier — formata todos os arquivos em `src/`          |
| `pnpm format:check` | Prettier — verifica formatação sem alterar arquivos     |

### Testes Unitários (Vitest)

| Comando              | Descrição                                                  |
| -------------------- | ---------------------------------------------------------- |
| `pnpm test`          | Executa todos os testes unitários uma vez (run mode)       |
| `pnpm test:run`      | Alias para `test` — usado em scripts de CI                 |
| `pnpm test:watch`    | Modo watch — reexecuta testes ao salvar                    |
| `pnpm test:coverage` | Executa com relatório de cobertura (threshold mínimo 80%)  |
| `pnpm test:ui`       | Interface visual no browser para explorar e debugar testes |

### Testes E2E (Playwright)

| Comando                     | Descrição                                     |
| --------------------------- | --------------------------------------------- |
| `pnpm test:e2e`             | Testes E2E em todos os browsers configurados  |
| `pnpm test:e2e:ui`          | Testes E2E com interface visual do Playwright |
| `pnpm test:e2e:headed`      | Testes com browser visível (útil para debug)  |
| `pnpm test:e2e:debug`       | Testes no modo debug do Playwright            |
| `pnpm test:seo`             | Todas as 4 suites de SEO com relatório HTML   |
| `pnpm test:seo:metadata`    | Apenas testes de meta tags e Open Graph       |
| `pnpm test:seo:semantic`    | Apenas testes de HTML semântico               |
| `pnpm test:seo:a11y`        | Apenas testes de acessibilidade WCAG          |
| `pnpm test:seo:performance` | Apenas testes de Core Web Vitals e keywords   |
| `pnpm test:all`             | Testes unitários + E2E                        |

### Deploy e Análise

| Comando           | Descrição                                                                 |
| ----------------- | ------------------------------------------------------------------------- |
| `pnpm pre-deploy` | Validação completa antes do deploy: type-check + lint + cobertura + build |
| `pnpm lighthouse` | Lighthouse CI via `lhci autorun`                                          |
| `pnpm analyze`    | Alias para `build:analyze`                                                |

---

## Arquitetura e Decisões Técnicas

### Entry Point (`src/main.tsx`)

```tsx
// Sentry e Web Vitals inicializados apenas em produção
if (import.meta.env.PROD) {
  initSentry()
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

if (import.meta.env.PROD) {
  reportWebVitals()
}
```

### Meta Tags com React 19

React 19 suporta `<title>`, `<meta>` e `<link>` diretamente no JSX, sem bibliotecas externas:

```tsx
function App() {
  return (
    <>
      <title>Minha Página</title>
      <meta name='description' content='Descrição SEO' />
      <meta property='og:title' content='Minha Página' />

      <Container>{/* conteúdo */}</Container>
    </>
  )
}
```

### Code Splitting Manual

O `vite.config.ts` divide o bundle em chunks nomeados:

```typescript
rollupOptions: {
  output: {
    manualChunks: {
      'vendor-react': ['react', 'react-dom'],   // cache longo, raramente muda
      'vendor-sentry': ['@sentry/react'],        // separado para não impactar o bundle principal
    },
  },
},
```

Cada componente lazy carregado com `React.lazy()` vira automaticamente seu próprio chunk.

### Utilitário `cn()`

Combina `clsx` + `tailwind-merge` para composição segura de classes Tailwind:

```typescript
import { cn } from '@utils/cn'

// Resolve conflitos: p-4 é descartado, p-2 vence
cn('p-4 bg-blue-500', condition && 'p-2', 'text-white')
// → 'bg-blue-500 p-2 text-white'
```

### companyInfo.ts — Dado centralizado

Todos os dados da empresa (nome, URL, endereço, contatos, redes sociais) ficam em um único arquivo:

```typescript
// src/components/data/companyInfo.ts
export const COMPANY_INFO = { ... } as const

// Funções helpers exportadas:
export const hasPlaceholderData = (): boolean => ...   // detecta dados ainda não preenchidos
export const getFullAddress = (): string => ...        // formata endereço completo
export const getSocialLinks = () => ...                // filtra links sem placeholder
export const formatCNPJ = (cnpj: string): string => ...
```

Usado por: `OrganizationSchema`, seções de contato, rodapé e `scripts/pre-deploy-validation.sh`.

---

## Acessibilidade

O projeto segue a **WCAG 2.1 Nível AA** como padrão mínimo.

### Componentes de Acessibilidade (`src/components/ui/Accessibility.tsx`)

| Componente         | Props principais                            | Finalidade                                                                        |
| ------------------ | ------------------------------------------- | --------------------------------------------------------------------------------- |
| `SkipLink`         | `href`, `children`                          | Link visível no foco que pula para o conteúdo principal — WCAG 2.4.1              |
| `MainContent`      | `id`, `className`                           | `<main>` com `id="main-content"` e `tabIndex={-1}` para receber foco via SkipLink |
| `ScreenReaderOnly` | `asChild?`                                  | Conteúdo visível apenas para leitores de tela                                     |
| `AccessibleButton` | `variant`, `size`, `loading`, `loadingText` | Botão com `aria-disabled` e `aria-label` em estado de loading                     |
| `AccessibleLink`   | `external?`, `isCurrent?`, `ariaCurrent?`   | Link com `aria-current` para navegação e ícone automático em links externos       |

### Tipos de acessibilidade (`src/types/accessibility.ts`)

Define a interface base `AccessibilityProps` com `aria-label`, `aria-labelledby`, `aria-describedby`, `role` e `tabIndex` — estendida por todos os componentes acessíveis.

### Validação automática

- **ESLint** (`eslint-plugin-jsx-a11y`): detecta violações de acessibilidade durante desenvolvimento
- **Testes E2E** (`tests/seo/accessibility.spec.ts`): roda o motor axe-core em browser real

### Padrões garantidos

- HTML semântico: `<main>`, `<header>`, `<footer>`, `<nav>`, `<section>`, `<article>`
- Focus visible em todos os elementos focáveis
- ARIA labels em elementos interativos
- Navegação por teclado (Tab, Shift+Tab, Enter, Espaço, Escape)
- Contraste mínimo 4.5:1

---

## SEO e Dados Estruturados

### Meta tags

Gerenciadas com as capacidades nativas do React 19 diretamente em `App.tsx` ou em cada página.

### JSON-LD (Dados Estruturados)

Componentes em `src/components/seo/` injetam Schema.org via `<script type="application/ld+json">`:

| Schema                     | Componente           | Uso                                                                      |
| -------------------------- | -------------------- | ------------------------------------------------------------------------ |
| `Organization` + `WebSite` | `OrganizationSchema` | Dados da empresa para Knowledge Panel do Google. Usar no componente raiz |
| `BreadcrumbList`           | `BreadcrumbSchema`   | Navegação estruturada em páginas internas                                |
| `Article`                  | `ArticleSchema`      | Posts de blog com data, autor e publisher                                |
| `Product`                  | `ProductSchema`      | Produtos com preço, disponibilidade e avaliações                         |
| `FAQPage`                  | `FAQSchema`          | Perguntas frequentes com rich results no Google                          |

```tsx
// Exemplo de uso em App.tsx
import { OrganizationSchema } from '@components/seo'

function App() {
  return (
    <>
      <title>Minha Empresa</title>
      <OrganizationSchema />
      {/* conteúdo */}
    </>
  )
}
```

### robots.txt e sitemap.xml

Arquivos em `public/` servidos diretamente. Atualizar as URLs antes do deploy.

### Testes de SEO

```bash
pnpm test:seo        # todas as 4 suites
pnpm test:seo:metadata    # meta tags e Open Graph
pnpm test:seo:semantic    # HTML semântico
pnpm test:seo:a11y        # acessibilidade WCAG 2.1
pnpm test:seo:performance # Core Web Vitals
```

Consulte [tests/seo/README.md](tests/seo/README.md) para a documentação completa de cada suite.

---

## Monitoramento de Erros (Sentry)

Configurado em `src/lib/sentry.ts`, inicializado em `src/main.tsx` **apenas em produção**.

### Features ativas

- `browserTracingIntegration()` — rastreamento de performance e transações
- `replayIntegration()` — Session Replay com `maskAllText` e `blockAllMedia` habilitados por privacidade

### Filtros configurados

O `beforeSend` ignora automaticamente:

- Erros que contenham `"extension"` ou `"chrome-extension"` no valor
- Erros cujo stack trace contenha `"google"`, `"facebook"` ou `"analytics"`

### ErrorBoundary integrado

O componente `ErrorBoundary` captura erros React e os envia para o Sentry em produção com contexto adicional:

```typescript
scope.setContext('errorInfo', {
  componentStack: errorInfo.componentStack,
  timestamp: new Date().toISOString(),
  userAgent: navigator.userAgent,
  url: window.location.href,
})
```

### Source maps

O `@sentry/vite-plugin` faz o upload de source maps durante o build de produção e **remove os arquivos `.map`** do `dist/` após o upload para não expor o código fonte.

---

## Performance (Core Web Vitals)

Coleta automática via `src/utils/reportWebVitals.ts`, inicializado em `main.tsx` **apenas em produção**.

### Métricas coletadas

| Métrica                             | Meta (Good) | O que mede                                           |
| ----------------------------------- | ----------- | ---------------------------------------------------- |
| **LCP** (Largest Contentful Paint)  | < 2.5s      | Velocidade de carregamento do maior elemento visível |
| **INP** (Interaction to Next Paint) | < 200ms     | Responsividade às interações do usuário              |
| **CLS** (Cumulative Layout Shift)   | < 0.1       | Estabilidade visual durante o carregamento           |
| **FCP** (First Contentful Paint)    | < 1.8s      | Tempo até o primeiro conteúdo aparecer               |
| **TTFB** (Time to First Byte)       | < 800ms     | Tempo de resposta do servidor                        |

### Destinos de envio

Por padrão, em produção, os dados são enviados para:

1. **Google Analytics** (`window.gtag`) — se o script do GA estiver carregado
2. **Endpoint próprio** (`navigator.sendBeacon('/api/analytics')`) — substitua pelo seu endpoint

Para personalizar, substitua a função `sendToAnalytics` em `src/utils/reportWebVitals.ts` ou passe um callback:

```typescript
// main.tsx — enviar para Sentry diretamente
reportWebVitals(metric => {
  Sentry.captureMessage(`Web Vital: ${metric.name}`, {
    level: 'info',
    extra: metric,
  })
})
```

### Análise de bundle

```bash
pnpm build:analyze
# Abre dist/stats.html com visualização do bundle (gzip + brotli)
```

---

## Qualidade de Código

### ESLint (`eslint.config.js`)

Configuração com **3 contextos separados** — código fonte, testes unitários e testes E2E — cada um com regras adequadas ao seu contexto.

**Plugins ativos no código fonte:**

| Plugin                                | Foco                                                                   |
| ------------------------------------- | ---------------------------------------------------------------------- |
| `@typescript-eslint`                  | Regras TypeScript                                                      |
| `eslint-plugin-react` + `react-hooks` | Padrões React e regras de hooks                                        |
| `react-refresh`                       | Fast Refresh no dev server                                             |
| `eslint-plugin-jsx-a11y`              | Acessibilidade em JSX                                                  |
| `eslint-plugin-sonarjs`               | Code smells (complexidade cognitiva, duplicação, expressões idênticas) |
| `eslint-plugin-unicorn`               | Boas práticas modernas (prefer-array-find, better-regex, no-for-loop)  |
| `eslint-plugin-security`              | Vulnerabilidades de segurança (unsafe-regex, buffer-noassert)          |
| `eslint-plugin-unused-imports`        | Remove imports não utilizados automaticamente                          |
| `eslint-plugin-prettier`              | Formata com Prettier como regra de lint                                |

**Limites de complexidade (código fonte):**

| Regra                          | Limite                     |
| ------------------------------ | -------------------------- |
| `max-lines`                    | 500 linhas por arquivo     |
| `max-lines-per-function`       | 80 linhas por função       |
| `max-params`                   | 5 parâmetros por função    |
| `complexity`                   | 10 (cyclomatic complexity) |
| `max-depth`                    | 4 níveis de aninhamento    |
| `max-nested-callbacks`         | 3 callbacks aninhados      |
| `sonarjs/cognitive-complexity` | 10                         |

**Tolerância zero:** `--max-warnings 0` — qualquer warning é tratado como erro.

### Prettier (`.prettierrc`)

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "jsxSingleQuote": true,
  "plugins": [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss"
  ]
}
```

**Plugins do Prettier:**

- `@trivago/prettier-plugin-sort-imports` — ordena imports: `react` → `react-dom` → pacotes externos → imports internos (`./`)
- `prettier-plugin-tailwindcss` — ordena classes Tailwind segundo a ordem recomendada pelo Tailwind

### Git Hooks (Husky + lint-staged)

**`git commit`** — executa lint-staged + type-check:

```
.lintstagedrc.json
├── *.{js,jsx,ts,tsx}     → eslint --fix + prettier --write
└── *.{json,md,css,html}  → prettier --write
```

Após lint-staged, o hook executa `pnpm type-check` para garantir que tipos TypeScript estejam corretos.

**`git push`** — executa todos os testes unitários:

```bash
pnpm run test
# Se falhar → push é bloqueado com mensagem de erro
```

---

## Deploy e Produção

### Validação pré-deploy

```bash
pnpm pre-deploy
```

O script `scripts/pre-deploy-validation.sh` executa em sequência:

1. `pnpm type-check` — zero erros TypeScript
2. `pnpm lint` — zero warnings/erros ESLint
3. `pnpm test:coverage` — todos os testes passando com cobertura >= 80%
4. `pnpm build` — build de produção bem-sucedido

### Build de produção

```bash
pnpm build
# Artefatos gerados em dist/:
# ├── assets/
# │   ├── index-[hash].js         (código da aplicação)
# │   ├── index-[hash].css        (estilos)
# │   ├── vendor-react-[hash].js  (React + ReactDOM)
# │   └── vendor-sentry-[hash].js (@sentry/react)
# ├── index.html
# ├── robots.txt
# └── sitemap.xml
```

### Deploy em plataformas populares

**Vercel:**

```bash
pnpm add -g vercel
vercel
```

**Netlify:**

- Build command: `pnpm build`
- Publish directory: `dist`

Para configurar headers de segurança (X-Frame-Options, CSP, etc.), consulte [docs/SETUP-GUIDE.md](docs/SETUP-GUIDE.md).

### Checklist pré-deploy

```bash
pnpm pre-deploy          # Validações automáticas completas
pnpm test:e2e            # Testes E2E em todos os browsers
pnpm test:seo            # SEO, acessibilidade e performance
```

- [ ] Dados em `src/components/data/companyInfo.ts` preenchidos
- [ ] `VITE_SENTRY_DSN` configurado no ambiente de produção
- [ ] `index.html` com URLs corretas de Open Graph e canonical
- [ ] `public/robots.txt` e `public/sitemap.xml` atualizados
- [ ] Lighthouse score > 90 em todas as categorias

---

## Documentação Adicional

| Documento                                              | Conteúdo                                                         |
| ------------------------------------------------------ | ---------------------------------------------------------------- |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)           | Decisões arquiteturais e justificativas da stack                 |
| [docs/SETUP-GUIDE.md](docs/SETUP-GUIDE.md)             | Guia completo de configuração e customização                     |
| [docs/FOLDER-STRUCTURE.md](docs/FOLDER-STRUCTURE.md)   | Convenções e padrões para escalar de landing page a app complexa |
| [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)           | Guia de contribuição e padrões de commit                         |
| [docs/CHANGELOG.md](docs/CHANGELOG.md)                 | Histórico de versões                                             |
| [docs/BETTER-AUTH-GUIDE.md](docs/BETTER-AUTH-GUIDE.md) | Guia de autenticação com Better Auth                             |
| [docs/TESTES-SEO.md](docs/TESTES-SEO.md)               | Guia das suites de testes de SEO e acessibilidade                |
| [tests/seo/README.md](tests/seo/README.md)             | Documentação detalhada de cada suite de teste E2E                |

---

## Licença

Este projeto está sob a licença MIT — veja [LICENSE](LICENSE) para detalhes.
