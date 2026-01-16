# SEO & Accessibility Testing Suite

Este diretório contém testes automatizados para garantir que sua aplicação atenda aos padrões de SEO, acessibilidade e HTML semântico.

## 📋 Estrutura dos Testes

### 1. **metadata.spec.ts** - Testes de Metadados SEO

Baseado em: [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)

**Verifica:**

- ✅ Meta tags essenciais (title, description, charset, viewport)
- ✅ Open Graph tags para redes sociais
- ✅ Twitter Card tags
- ✅ Canonical URL
- ✅ Robots meta tag
- ✅ Palavras-chave relevantes (sem keyword stuffing)
- ✅ Comprimento adequado de títulos e descrições

**Fontes:**

- [Google Search Central - Meta Tags](https://developers.google.com/search/docs/crawling-indexing/special-tags)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)

---

### 2. **semantic-html.spec.ts** - Testes de HTML Semântico

Baseado em: [WCAG 2.1 Guidelines 1.3.1](https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html) e [HTML Living Standard](https://html.spec.whatwg.org/multipage/semantics.html)

**Verifica:**

- ✅ Elementos semânticos HTML5 (`<main>`, `<header>`, `<footer>`, `<nav>`, `<section>`, `<article>`)
- ✅ Hierarquia de cabeçalhos (h1-h6) sem pular níveis
- ✅ ARIA landmarks (navigation, main, contentinfo, banner)
- ✅ Estrutura de listas (ul/ol com li)
- ✅ Labels associados a inputs de formulário
- ✅ Links com texto descritivo
- ✅ Estrutura de tabelas (quando aplicável)
- ✅ Botões apropriados (não divs com onclick)

**Fontes:**

- [MDN - HTML Elements Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
- [W3C - ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM - Semantic Structure](https://webaim.org/techniques/semanticstructure/)

---

### 3. **accessibility.spec.ts** - Testes de Acessibilidade WCAG 2.1 AA (Powered by Axe-core)

⚠️ **IMPORTANTE**: Testes agora usam [@axe-core/playwright](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright) - padrão da indústria para testes automatizados de acessibilidade.

**Powered by:** [@axe-core/playwright](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright)

Baseado em: [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)

**Verifica:**

#### **Princípio 1: Perceptível**

- ✅ 1.1.1 - Alt text em todas as imagens
- ✅ 1.3.1 - Informações e relacionamentos programáticos
- ✅ 1.3.2 - Sequência significativa de conteúdo
- ✅ 1.4.1 - Uso de cor (não apenas cor para transmitir informação)
- ✅ 1.4.3 - Contraste mínimo (4.5:1 para texto normal)
- ✅ 1.4.4 - Redimensionamento de texto (200%)
- ✅ 1.4.10 - Reflow (320px sem scroll horizontal)
- ✅ 1.4.11 - Contraste de elementos não-texto

#### **Princípio 2: Operável**

- ✅ 2.1.1 - Acessível por teclado
- ✅ 2.1.2 - Sem armadilhas de teclado
- ✅ 2.4.1 - Bypass blocks (skip navigation)
- ✅ 2.4.2 - Título de página descritivo
- ✅ 2.4.3 - Ordem de foco lógica
- ✅ 2.4.4 - Propósito do link claro
- ✅ 2.4.6 - Cabeçalhos e labels descritivos
- ✅ 2.4.7 - Foco visível
- ✅ 2.5.5 - Tamanho de alvo adequado (44x44px mínimo)

#### **Princípio 3: Compreensível**

- ✅ 3.1.1 - Idioma da página
- ✅ 3.2.1 - Ao receber foco (sem mudanças de contexto)
- ✅ 3.3.1 - Identificação de erros
- ✅ 3.3.2 - Labels ou instruções

#### **Princípio 4: Robusto**

- ✅ 4.1.2 - Nome, função, valor (ARIA)
- ✅ 4.1.3 - Mensagens de status

**Fontes:**

- [WCAG 2.1 Understanding Docs](https://www.w3.org/WAI/WCAG21/Understanding/)
- [WebAIM Checklist](https://webaim.org/standards/wcag/checklist)
- [a11y Project Checklist](https://www.a11yproject.com/checklist/)

---

### 4. **performance-keywords.spec.ts** - Performance e Qualidade de Conteúdo

Baseado em: [Google Core Web Vitals](https://web.dev/articles/vitals) e [Lighthouse Performance Guide](https://developer.chrome.com/docs/lighthouse/performance/)

**Verifica:**

#### **Core Web Vitals**

- ✅ LCP (Largest Contentful Paint) < 2.5s
- ✅ CLS (Cumulative Layout Shift) < 0.1
- ✅ INP (Interaction to Next Paint) < 200ms

#### **Additional Performance Metrics**

- ✅ FCP (First Contentful Paint) < 1.8s

#### **Otimização de Recursos**

- ✅ Recursos não bloqueantes
- ✅ Imagens em formatos modernos (WebP, AVIF)
- ✅ Atributos width/height em imagens
- ✅ Lazy loading para imagens abaixo da dobra

#### **Performance JavaScript**

- ✅ Tempo de execução JS aceitável
- ✅ Ausência de long tasks

#### **Performance de Rede**

- ✅ Uso de HTTP/2 ou HTTP/3
- ✅ Tempo de carregamento da página

#### **Performance Mobile**

- ✅ Responsividade em dispositivos móveis
- ✅ Elementos interativos touch-friendly

#### **Qualidade de Conteúdo**

- ✅ Conteúdo substancial (>300 palavras)
- ✅ Conteúdo único por página
- ✅ Links internos relevantes
- ✅ Otimização de palavras-chave
- ✅ Structured data (Schema.org)
- ✅ Estrutura de URL limpa e descritiva

**Fontes:**

- [Web.dev - Core Web Vitals](https://web.dev/articles/vitals)
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [Lighthouse Performance Scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring/)
- [Schema.org](https://schema.org/)

---

## 🚀 Como Executar os Testes

### Todos os testes SEO/Acessibilidade:

```bash
npm run test:e2e -- tests/seo
```

### Testes específicos:

```bash
# Metadados SEO
npm run test:e2e -- tests/seo/metadata.spec.ts

# HTML Semântico
npm run test:e2e -- tests/seo/semantic-html.spec.ts

# Acessibilidade WCAG 2.1
npm run test:e2e -- tests/seo/accessibility.spec.ts

# Performance e Keywords
npm run test:e2e -- tests/seo/performance-keywords.spec.ts
```

### Modo UI (visualizar testes):

```bash
npm run test:e2e:ui -- tests/seo
```

### Modo headed (ver navegador):

```bash
npm run test:e2e:headed -- tests/seo
```

---

## 📊 Relatórios

Os testes geram relatórios detalhados em `playwright-report/`:

```bash
# Executar testes e ver relatório
npm run test:e2e -- tests/seo
npx playwright show-report
```

---

## 🔄 Integração Contínua

Os testes são executados automaticamente:

- ✅ Em cada commit (via Husky pre-commit hook)
- ✅ Em cada pull request (via GitHub Actions)
- ✅ Antes do deploy (via pre-deploy script)

---

## 📚 Referências e Fontes Oficiais

### SEO

1. [Google Search Central - SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
2. [Google Search Central - Documentation](https://developers.google.com/search/docs)
3. [Google Search Central - How Search Works](https://developers.google.com/search/docs/fundamentals/how-search-works)
4. [Schema.org - Structured Data](https://schema.org/)

### Acessibilidade

1. [W3C WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
2. [W3C WAI - Web Accessibility Initiative](https://www.w3.org/WAI/)
3. [MDN Web Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
4. [WebAIM](https://webaim.org/)
5. [The A11Y Project](https://www.a11yproject.com/)

### HTML Semântico

1. [HTML Living Standard](https://html.spec.whatwg.org/)
2. [MDN HTML Element Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
3. [W3C HTML Specification](https://www.w3.org/TR/html/)

### Performance

1. [Web.dev - Core Web Vitals](https://web.dev/articles/vitals)
2. [Google Lighthouse](https://developer.chrome.com/docs/lighthouse/)
3. [MDN Web Performance](https://developer.mozilla.org/en-US/docs/Web/Performance)

### ARIA

1. [W3C ARIA Specification](https://www.w3.org/TR/wai-aria/)
2. [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)

---

## ⚠️ Importante

Estes testes são baseados em padrões atualizados de **2024-2025** e seguem as diretrizes oficiais mais recentes de:

- ✅ WCAG 2.1 AA (World Wide Web Consortium)
- ✅ Google Search Central Guidelines
- ✅ HTML Living Standard (WHATWG)
- ✅ Core Web Vitals (Google)
- ✅ Schema.org Structured Data

Todos os testes incluem links para as fontes oficiais nos comentários do código.

---

## 🎯 Metas de Conformidade

- **SEO**: 100% dos critérios do Google SEO Starter Guide
- **Acessibilidade**: WCAG 2.1 AA completo
- **HTML**: 100% semântico segundo HTML5 spec
- **Performance**: Core Web Vitals todos em "Good" (verde)
- **Mobile**: 100% responsivo e touch-friendly

---

## 🔧 Manutenção

Os testes devem ser atualizados sempre que:

1. Novos padrões WCAG forem publicados
2. Google atualizar suas diretrizes de SEO
3. Core Web Vitals mudarem seus thresholds
4. Novas features HTML/ARIA forem adicionadas

Consulte sempre as fontes oficiais para manter os testes atualizados.
