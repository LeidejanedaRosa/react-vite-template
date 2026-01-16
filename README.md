# React Vite Template 🚀

Template profissional e moderno para projetos React com todas as melhores práticas, pronto para produção.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646cff)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

### Core Stack
- ⚛️ **React 19** - Com suporte nativo a meta tags
- ⚡ **Vite 6** - Build tool ultrarrápido
- 📘 **TypeScript 5** - Type safety total
- 🎨 **Tailwind CSS 4** - Utility-first CSS framework

### Qualidade de Código
- ✅ **ESLint** - Linting configurado (React, TypeScript, a11y)
- 💅 **Prettier** - Formatação automática
- 🐶 **Husky** - Git hooks (pre-commit, pre-push)
- 🔍 **lint-staged** - Lint apenas arquivos modificados

### Testes
- 🧪 **Vitest** - Testes unitários e de integração
- 🎭 **Playwright** - Testes E2E cross-browser
- 🧑‍🦯 **@axe-core/playwright** - Testes de acessibilidade

### Monitoramento e Performance
- 📊 **Core Web Vitals** - Tracking de performance
- 🐛 **Sentry** - Error tracking e performance monitoring
- 💡 **Lighthouse** - Auditorias de qualidade
- 📦 **Bundle Analyzer** - Análise de tamanho do bundle

### Developer Experience
- 🛣️ **Path Aliases** - Imports absolutos configurados
- 📝 **Documentação** - Guias completos inclusos
- 🔄 **Hot Reload** - HMR instantâneo
- 🎯 **Feature-Based Structure** - Organização escalável

## 🚀 Quick Start

### Pré-requisitos

- Node.js 20+ ([Download](https://nodejs.org))
- pnpm 9+ (Recomendado)

```bash
# Instalar pnpm
npm install -g pnpm
```

### Instalação

```bash
# 1. Clone ou use como template
git clone https://github.com/seu-usuario/react-vite-template.git meu-projeto
cd meu-projeto

# 2. Instalar dependências
pnpm install

# 3. Copiar arquivo de ambiente
cp .env.example .env.local

# 4. Iniciar dev server
pnpm dev
```

Acesse http://localhost:5173 🎉

## 📦 Scripts Disponíveis

### Desenvolvimento
```bash
pnpm dev          # Inicia dev server
pnpm build        # Build de produção
pnpm preview      # Preview do build local
```

### Qualidade de Código
```bash
pnpm type-check   # Verifica tipos TypeScript
pnpm lint         # Roda ESLint
pnpm lint:fix     # Corrige problemas de lint
pnpm format       # Formata código com Prettier
```

### Testes
```bash
pnpm test              # Testes unitários (run once)
pnpm test:watch        # Testes em watch mode
pnpm test:ui           # Interface visual de testes
pnpm test:coverage     # Coverage report

pnpm test:e2e          # Testes E2E
pnpm test:e2e:ui       # Testes E2E com UI
pnpm test:e2e:debug    # Debug testes E2E
```

### Análise
```bash
pnpm analyze      # Analisa tamanho do bundle
pnpm lighthouse   # Roda auditorias Lighthouse
```

## 📁 Estrutura do Projeto

```
├── src/
│   ├── components/          # Componentes compartilhados
│   │   ├── ui/             # Componentes UI primitivos
│   │   ├── layout/         # Componentes de layout
│   │   └── forms/          # Componentes de formulário
│   ├── features/           # Features/módulos
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Configs de bibliotecas
│   ├── services/           # API clients
│   ├── utils/              # Utilitários
│   ├── types/              # Types TypeScript
│   ├── assets/             # Assets estáticos
│   └── test/               # Setup de testes
├── tests/
│   └── e2e/                # Testes E2E
├── public/                 # Arquivos públicos
└── docs/                   # Documentação
```

## 📚 Documentação

- 📖 [ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Decisões arquiteturais
- ⚙️ [SETUP-GUIDE.md](./docs/SETUP-GUIDE.md) - Guia de configuração
- 📁 [FOLDER-STRUCTURE.md](./docs/FOLDER-STRUCTURE.md) - Organização de código
- 🤝 [CONTRIBUTING.md](./docs/CONTRIBUTING.md) - Guia de contribuição
- 📝 [CHANGELOG.md](./docs/CHANGELOG.md) - Histórico de versões
- 🔐 [BETTER-AUTH-GUIDE.md](./docs/BETTER-AUTH-GUIDE.md) - Guia de autenticação

## 🔧 Configuração

### Variáveis de Ambiente

Copie `.env.example` para `.env.local` e configure:

```env
# Application
VITE_APP_NAME=Meu App
VITE_APP_ENV=development

# API
VITE_API_URL=http://localhost:3001

# Sentry (opcional)
VITE_SENTRY_DSN=your-sentry-dsn

# Analytics (opcional)
VITE_GA_MEASUREMENT_ID=your-ga-id
```

### Path Aliases

Aliases configurados e prontos para uso:

```typescript
import { Button } from '@components/ui'
import { useAuth } from '@features/auth'
import { formatDate } from '@utils/format'
```

## 🎯 Boas Práticas Incluídas

### Acessibilidade (a11y)
- ✅ ESLint plugin jsx-a11y
- ✅ Testes automatizados de acessibilidade
- ✅ Focus visível em elementos interativos
- ✅ Navegação por teclado

### SEO
- ✅ Meta tags com React 19
- ✅ robots.txt e sitemap.xml
- ✅ Structured data ready
- ✅ Open Graph configurado

### Performance
- ✅ Code splitting automático
- ✅ Lazy loading de componentes
- ✅ Bundle optimization
- ✅ Source maps para debug

### Segurança
- ✅ Headers de segurança
- ✅ CSRF protection ready
- ✅ Sanitização de inputs
- ✅ Content Security Policy

## 🚢 Deploy

### Vercel (Recomendado)

```bash
# 1. Instalar Vercel CLI
pnpm add -g vercel

# 2. Deploy
vercel
```

### Netlify

```bash
# Build command
pnpm build

# Publish directory
dist
```

### Docker

```bash
docker build -t meu-app .
docker run -p 3000:3000 meu-app
```

## 🛠️ Customização

### Cores do Tema

Edite `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Suas cores
      },
    },
  },
}
```

### Componentes UI

Adicione novos componentes em `src/components/ui/`:

```typescript
// src/components/ui/Card.tsx
export function Card({ children }) {
  return <div className="...">{children}</div>
}

// src/components/ui/index.ts
export { Card } from './Card'
```

## 📊 Checklist de Qualidade

Antes de fazer deploy:

- [ ] Todos os testes passam
- [ ] Lint sem erros
- [ ] Build de produção funciona
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals dentro dos limites
- [ ] Testes de acessibilidade passam
- [ ] Meta tags configuradas
- [ ] Sentry configurado (prod)

## 🤝 Contribuindo

Leia [CONTRIBUTING.md](./docs/CONTRIBUTING.md) para detalhes sobre nosso código de conduta e processo de pull requests.

## 📄 Licença

Este projeto está sob a licença MIT - veja [LICENSE](LICENSE) para detalhes.

## 🙏 Agradecimentos

Este template foi construído com base nas melhores práticas da comunidade React e feedback de desenvolvedores experientes.

---

**Criado com ❤️ para acelerar desenvolvimento de projetos React profissionais**

## 📞 Suporte

- 📧 Email: seu@email.com
- 🐛 Issues: [GitHub Issues](https://github.com/seu-usuario/react-vite-template/issues)
- 💬 Discussões: [GitHub Discussions](https://github.com/seu-usuario/react-vite-template/discussions)

---

⭐ Se este template foi útil, considere dar uma estrela no GitHub!
