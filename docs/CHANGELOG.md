# Changelog

Todas as mudanças notáveis neste template serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### ✨ Adicionado

- `setup-github.mjs` padroniza o merge commit: título = título do PR (`chore: x (#14)`, no padrão conventional commit, em vez de "Merge pull request #14 from ..."), corpo vazio — os commits da branch já ficam no histórico e o número leva ao PR
- Lembrete trimestral (`.github/workflows/maintenance-reminder.yml`): abre a issue "revisão trimestral de padrões", com label `manutencao`, nos dias 1 de jan/abr/jul/out, e não abre outra enquanto a anterior estiver aberta. O roteiro é a skill `/revisar-padroes` do Claude Code
- Dependabot version updates (`.github/dependabot.yml`), mensal: um PR agrupado de minor/patch para npm e outro para as actions; majors chegam separados, para leitura do changelog. Exceção à regra "só em projeto estável": o template é a base de todo projeto novo
- `.vscode/extensions.json` recomenda CodeRabbit e SonarLint, para a revisão começar no editor
- `.coderabbit.yaml`: revisão no perfil `chill` e em PRs para qualquer branch, inclusive as de integração (antes ficavam em "skipping")
- pre-push pula os testes quando o push só apaga branches (`scripts/push-only-deletes.sh`, com testes); branch nova, push misto ou entrada estranha continuam rodando
- Secret scan com `gitleaks git --staged` no pre-commit, antes do lint; sem o binário o commit falha com o link de instalação. O CI já varre o histórico inteiro
- CI no GitHub Actions (`.github/workflows/ci.yml`), quatro jobs em paralelo: qualidade (Prettier, ESLint, tipos, cobertura, SonarCloud opcional, build), dependências e segredos (`pnpm audit` e gitleaks com binário de sha256 fixo), E2E contra o build de produção e Lighthouse CI
- `lighthouserc.json`: 90 em cada categoria; acessibilidade, boas práticas e SEO quebram o build, performance avisa
- `sonar-project.properties`, com organização e chave derivadas do nome do repositório no CI
- Firefox no Playwright; `.nvmrc` (Node 24); relatório de cobertura `lcov` para o SonarCloud
- `pnpm format` e `pnpm format:check` cobrem o repositório inteiro, não só `src/`
- `setup-github.mjs` liga o CodeQL só com as linguagens que existem no repositório (lista explícita) e avisa quando ele ficou ligado para uma linguagem que saiu — caso real: o repositório do perfil perdeu o único workflow e a análise de `actions` passou a falhar em todo PR

### 🔄 Dependências

- Primeira rodada do Dependabot (PRs #15–#23), testada em conjunto numa branch só: cada PR passou no CI sozinho, mas a combinação nunca tinha sido testada
- Actions: `checkout`, `setup-node` e `upload-artifact` → v7, `pnpm/action-setup` → v6 (runtime Node 24)
- Ferramentas: TypeScript 5.9 → 6.0, `@vitejs/plugin-react` 4 → 5, `eslint-plugin-security` 3 → 4, `eslint-plugin-react-refresh` 0.4 → 0.5, `prettier-plugin-tailwindcss` 0.6 → 0.8
- `web-vitals` 4 → 6: as funções usadas (`onCLS`, `onFCP`, `onINP`, `onLCP`, `onTTFB`) continuam; o teste unitário usa mock, quem confirma o pacote real é o e2e
- Ainda na fila: ESLint 9 sem suporte (→ 10), TypeScript 7, `@vitejs/plugin-react` 6

### 🔒 Segurança

- `pnpm audit` de 82 alertas (1 crítico, 47 altos) para zero, todos em ferramentas de dev — `pnpm audit --prod` já estava limpo, nada chegava ao navegador
- Dependências atualizadas dentro da versão principal (`pnpm update`, piso novo no `package.json`) e `@lhci/cli` 0.15 → 0.16, que trocou o `express` vulnerável (crítico, `proxy-addr`) e o `lighthouse` 12 → 13
- `pnpm.overrides` com faixa, só onde o pacote ainda não tem versão corrigida: `minimatch` 7–11.0.0 → `^11.0.5` (deixa a 3.x do `@eslint/eslintrc`, de API diferente, intocada) e `glob` 13 → `^14.0.2` (só o `@sentry/vite-plugin`, que usa `glob(padrões, { absolute, nodir })`, igual na 14). Remover cada um quando o pacote que o puxa pedir a versão corrigida
- Prettier 3.8 → 3.10 passou a escrever tipo união curto numa linha só; `Accessibility.tsx` reformatado

### 🐛 Corrigido

- Mensagem "❌ Testes falharam" do pre-push nunca aparecia: com `sh -e` (Husky 9), o teste que falha encerra o hook antes do `if [ $? -ne 0 ]`. A falha agora é tratada no `if !`. O SETUP-GUIDE ainda mostrava os dois hooks no formato do Husky 8
- `tsc -b` deixava `src/lib/sentryBuild.d.ts` dentro de `src/` (o lint quebrava se rodasse depois do build): as declarações do `tsconfig.node.json` vão para `node_modules/.tmp`, e a regra `*.config.d.ts` saiu do `.gitignore`
- Página inicial com os landmarks que faltavam (`header`, `nav`, `main`, `footer`): o link "Pular para o conteúdo principal" do `index.html` apontava para `#main-content`, que não existia (WCAG 2.4.1). `SiteHeader` e `SiteFooter` novos em `components/layout`; o `main` é o `MainContent` que já existia
- Uma só `meta description`: o `App` também renderizava `<title>` e `<meta>` pelo React 19, duplicando o `index.html`. O `index.html` (que o buscador lê sem executar JavaScript) é a fonte, agora com título e descrição reais do template
- Botões do hero quebram linha a 320px em vez de estourar a largura (WCAG 1.4.10 — Reflow); título do hero `text-4xl` no celular
- E2E: de 36 falhas (de 83, no chromium) para 0 nos quatro projetos. Testes com erro corrigidos — `header[role="banner"]` exigia ARIA redundante (agora `getByRole('banner')`); o de formatos de imagem exigia que houvesse imagem (agora pula quando não há); o de zoom 200% rodava no celular, onde equivale a ~195px, abaixo dos 320px da WCAG (agora só desktop). Removidas as asserções de números sem fonte oficial (≥ 3 `section`, > 5 links internos, ≥ 3 seções com mais de 100 palavras): obrigariam a página de demonstração a ter conteúdo de enchimento
- Threshold de cobertura de 80% passa a ser cobrado de verdade: estava em `thresholds.global`, formato do Jest que o Vitest lê como glob de arquivos e ignora
- Removido `coverage.all`, que não existe mais no Vitest 4 (com `coverage.include`, arquivos sem teste já entram no relatório)

- Release do Sentry usa o commit do deploy (`VERCEL_GIT_COMMIT_SHA`) quando `VITE_APP_VERSION` não existe — a Vercel não expande `$VAR` dentro de outra variável, e o texto literal virava o nome da release
- `VITE_APP_VERSION` com referência `$VAR`/`${VAR}` não expandida é ignorada, e a release cai para o commit
- Builds de preview da Vercel não criam release nem enviam source maps (um por PR, inclusive Dependabot)
- Source maps só são gerados quando vão ser enviados ao Sentry, para um build sem Sentry não publicar os `.map`

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

````markdown
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
````

### 🔄 Modificado

- **Tailwind CSS:** v4.0.0 → v5.0.0
- **PostCSS:** Atualizado para compatibilidade com Tailwind 5

### 🗑️ Removido

- Suporte para Tailwind 3.x

````

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
````

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
