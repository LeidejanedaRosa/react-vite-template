# Arquitetura do Template

Documentação da stack tecnológica e decisões arquiteturais do template.

**Última atualização:** 22 de maio de 2026

---

## Índice

- [Core Stack](#core-stack)
- [Qualidade de Código](#qualidade-de-código)
- [Testes](#testes)
- [Monitoramento e Performance](#monitoramento-e-performance)
- [Build e Otimização](#build-e-otimização)
- [Princípios da Arquitetura](#princípios-da-arquitetura)
- [Próximos Passos (ao escalar)](#próximos-passos-ao-escalar)

---

## Core Stack

### React 19

**Para que serve:** Biblioteca JavaScript para construção de interfaces de usuário.

**Por que foi escolhida:**

- **Meta tags nativas:** React 19 introduziu suporte nativo a `<title>`, `<meta>`, `<link>` e `<script>` diretamente no JSX — elimina a necessidade de bibliotecas como `react-helmet` ou `react-helmet-async`
- **Performance melhorada:** Novas otimizações no rendering e reconciliação
- **TypeScript mais preciso:** Tipos mais exatos e melhor inferência de tipos genéricos
- **StrictMode mais rigoroso:** Detecta mais problemas durante desenvolvimento

**Versão:** 19.x

---

### Vite 6

**Para que serve:** Build tool e dev server.

**Por que foi escolhida:**

- **HMR instantâneo:** Hot Module Replacement usando ESM nativo — feedback em < 100ms
- **Build com Rollup:** Code splitting automático, tree-shaking e otimizações de produção
- **Configuração mínima:** Funciona com zero config para React + TypeScript
- **Ecossistema rico:** Plugins para Tailwind, Sentry, PWA, visualizer e mais
- **Dev server rápido:** Não empacota o código fonte durante desenvolvimento

**Versão:** 6.x

---

### TypeScript 5.7

**Para que serve:** Tipagem estática sobre JavaScript.

**Por que foi escolhida:**

- **Strict mode completo:** `strict: true`, `noUnusedLocals`, `noUnusedParameters` — detecta mais erros em desenvolvimento
- **Project references:** Três tsconfigs separados (`app`, `test`, `node`) para contextos diferentes
- **Autocompletar:** IDE sabe os tipos de todas as propriedades e funções
- **Documentação viva:** Tipos são a documentação mais confiável — sempre atualizada

**Versão:** 5.7.x

**Três contextos TypeScript:**

| Arquivo              | Escopo                            | Particularidades                                                  |
| -------------------- | --------------------------------- | ----------------------------------------------------------------- |
| `tsconfig.app.json`  | `src/` (exceto testes)            | `emitDeclarationOnly: true`, exclui arquivos de teste             |
| `tsconfig.test.json` | Arquivos `*.test.*` e `src/test/` | Inclui `@types/vitest` via `globals: true` no vitest              |
| `tsconfig.node.json` | Arquivos de configuração          | Para `vite.config.ts`, `vitest.config.ts`, `playwright.config.ts` |

---

### Tailwind CSS 4

**Para que serve:** Framework CSS utility-first.

**Por que foi escolhida:**

- **Engine CSS nativo (v4):** Não precisa de `tailwind.config.js` — configuração via `@theme` em CSS
- **Zero CSS morto:** PurgeCSS integrado remove todas as classes não usadas na build
- **Integração Vite nativa:** Plugin `@tailwindcss/vite` — sem PostCSS manual
- **Consistência:** Sistema de design com spacing, cores e tipografia padronizados
- **Responsividade intuitiva:** `sm:`, `md:`, `lg:`, `xl:` em qualquer utilidade

**Versão:** 4.x

**Configuração de tema:**

```css
/* src/index.css */
@import 'tailwindcss';

@theme {
  /* Defina suas cores, fontes e breakpoints customizados aqui */
  --color-primary-600: #3b82f6;
}
```

---

### pnpm 9

**Para que serve:** Gerenciador de pacotes.

**Por que foi escolhido:**

- **Velocidade:** 2-3x mais rápido que npm em instalações
- **Espaço em disco:** Hard links — pacotes não são duplicados entre projetos
- **Segurança:** Evita dependências fantasma (acesso apenas ao que está declarado)
- **Lockfile confiável:** `pnpm-lock.yaml` mais determinístico
- **Engines no package.json:** Bloqueia uso de npm acidentalmente

**Versão:** 9.x (lockfile version 9)

---

## Qualidade de Código

### Husky 9

**Para que serve:** Gerencia Git hooks para automatizar verificações.

**Hooks configurados:**

**`pre-commit`:**

1. `pnpm exec lint-staged` — lint e formatação nos arquivos modificados
2. `pnpm run type-check` — verifica tipos TypeScript em todo o projeto

**`pre-push`:**

1. `pnpm run test` — executa todos os testes unitários

Se qualquer hook falhar, a operação Git é bloqueada.

---

### ESLint 9

**Para que serve:** Linting para identificar e corrigir problemas no código.

**Por que foi escolhido:**

- **Detecção proativa:** Encontra bugs e problemas antes de chegarem em produção
- **10+ plugins:** Cobertura de TypeScript, React, acessibilidade, segurança, qualidade
- **Zero warnings:** `--max-warnings 0` — não existe "warning ignorável"
- **Três contextos:** Regras diferentes para código fonte, testes unitários e testes E2E

Consulte os plugins ativos em [README.md — Qualidade de Código](../README.md#qualidade-de-código).

---

### Prettier 3

**Para que serve:** Formatador de código opinativo.

**Por que foi escolhido:**

- **Consistência absoluta:** Um formato, sem debate
- **Automático:** Formata no commit via lint-staged
- **Integrado ao ESLint:** `eslint-config-prettier` desabilita regras de formatação do ESLint que conflitam
- **Dois plugins extras:** `sort-imports` para ordenação de imports, `prettier-plugin-tailwindcss` para ordenação de classes

---

### lint-staged

**Para que serve:** Roda linting apenas nos arquivos modificados antes do commit.

**Por que foi escolhido:**

- **Velocidade:** Não precisa verificar o projeto inteiro a cada commit
- **Foco:** Garante que apenas código limpo entre no staging area

**Configuração (`.lintstagedrc.json`):**

```json
{
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md,mdx,css,html,yml,yaml}": ["prettier --write"]
}
```

---

## Testes

### Vitest 4

**Para que serve:** Framework de testes unitários e de integração.

**Por que foi escolhido:**

- **Velocidade:** Usa o mesmo pipeline do Vite — TypeScript e aliases funcionam sem config extra
- **API Jest-compatível:** Migração de projetos Jest é trivial
- **Coverage nativo:** `@vitest/coverage-v8` com thresholds configurados
- **UI mode:** Interface visual no browser para debug (`pnpm test:ui`)
- **Watch inteligente:** Reexecuta apenas testes afetados pela mudança

**Thresholds de cobertura (mínimo 80%):**

```typescript
thresholds: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80,
  },
},
```

**Excluídos da cobertura:** `src/test/`, `src/main.tsx`, `src/types/`, arquivos de teste

---

### Playwright 1

**Para que serve:** Framework de testes end-to-end.

**Por que foi escolhido:**

- **Multi-browser real:** Chromium, WebKit e Mobile — sem emulação de comportamento
- **Confiável:** Auto-waiting elimina `sleep()` nos testes
- **Developer Experience:** Trace viewer, screenshot/video em falhas, code generator
- **Execução paralela:** Por padrão em desenvolvimento (sequencial em CI)
- **Melhor que Cypress:** Suporte a múltiplas abas, iframes, melhor suporte a CI/CD

**4 browsers configurados:** Desktop Chrome, Desktop Safari, Pixel 5 (Chrome), iPhone 12 (Safari)

---

### @axe-core/playwright

**Para que serve:** Motor de acessibilidade automatizada integrado ao Playwright.

**Por que foi escolhido:**

- **Padrão da indústria:** Motor usado pelo Deque Systems, líder em acessibilidade
- **Cobertura ampla:** Detecta ~57% de todas as violações de acessibilidade automaticamente
- **WCAG 2.1 completo:** Cobre todos os 4 princípios (Perceptível, Operável, Compreensível, Robusto)
- **Relatórios detalhados:** Elemento exato + regra violada + link para documentação

---

## Monitoramento e Performance

### Sentry

**Para que serve:** Error tracking e performance monitoring em produção.

**Por que foi escolhido:**

- **Source maps:** Mostra código original, não minificado — linha exata do erro
- **Release tracking:** Correlaciona erros com deploys específicos
- **Session Replay:** Vê exatamente o que o usuário fez antes do erro
- **Filtros inteligentes:** Remove ruído de extensões e scripts externos
- **Ativo apenas em produção:** Não polui desenvolvimento com erros esperados

**Inicialização condicional:**

```typescript
// src/main.tsx
if (import.meta.env.PROD) {
  initSentry()
}
```

---

### web-vitals

**Para que serve:** Coleta Core Web Vitals em browsers reais (Real User Monitoring).

**Por que foi escolhido:**

- **Biblioteca oficial do Google:** Mantida pela equipe que define os critérios de Core Web Vitals
- **Métricas de ranking:** Google usa LCP, INP e CLS como critério de SEO
- **Dados reais:** Mede o que o usuário real experimenta, não simulação de laboratório
- **Integração flexível:** Funciona com Google Analytics, Sentry ou qualquer endpoint

**Métricas coletadas:** LCP, INP, CLS, FCP, TTFB

---

### Lighthouse CI

**Para que serve:** Auditorias automatizadas de qualidade em CI/CD.

**Por que foi escolhido:**

- **5 categorias:** Performance, Acessibilidade, Boas Práticas, SEO e PWA
- **Histórico:** Compara scores entre deploys para detectar regressões
- **Padrão do Google:** As mesmas métricas usadas para ranking no Google Search
- **Fácil integração:** Plugin `@lhci/cli` rodando com `pnpm lighthouse`

---

## Build e Otimização

### Code Splitting Manual

```typescript
// vite.config.ts
manualChunks: {
  'vendor-react': ['react', 'react-dom'],  // raramente muda → cache longo
  'vendor-sentry': ['@sentry/react'],      // separado para não poluir o bundle principal
}
```

**Por que separar React e Sentry:**

- `vendor-react` tem hash que muda raramente — navegador cacheia por meses
- `vendor-sentry` é grande (~200KB) — separado para não impactar o tempo de carregamento inicial quando o Sentry não é crítico
- Cada componente `React.lazy()` vira automaticamente seu próprio chunk

### rollup-plugin-visualizer

**Para que serve:** Análise visual da composição e tamanho do bundle.

**Uso:**

```bash
pnpm build:analyze
# Abre dist/stats.html com gráfico treemap/sunburst
# Mostra tamanho gzip e brotli de cada módulo
```

**Quando usar:** Antes de otimizações, ao adicionar dependências pesadas, para verificar se tree-shaking está funcionando.

### Source maps em produção

```typescript
// vite.config.ts
build: {
  sourcemap: process.env.NODE_ENV === 'production' ? 'hidden' : false,
}
```

`'hidden'`: gera os arquivos `.map` mas não os referencia no JS — o Sentry faz o upload e eles são deletados após. Sem exposição de código fonte.

---

## Princípios da Arquitetura

### 1. Produção por padrão

Sentry, Web Vitals e source maps só ativam em `import.meta.env.PROD`. Zero ruído durante desenvolvimento.

### 2. Type safety em todo lugar

TypeScript strict em todo o código. Três tsconfigs com escopos claros. ESLint com TypeScript-aware rules. Nenhum `any` sem justificativa.

### 3. Acessibilidade não é opcional

ESLint com `jsx-a11y`, componentes acessíveis pré-construídos, testes automatizados WCAG. WCAG 2.1 AA é o mínimo, não o objetivo.

### 4. Testes como contrato

Threshold de 80% obrigatório. Cobertura mede o que foi testado, não o que funciona — mas sem ela, não há confiança de deploy. Pre-push bloqueia código sem testes.

### 5. Qualidade no commit, não no PR

lint-staged + type-check no pre-commit garantem que código mal formatado ou com erros de tipo nunca chega ao repositório.

### 6. Separação clara de contextos

Código fonte, testes unitários e testes E2E têm configs de TypeScript e ESLint separadas. Regras de teste não vazam para o código de produção.

---

## Próximos Passos (ao escalar)

Ao crescer além de um SPA simples, considerar:

| Necessidade               | Solução recomendada                                                   |
| ------------------------- | --------------------------------------------------------------------- |
| **Roteamento**            | TanStack Router — type-safe, code splitting automático                |
| **Estado global**         | Zustand (estado simples) ou TanStack Query (estado de servidor)       |
| **Autenticação**          | Better Auth — ver [docs/BETTER-AUTH-GUIDE.md](./BETTER-AUTH-GUIDE.md) |
| **Componentes UI**        | shadcn/ui (baseado em Radix UI) — acessível por padrão                |
| **Formulários**           | React Hook Form + Zod para validação type-safe                        |
| **API Client**            | TanStack Query para cache, refetch, loading states                    |
| **Imagens**               | `vite-plugin-image-optimizer` para AVIF/WebP automático               |
| **i18n**                  | `react-i18next` para múltiplos idiomas                                |
| **Testes de componentes** | Storybook para documentação e testes visuais                          |
| **Analytics**             | Plausible (privacidade) ou Google Analytics 4                         |

---

## Recursos e Documentação Oficial

- [React 19 Docs](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Vitest Guide](https://vitest.dev)
- [Playwright Docs](https://playwright.dev)
- [Sentry React SDK](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Web Vitals](https://web.dev/vitals/)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
