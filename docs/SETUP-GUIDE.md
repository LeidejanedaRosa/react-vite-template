# Manual de Instalação e Configuração

> Guia completo para iniciar um novo projeto usando este template

## Índice

- [Pré-requisitos](#pré-requisitos)
- [Instalação Inicial](#instalação-inicial)
- [Configuração do Projeto](#configuração-do-projeto)
- [Configuração de Ferramentas](#configuração-de-ferramentas)
- [Git Hooks e Automações](#git-hooks-e-automações)
- [Monitoramento e Infraestrutura](#monitoramento-e-infraestrutura)
- [Acessibilidade e SEO](#acessibilidade-e-seo)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Checklist de Qualidade](#checklist-de-qualidade)

---

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js:** versão 20.x ou superior ([Download](https://nodejs.org))
- **pnpm:** versão 9.x ou superior
- **Git:** versão 2.x ou superior

### Instalando pnpm

```bash
# Via npm (se ainda não tem pnpm)
npm install -g pnpm

# Verificar instalação
pnpm --version
```

**Por que pnpm?**
- ✅ Mais rápido que npm e yarn
- ✅ Economiza espaço em disco (hard links)
- ✅ Segurança: evita dependências fantasma
- ✅ Ideal para múltiplos projetos

---

## Instalação Inicial

### 1. Criar Novo Projeto a Partir do Template

```bash
# Se o template está no GitHub como template repository
# (clique em "Use this template" na interface do GitHub)

# OU clone manualmente
git clone https://github.com/seu-usuario/seu-template.git nome-do-projeto
cd nome-do-projeto

# Remova o git antigo e inicie um novo
rm -rf .git
git init
```

### 2. Instalar Dependências

```bash
# Instalar todas as dependências
pnpm install
```

**O que acontece aqui:**
- 📦 Instala dependências de produção (React, etc)
- 🛠️ Instala dependências de desenvolvimento (ESLint, Vitest, etc)
- 🔗 Configura symlinks para aliases do TypeScript

### 3. Verificar Instalação

```bash
# Deve rodar sem erros
pnpm run dev
```

Acesse `http://localhost:5173` - você deve ver a aplicação rodando.

---

## Configuração do Projeto

### 1. Atualizar `package.json`

```json
{
  "name": "nome-do-seu-projeto",
  "version": "1.0.0",
  "description": "Descrição do projeto do cliente",
  "author": "Seu Nome <seu@email.com>",
  "private": true
}
```

### 2. Configurar Variáveis de Ambiente

Crie o arquivo `.env.local` na raiz do projeto:

```bash
# .env.local (NÃO commitar este arquivo)

# Ambiente
VITE_APP_ENV=development

# URLs
VITE_API_URL=https://api.seudominio.com

# Sentry (configurar depois)
VITE_SENTRY_DSN=
VITE_SENTRY_ENVIRONMENT=development

# Analytics
VITE_GA_MEASUREMENT_ID=

# Outras configurações específicas do projeto
```

**Importante:** O arquivo `.env.local` já está no `.gitignore` e não deve ser commitado.

Crie também `.env.example` como modelo:

```bash
# .env.example (commitar este)
VITE_APP_ENV=
VITE_API_URL=
VITE_SENTRY_DSN=
```

---

## Configuração de Ferramentas

### TypeScript - `tsconfig.json`

Já vem configurado, mas entenda as principais opções:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path Aliases - IMPORTANTE */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@utils/*": ["./src/utils/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@assets/*": ["./src/assets/*"],
      "@types/*": ["./src/types/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**Como usar os aliases:**

```typescript
// ❌ Antes (ruim)
import { Button } from '../../../components/Button'

// ✅ Depois (bom)
import { Button } from '@components/Button'
import { formatDate } from '@utils/date'
```

### Vite - `vite.config.ts`

Configure os aliases para funcionarem com o Vite:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    // Visualizador de bundle (apenas em build)
    visualizer({
      open: false,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  
  // Aliases
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@types': path.resolve(__dirname, './src/types'),
    },
  },

  // Otimizações de build
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
  },
})
```

### ESLint - `.eslintrc.cjs`

```javascript
module.exports = {
  root: true,
  env: { 
    browser: true, 
    es2020: true 
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended', // Acessibilidade
    'prettier', // Deve ser o último
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: [
    'react-refresh',
    'jsx-a11y', // Plugin de acessibilidade
  ],
  settings: {
    react: {
      version: '19',
    },
  },
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    // Suas regras customizadas
    '@typescript-eslint/no-unused-vars': ['error', { 
      argsIgnorePattern: '^_' 
    }],
  },
}
```

**Instalar plugin de acessibilidade:**

```bash
pnpm add -D eslint-plugin-jsx-a11y
```

### Prettier - `.prettierrc`

```json
{
  "semi": false,
  "tabWidth": 2,
  "printWidth": 80,
  "singleQuote": true,
  "trailingComma": "es5",
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

**E `.prettierignore`:**

```
dist
node_modules
.next
coverage
pnpm-lock.yaml
```

### Tailwind - `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Suas customizações
      colors: {
        primary: {
          50: '#...',
          // ...
          900: '#...',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

---

## Git Hooks e Automações

### Configurar Husky

```bash
# Inicializar Husky
pnpm exec husky init

# Criar hooks
```

### Pre-commit Hook

Arquivo: `.husky/pre-commit`

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Rodando verificações pre-commit..."

# 1. Lint staged files
echo "📝 Checando lint..."
pnpm exec lint-staged

# 2. Type check
echo "🔷 Checando tipos TypeScript..."
pnpm run type-check

echo "✅ Pre-commit verificações passaram!"
```

**O que faz:**
1. ✅ Roda ESLint apenas nos arquivos modificados
2. ✅ Formata código com Prettier
3. ✅ Verifica tipos TypeScript em todo o projeto

### Pre-push Hook (Opcional mas Recomendado)

Arquivo: `.husky/pre-push`

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🧪 Rodando testes antes do push..."

# Rodar testes
pnpm run test

if [ $? -ne 0 ]; then
  echo "❌ Testes falharam. Push cancelado."
  exit 1
fi

echo "✅ Testes passaram! Continuando com push..."
```

**O que faz:**
- ✅ Roda todos os testes antes de fazer push
- ❌ Bloqueia push se algum teste falhar

### Configurar lint-staged

Arquivo: `.lintstagedrc.json`

```json
{
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{json,md,mdx,css,html}": [
    "prettier --write"
  ]
}
```

**Instalar lint-staged:**

```bash
pnpm add -D lint-staged
```

### Scripts no `package.json`

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    
    "type-check": "tsc --noEmit",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,json,css,md}\"",
    
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    
    "lighthouse": "lhci autorun",
    
    "analyze": "vite build && open dist/stats.html",
    
    "prepare": "husky install"
  }
}
```

---

## Monitoramento e Infraestrutura

### Configurar Sentry

#### 1. Criar conta no Sentry

- Acesse [sentry.io](https://sentry.io)
- Crie um novo projeto React
- Copie o DSN fornecido

#### 2. Instalar SDK do Sentry

```bash
pnpm add @sentry/react
```

#### 3. Configurar no projeto

Arquivo: `src/main.tsx`

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import * as Sentry from '@sentry/react'
import App from './App'
import './index.css'

// Configurar Sentry apenas em produção
if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || 'production',
    
    // Performance Monitoring
    tracesSampleRate: 1.0, // 100% em dev, reduzir em prod (ex: 0.1 = 10%)
    
    // Session Replay (opcional)
    replaysSessionSampleRate: 0.1, // 10% das sessões
    replaysOnErrorSampleRate: 1.0, // 100% quando há erro
    
    integrations: [
      new Sentry.BrowserTracing(),
      new Sentry.Replay({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    
    // Filtrar erros irrelevantes
    beforeSend(event, hint) {
      // Ignorar erros de extensões do browser
      if (event.exception?.values?.[0]?.value?.includes('extension')) {
        return null
      }
      return event
    },
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

#### 4. Adicionar DSN no `.env.local`

```bash
VITE_SENTRY_DSN=https://seu-dsn@sentry.io/projeto
VITE_SENTRY_ENVIRONMENT=development
```

#### 5. Testar Sentry

```typescript
// Em algum componente, adicione um botão de teste:
<button onClick={() => {
  throw new Error('Teste do Sentry!')
}}>
  Testar Sentry
</button>
```

**Importante:** Sentry só deve estar ativo em **produção** para não poluir com erros de desenvolvimento.

### Configurar Core Web Vitals

#### 1. Instalar biblioteca

```bash
pnpm add web-vitals
```

#### 2. Criar função de reporte

Arquivo: `src/utils/reportWebVitals.ts`

```typescript
import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals'
import * as Sentry from '@sentry/react'

export function reportWebVitals() {
  // Apenas em produção
  if (!import.meta.env.PROD) return

  // Core Web Vitals
  onCLS(metric => sendToAnalytics(metric))
  onINP(metric => sendToAnalytics(metric))
  onLCP(metric => sendToAnalytics(metric))
  
  // Outras métricas importantes
  onFCP(metric => sendToAnalytics(metric))
  onTTFB(metric => sendToAnalytics(metric))
}

function sendToAnalytics(metric: any) {
  const body = JSON.stringify(metric)
  
  // Enviar para Sentry
  Sentry.captureMessage(`Web Vital: ${metric.name}`, {
    level: 'info',
    tags: {
      web_vital: metric.name,
    },
    extra: metric,
  })
  
  // OU enviar para Google Analytics
  if (window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(
        metric.name === 'CLS' ? metric.value * 1000 : metric.value
      ),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    })
  }
  
  // OU enviar para seu próprio endpoint
  // fetch('/api/analytics', { method: 'POST', body })
}
```

#### 3. Chamar no `main.tsx`

```typescript
import { reportWebVitals } from './utils/reportWebVitals'

// ... após render
reportWebVitals()
```

### Configurar Headers de Segurança

Como não estamos usando Helmet no React 19, configure headers no nível do servidor/CDN:

#### Para Vercel

Arquivo: `vercel.json`

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ]
}
```

#### Para Netlify

Arquivo: `netlify.toml`

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
```

---

## Acessibilidade e SEO

### Configurar Acessibilidade

#### 1. ESLint Plugin (já configurado acima)

Garante que seu código segue padrões de acessibilidade durante desenvolvimento.

**Exemplos de regras:**
- ✅ Imagens devem ter `alt`
- ✅ Botões devem ter texto acessível
- ✅ Formulários devem ter labels
- ✅ Cores devem ter contraste adequado

#### 2. Testes automatizados com Playwright + Axe

```bash
pnpm add -D @axe-core/playwright
```

Arquivo: `tests/accessibility.spec.ts`

```typescript
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility tests', () => {
  test('homepage should not have accessibility violations', async ({ page }) => {
    await page.goto('/')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })
  
  test('contact form should be accessible', async ({ page }) => {
    await page.goto('/contact')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('#contact-form')
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })
})
```

#### 3. Checklist manual de acessibilidade

- [ ] Navegação por teclado funciona (Tab, Enter, Esc)
- [ ] Focus visível em elementos interativos
- [ ] Contraste de cores adequado (mínimo 4.5:1)
- [ ] Textos alternativos em imagens
- [ ] Labels em formulários
- [ ] Hierarquia de headings correta (h1 → h2 → h3)
- [ ] ARIA labels quando necessário
- [ ] Testado com leitor de tela (NVDA ou VoiceOver)

### Configurar SEO

#### 1. Meta Tags com React 19

Arquivo: `src/App.tsx` ou em cada página

```typescript
export default function HomePage() {
  return (
    <>
      {/* Meta tags nativas do React 19 */}
      <title>Título da Página - Site do Cliente</title>
      <meta name="description" content="Descrição otimizada para SEO com 150-160 caracteres" />
      <meta name="keywords" content="palavra-chave1, palavra-chave2" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://seusite.com/" />
      <meta property="og:title" content="Título para redes sociais" />
      <meta property="og:description" content="Descrição para redes sociais" />
      <meta property="og:image" content="https://seusite.com/og-image.jpg" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://seusite.com/" />
      <meta property="twitter:title" content="Título para Twitter" />
      <meta property="twitter:description" content="Descrição para Twitter" />
      <meta property="twitter:image" content="https://seusite.com/twitter-image.jpg" />
      
      <div>
        {/* Conteúdo da página */}
      </div>
    </>
  )
}
```

#### 2. Robots.txt

Arquivo: `public/robots.txt`

```
User-agent: *
Allow: /

Sitemap: https://seusite.com/sitemap.xml
```

#### 3. Sitemap.xml

Para sites estáticos, crie manualmente:

Arquivo: `public/sitemap.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://seusite.com/</loc>
    <lastmod>2025-01-16</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://seusite.com/sobre</loc>
    <lastmod>2025-01-16</lastmod>
    <priority>0.8</priority>
  </url>
</urlset>
```

Para sites dinâmicos, considere usar biblioteca como `vite-plugin-sitemap`.

#### 4. Structured Data (Schema.org)

```typescript
export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Nome da Empresa",
    "url": "https://seusite.com",
    "logo": "https://seusite.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+55-11-1234-5678",
      "contactType": "customer service"
    }
  }
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* ... */}
    </>
  )
}
```

---

## Scripts Disponíveis

### Desenvolvimento

```bash
# Iniciar dev server
pnpm dev

# Rodar type-check
pnpm type-check

# Rodar lint
pnpm lint

# Corrigir lint automaticamente
pnpm lint:fix

# Formatar código
pnpm format
```

### Testes

```bash
# Testes unitários (uma vez)
pnpm test

# Testes unitários (watch mode)
pnpm test:watch

# Interface visual de testes
pnpm test:ui

# Coverage
pnpm test:coverage

# Testes E2E
pnpm test:e2e

# Testes E2E com UI
pnpm test:e2e:ui

# Debug testes E2E
pnpm test:e2e:debug
```

### Build e Análise

```bash
# Build de produção
pnpm build

# Preview do build localmente
pnpm preview

# Analisar bundle size
pnpm analyze

# Lighthouse CI
pnpm lighthouse
```

---

## Checklist de Qualidade

### Antes de Cada Commit

- [ ] Código passa no lint (`pnpm lint`)
- [ ] Código está formatado (`pnpm format`)
- [ ] Types estão corretos (`pnpm type-check`)
- [ ] Componentes têm testes unitários
- [ ] Código é acessível (sem warnings de a11y)

### Antes de Cada Deploy

- [ ] Todos os testes passam (`pnpm test`)
- [ ] Testes E2E passam (`pnpm test:e2e`)
- [ ] Build de produção funciona (`pnpm build`)
- [ ] Bundle size está aceitável (`pnpm analyze`)
- [ ] Lighthouse score > 90 em todas as categorias
- [ ] Sentry está configurado e recebendo eventos
- [ ] Core Web Vitals dentro dos limites:
  - LCP < 2.5s
  - INP < 200ms
  - CLS < 0.1
- [ ] Meta tags de SEO configuradas
- [ ] Imagens otimizadas (WebP, lazy loading)
- [ ] Headers de segurança configurados
- [ ] Variáveis de ambiente de produção configuradas

### Checklist de Acessibilidade

- [ ] Navegação por teclado funciona
- [ ] Focus visível
- [ ] Contraste adequado (usar Wave ou similar)
- [ ] Alt text em imagens
- [ ] Labels em formulários
- [ ] Testes automatizados de a11y passam
- [ ] Testado com leitor de tela

### Checklist de SEO

- [ ] Title tag único por página
- [ ] Meta description < 160 caracteres
- [ ] Open Graph tags configuradas
- [ ] Twitter Card configurada
- [ ] Sitemap.xml criado
- [ ] Robots.txt configurado
- [ ] Structured data implementado (quando relevante)
- [ ] URLs amigáveis
- [ ] Heading hierarchy correta (h1 → h6)

---

## Troubleshooting

### Problema: Aliases não funcionam

**Solução:**
1. Verifique `tsconfig.json` → `paths`
2. Verifique `vite.config.ts` → `resolve.alias`
3. Reinicie o servidor (`pnpm dev`)
4. Reinicie o TypeScript server na IDE

### Problema: Husky hooks não executam

**Solução:**
```bash
# Reinstalar hooks
pnpm exec husky install
chmod +x .husky/*
```

### Problema: Testes falham no CI mas passam localmente

**Solução:**
1. Certifique-se que `.env.test` existe
2. Limpe cache: `pnpm test --clearCache`
3. Verifique diferenças de timezone/locale

### Problema: Build falha com erro de memória

**Solução:**
```bash
# Aumentar limite de memória do Node
NODE_OPTIONS=--max-old-space-size=4096 pnpm build
```

---

## Recursos Adicionais

- [Documentação da Arquitetura](./ARCHITECTURE.md)
- [Guia de Contribuição](./CONTRIBUTING.md)
- [Changelog](./CHANGELOG.md)

---

**Dúvidas?** Consulte a documentação oficial de cada ferramenta ou abra uma issue no repositório.

**Última atualização:** Janeiro 2025
**Versão:** 1.0.0
