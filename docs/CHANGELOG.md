# Changelog

Todas as mudanças notáveis neste template serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### 🎯 Planejado
- Adicionar integração com Storybook
- Adicionar testes de integração com MSW
- Adicionar exemplo de autenticação com OAuth
- Adicionar suporte a i18n (internacionalização)

---

## [1.0.0] - 2025-01-16

### 🎉 Lançamento Inicial

Template base completo e pronto para uso em produção.

### ✨ Adicionado

#### Core Stack
- React 19 com suporte nativo a meta tags
- Vite 5 como build tool
- TypeScript 5 com strict mode
- Tailwind CSS 4
- TanStack Router para roteamento type-safe

#### Qualidade de Código
- ESLint configurado com regras para React, TypeScript e acessibilidade
- Prettier para formatação automática
- Husky com git hooks (pre-commit e pre-push)
- lint-staged para verificação de arquivos modificados
- Path aliases configurados (`@/`, `@components/`, etc)

#### Testes
- Vitest configurado para testes unitários e de integração
- Playwright configurado para testes E2E
- Testing Library para testes de componentes React
- Exemplo de testes de acessibilidade com @axe-core/playwright

#### Monitoramento e Performance
- Sentry configurado para error tracking e performance monitoring
- Core Web Vitals tracking (LCP, INP, CLS)
- Lighthouse CI setup
- rollup-plugin-visualizer para análise de bundle

#### Infraestrutura
- Headers de segurança configurados (Vercel e Netlify)
- Configuração de variáveis de ambiente (.env.example)
- Scripts npm organizados e documentados
- Dockerfile para containerização (opcional)

#### Documentação
- ARCHITECTURE.md - Detalhamento de cada tecnologia e justificativas
- SETUP-GUIDE.md - Guia completo de instalação e configuração
- FOLDER-STRUCTURE.md - Estrutura de pastas feature-based
- CONTRIBUTING.md - Guia para colaboradores
- README.md com quick start
- Comentários inline em configs importantes

#### Acessibilidade
- eslint-plugin-jsx-a11y configurado
- Testes automatizados de acessibilidade
- Checklist de a11y no guia de contribuição

#### SEO
- Meta tags configuradas com React 19
- robots.txt e sitemap.xml templates
- Structured data (Schema.org) examples
- Open Graph e Twitter Cards configurados

---

## Como Usar Este Changelog

### Tipos de Mudanças

Use estas categorias ao documentar mudanças:

- **✨ Adicionado** (`Added`) - Para novas funcionalidades
- **🔄 Modificado** (`Changed`) - Para mudanças em funcionalidades existentes
- **⚠️ Deprecated** (`Deprecated`) - Para funcionalidades que serão removidas
- **🗑️ Removido** (`Removed`) - Para funcionalidades removidas
- **🐛 Corrigido** (`Fixed`) - Para correções de bugs
- **🔒 Segurança** (`Security`) - Para vulnerabilidades corrigidas

### Versionamento Semântico

Este template segue [Semantic Versioning](https://semver.org/lang/pt-BR/):

**MAJOR.MINOR.PATCH** (ex: 2.1.3)

- **MAJOR (2):** Mudanças incompatíveis na API/estrutura (breaking changes)
  - Exemplo: Mudança na estrutura de pastas que quebra imports
  - Exemplo: Atualização do React 19 → 20 com breaking changes
  - Exemplo: Remoção de uma dependência importante

- **MINOR (1):** Novas funcionalidades compatíveis com versão anterior
  - Exemplo: Adicionar novo plugin do Vite
  - Exemplo: Adicionar nova feature opcional (Storybook)
  - Exemplo: Adicionar novos scripts npm

- **PATCH (3):** Correções de bugs e melhorias menores
  - Exemplo: Corrigir configuração do ESLint
  - Exemplo: Atualizar dependências patch
  - Exemplo: Corrigir typos na documentação

### Quando Atualizar

**Atualize o changelog:**
- ✅ Sempre que adicionar/remover dependências importantes
- ✅ Quando mudar configurações que afetam comportamento
- ✅ Ao adicionar/remover features ou ferramentas
- ✅ Quando corrigir bugs conhecidos
- ✅ Ao fazer breaking changes
- ✅ Quando atualizar documentação significativamente

**Não precisa atualizar para:**
- ❌ Atualizações patch de dependências que não afetam comportamento
- ❌ Typos muito pequenos
- ❌ Mudanças em comentários de código
- ❌ Reformatação de código sem mudança lógica

---

## Template para Novas Versões

```markdown
## [X.Y.Z] - YYYY-MM-DD

### ✨ Adicionado
- Descrição do que foi adicionado
- Outra funcionalidade nova

### 🔄 Modificado
- Descrição do que mudou
- Impacto da mudança

### 🐛 Corrigido
- Bug que foi corrigido
- Descrição da solução

### 🗑️ Removido
- O que foi removido
- Razão da remoção

### 🔒 Segurança
- Vulnerabilidade corrigida
- CVE reference (se aplicável)

### ⚠️ Breaking Changes
**IMPORTANTE:** Esta versão contém mudanças incompatíveis.

- Descrição detalhada da mudança
- Como migrar para a nova versão
- Exemplo de código antes/depois

### 📝 Notas de Migração
Se você está atualizando de versão anterior:
1. Passo 1 da migração
2. Passo 2 da migração
3. ...
```

---

## Exemplos de Entradas

### Exemplo: Nova Feature (Minor)

```markdown
## [1.1.0] - 2025-02-15

### ✨ Adicionado
- **Storybook:** Configuração completa para documentação de componentes
  - Plugins: a11y, viewport, controls
  - Stories para todos os componentes UI
  - Modo dark configurado
  - Scripts: `pnpm storybook` e `pnpm build-storybook`
- **MSW (Mock Service Worker):** Setup para testes de integração com API
  - Handlers de exemplo para endpoints comuns
  - Integração com Vitest e Playwright

### 🔄 Modificado
- **Estrutura de pastas:** Adicionado diretório `.storybook/` na raiz
- **package.json:** Novos scripts para Storybook
```

### Exemplo: Breaking Change (Major)

```markdown
## [2.0.0] - 2025-03-01

### ⚠️ Breaking Changes

**Migração de Tailwind 4 para Tailwind 5**

- Algumas classes foram renomeadas
- Configuração de `tailwind.config.js` mudou
- Plugins agora são importados de forma diferente

**Como migrar:**
1. Atualize `tailwind.config.js` seguindo novo formato
2. Substitua classes antigas:
   - `overflow-clip` → `overflow-hidden`
   - `decoration-slice` → `box-decoration-slice`
3. Reinstale dependências: `pnpm install`

**Exemplo de código:**
```diff
// tailwind.config.js
- module.exports = {
+ export default {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: { extend: {} },
-   plugins: [require('@tailwindcss/forms')],
+   plugins: ['@tailwindcss/forms'],
  }
```

### 🔄 Modificado
- **Tailwind CSS:** v4.0.0 → v5.0.0
- **PostCSS:** Atualizado para compatibilidade com Tailwind 5

### 🗑️ Removido
- Suporte para Tailwind 3.x
```

### Exemplo: Bug Fix (Patch)

```markdown
## [1.0.1] - 2025-01-20

### 🐛 Corrigido
- **Husky:** Pre-push hook não executava testes corretamente
  - Adicionado shebang correto no arquivo `.husky/pre-push`
  - Permissões de execução corrigidas
- **TypeScript:** Erro de tipo em `formatCurrency` utility
  - Adicionado type guard para valor `null`
- **ESLint:** Falso positivo em jsx-a11y para labels customizados
  - Adicionada exceção para componente `FormField`

### 🔄 Modificado
- **Dependências:** Atualização de patch versions
  - `vite`: 5.0.10 → 5.0.12
  - `vitest`: 1.2.0 → 1.2.1
  - `prettier`: 3.2.0 → 3.2.4
```

### Exemplo: Segurança (Patch)

```markdown
## [1.0.2] - 2025-01-25

### 🔒 Segurança
- **vite:** Corrigida vulnerabilidade CVE-2024-XXXXX
  - Atualizado de 5.0.12 → 5.0.13
  - Severidade: Média
  - Impacto: XSS potencial em dev server
- **Headers de segurança:** Adicionado `Content-Security-Policy`
  - Prevenção de XSS e clickjacking
  - Configurado em `vercel.json` e `netlify.toml`

### 🔄 Modificado
- **Sentry:** Melhorada filtragem de erros sensíveis
  - Eventos com senhas/tokens são automaticamente sanitizados
```

---

## Checklist de Release

Antes de criar uma nova versão:

- [ ] Todos os testes passam (`pnpm test` e `pnpm test:e2e`)
- [ ] Lint sem erros (`pnpm lint`)
- [ ] Build de produção funciona (`pnpm build`)
- [ ] Documentação atualizada (se necessário)
- [ ] CHANGELOG.md atualizado com mudanças
- [ ] Versão bumped em `package.json`
- [ ] Tag Git criada: `git tag v1.0.0`
- [ ] Notas de release escritas (GitHub/GitLab)
- [ ] Projetos existentes notificados (se breaking changes)

---

## Links Úteis

- [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/)
- [Semantic Versioning](https://semver.org/lang/pt-BR/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Mantenedor:** [Seu Nome]  
**Repositório:** [Link do repositório]  
**Última atualização:** Janeiro 2025
