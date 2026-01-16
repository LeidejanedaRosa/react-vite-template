# 🎯 Guia Rápido: Testes de SEO e Acessibilidade

## Como Executar os Testes

### Todos os testes de SEO e Acessibilidade

```bash
npm run test:seo
```

### Testes individuais

```bash
# Metadados SEO (títulos, descrições, Open Graph, etc)
npm run test:seo:metadata

# HTML Semântico (estrutura, landmarks, hierarquia de headings)
npm run test:seo:semantic

# Acessibilidade WCAG 2.1 AA (contraste, teclado, ARIA, etc)
npm run test:seo:a11y

# Performance e Palavras-chave (Core Web Vitals, keywords, structured data)
npm run test:seo:performance
```

### Validação completa (executar todos em sequência)

```bash
bash scripts/validate-seo.sh
```

### Ver relatório de testes

```bash
npx playwright show-report
```

---

## O Que Cada Teste Verifica

### 🏷️ Metadados SEO

- Meta tags (title, description, charset, viewport)
- Open Graph para redes sociais
- Twitter Cards
- Canonical URL
- Palavras-chave (sem keyword stuffing)

### 🏗️ HTML Semântico

- Elementos HTML5 (`<main>`, `<header>`, `<footer>`, `<nav>`, `<section>`)
- Hierarquia de headings (h1-h6)
- ARIA landmarks
- Labels em formulários
- Links descritivos

### ♿ Acessibilidade WCAG 2.1 AA

- **Perceptível**: Alt text, contraste, reflow
- **Operável**: Navegação por teclado, foco visível, skip links
- **Compreensível**: Idioma, labels, mensagens de erro
- **Robusto**: ARIA, nome/função/valor

### ⚡ Performance e Keywords

- Core Web Vitals (LCP, CLS, FCP, TTI)
- Otimização de imagens
- Palavras-chave relevantes
- Structured data (Schema.org)
- Performance mobile

---

## Fontes Oficiais

Todos os testes são baseados em:

- ✅ [WCAG 2.1 AA](https://www.w3.org/WAI/WCAG21/quickref/) (W3C)
- ✅ [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- ✅ [HTML Living Standard](https://html.spec.whatwg.org/)
- ✅ [Core Web Vitals](https://web.dev/articles/vitals) (Google)
- ✅ [Schema.org](https://schema.org/)

---

## Quando os Testes São Executados

- ✅ Em cada commit (via Husky)
- ✅ Em cada pull request (via GitHub Actions)
- ✅ Antes do deploy (via pre-deploy script)
- ✅ Manualmente quando necessário

---

## Leia Mais

Para documentação completa, veja: `tests/seo/README.md`
