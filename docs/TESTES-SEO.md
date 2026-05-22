# Testes de SEO, Acessibilidade e Performance

Guia das suites de testes E2E dedicadas a qualidade técnica, baseadas em padrões oficiais do W3C, Google e WHATWG.

---

## Visão Geral

O projeto tem 4 suites de teste Playwright em `tests/seo/`, cada uma com um foco específico:

| Suite                      | Arquivo                        | O que valida                                                |
| -------------------------- | ------------------------------ | ----------------------------------------------------------- |
| **Metadados SEO**          | `metadata.spec.ts`             | Meta tags, Open Graph, Twitter Cards, canonical             |
| **HTML Semântico**         | `semantic-html.spec.ts`        | Estrutura semântica, landmarks ARIA, hierarquia de headings |
| **Acessibilidade WCAG**    | `accessibility.spec.ts`        | Conformidade WCAG 2.1 AA completa via axe-core              |
| **Performance e Keywords** | `performance-keywords.spec.ts` | Core Web Vitals, otimização de recursos, structured data    |

Para a documentação detalhada de cada suite com todas as regras verificadas e fontes, consulte [tests/seo/README.md](../tests/seo/README.md).

---

## Como Executar

### Todas as suites de SEO

```bash
pnpm test:seo
```

Gera relatório HTML em `playwright-report/`. Para visualizar:

```bash
npx playwright show-report
```

### Suites individuais

```bash
# Metadados SEO (títulos, descrições, Open Graph, etc)
pnpm test:seo:metadata

# HTML Semântico (estrutura, landmarks, hierarquia de headings)
pnpm test:seo:semantic

# Acessibilidade WCAG 2.1 AA (contraste, teclado, ARIA, etc)
pnpm test:seo:a11y

# Performance e Core Web Vitals
pnpm test:seo:performance
```

### Modo visual (debug)

```bash
# Interface gráfica do Playwright — ver testes rodando
pnpm test:e2e:ui

# Browser visível — útil para debug de falhas
pnpm test:e2e:headed
```

---

## O Que Cada Suite Verifica

### 1. Metadados SEO (`metadata.spec.ts`)

Baseado no [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide).

**Meta tags essenciais:**

- `<title>` presente e com comprimento entre 10 e 60 caracteres
- `<meta name="description">` com 50 a 160 caracteres
- `<meta charset="UTF-8">`
- `<meta name="viewport">` com `width=device-width, initial-scale=1`

**Open Graph (redes sociais):**

- `og:title`, `og:description`, `og:type`, `og:url`, `og:image`

**Twitter Cards:**

- `twitter:card`, `twitter:title`, `twitter:description`

**Outros:**

- Canonical URL
- `robots` meta tag (`index, follow`)
- Ausência de keyword stuffing

---

### 2. HTML Semântico (`semantic-html.spec.ts`)

Baseado no [HTML Living Standard](https://html.spec.whatwg.org/) e [WCAG 2.1 Guideline 1.3.1](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html).

**Estrutura semântica:**

- Elemento `<main>` único por página
- `<header>`, `<footer>`, `<nav>` quando aplicável
- `<h1>` único — hierarquia h1 → h2 → h3 sem pular níveis

**ARIA landmarks:**

- `role="navigation"` ou `<nav>` para menus
- `role="main"` ou `<main>` para conteúdo principal
- `role="contentinfo"` ou `<footer>` para rodapé

**Formulários:**

- Todo `<input>`, `<select>` e `<textarea>` com `<label>` associado via `for`/`id` ou `aria-labelledby`

**Links:**

- Texto descritivo — sem "clique aqui" ou "leia mais" genéricos
- Links externos com `rel="noopener noreferrer"` e `target="_blank"`

---

### 3. Acessibilidade WCAG 2.1 AA (`accessibility.spec.ts`)

Executado com `@axe-core/playwright` — o motor de acessibilidade mais adotado na indústria.

Baseado em [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/).

**Princípio 1 — Perceptível:**

- 1.1.1: Alt text em todas as imagens não decorativas
- 1.3.1: Informações transmitidas por estrutura, não apenas por aparência
- 1.4.3: Contraste mínimo 4.5:1 para texto normal, 3:1 para texto grande
- 1.4.4: Redimensionamento de texto até 200% sem perda de funcionalidade
- 1.4.10: Reflow em 320px sem scroll horizontal

**Princípio 2 — Operável:**

- 2.1.1: Toda funcionalidade acessível por teclado
- 2.1.2: Sem armadilhas de teclado
- 2.4.1: Mecanismo de bypass (skip link)
- 2.4.2: Título de página descritivo
- 2.4.3: Ordem de foco lógica
- 2.4.4: Propósito do link determinável pelo contexto
- 2.4.7: Foco visível em elementos interativos
- 2.5.5: Área de toque mínima de 44x44px

**Princípio 3 — Compreensível:**

- 3.1.1: Idioma da página declarado no `<html lang>`
- 3.3.1: Erros de formulário identificados e descritos
- 3.3.2: Labels ou instruções para campos obrigatórios

**Princípio 4 — Robusto:**

- 4.1.2: Nome, função e valor programaticamente determinados
- 4.1.3: Mensagens de status comunicadas por programação

---

### 4. Performance e Keywords (`performance-keywords.spec.ts`)

Baseado em [Core Web Vitals](https://web.dev/articles/vitals) e [Lighthouse Performance Guide](https://developer.chrome.com/docs/lighthouse/performance/).

**Core Web Vitals (metas "Good"):**

| Métrica | Meta    | O que mede                                   |
| ------- | ------- | -------------------------------------------- |
| LCP     | < 2.5s  | Velocidade de carregamento do maior elemento |
| CLS     | < 0.1   | Estabilidade visual                          |
| INP     | < 200ms | Responsividade às interações                 |
| FCP     | < 1.8s  | Tempo até o primeiro conteúdo aparecer       |

**Otimização de recursos:**

- Imagens sem atributos `width`/`height` — causa CLS
- Imagens abaixo da dobra sem `loading="lazy"`
- Uso de formatos modernos (WebP, AVIF)

**Performance JavaScript:**

- Ausência de long tasks (> 50ms) que bloqueiam o thread principal

**Qualidade de conteúdo:**

- Conteúdo substancial (> 300 palavras) para SEO
- Dados estruturados Schema.org presentes
- URL limpa e descritiva

---

## Configuração dos Browsers

Os testes rodam em todos os browsers configurados no `playwright.config.ts`:

| Browser       | Device         |
| ------------- | -------------- |
| Chromium      | Desktop Chrome |
| WebKit        | Desktop Safari |
| Mobile Chrome | Pixel 5        |
| Mobile Safari | iPhone 12      |

Para rodar apenas em um browser:

```bash
pnpm test:seo -- --project=chromium
pnpm test:seo -- --project=webkit
pnpm test:seo -- --project="Mobile Chrome"
```

---

## Quando os Testes São Executados

| Momento           | Como                                                       |
| ----------------- | ---------------------------------------------------------- |
| `git push`        | Husky `pre-push` executa `pnpm test` (unitários)           |
| Pré-deploy manual | `pnpm pre-deploy` inclui cobertura completa                |
| CI/CD             | Configurar no GitHub Actions para executar `pnpm test:all` |
| Manualmente       | Qualquer momento com `pnpm test:seo`                       |

---

## Interpretando Falhas

### Falha em `metadata.spec.ts`

Verificar em `index.html` ou no componente de página:

- `<title>` definido e com comprimento correto
- `<meta name="description">` presente
- Tags Open Graph com URL e imagem absolutas

### Falha em `accessibility.spec.ts`

O axe-core retorna a lista de violações com:

- Regra violada (ex: `color-contrast`, `image-alt`)
- Elementos afetados com seletor CSS
- Link para a documentação da regra

Para ver detalhes no modo UI:

```bash
pnpm test:e2e:ui
```

### Falha em `performance-keywords.spec.ts`

Métricas de Core Web Vitals dependem do ambiente de teste. Em máquinas lentas ou CI com poucos recursos, LCP e INP podem ultrapassar os thresholds. Ajuste os timeouts do Playwright ou os limites das métricas conforme o ambiente.

---

## Fontes Oficiais

Todos os testes são baseados exclusivamente em padrões oficiais:

- [WCAG 2.1 — W3C](https://www.w3.org/WAI/WCAG21/quickref/)
- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Google Search Central — Meta Tags](https://developers.google.com/search/docs/crawling-indexing/special-tags)
- [HTML Living Standard — WHATWG](https://html.spec.whatwg.org/)
- [Core Web Vitals — Web.dev](https://web.dev/articles/vitals)
- [Schema.org Structured Data](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [ARIA Authoring Practices Guide — W3C](https://www.w3.org/WAI/ARIA/apg/)
