# 🚀 Início Rápido - Novo Projeto

Checklist para iniciar um novo projeto a partir deste template.

## ✅ Passo a Passo

### 1. Clonar Template

```bash
# Via GitHub CLI (recomendado)
gh repo create meu-novo-projeto --template seu-usuario/react-vite-template --private --clone

# OU clone manual
git clone https://github.com/seu-usuario/react-vite-template.git meu-novo-projeto
cd meu-novo-projeto
rm -rf .git
git init
```

### 2. Personalizar package.json

Edite `package.json`:

```json
{
  "name": "meu-novo-projeto",
  "description": "Descrição do seu projeto",
  "author": "Seu Nome <seu@email.com>",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/seu-usuario/meu-novo-projeto.git"
  }
}
```

### 3. Instalar Dependências

```bash
pnpm install
```

### 4. Configurar Ambiente

```bash
# Copiar arquivo de ambiente
cp .env.example .env.local

# Editar variáveis
nano .env.local  # ou seu editor preferido
```

**Variáveis importantes:**
- `VITE_APP_NAME` - Nome da sua aplicação
- `VITE_API_URL` - URL da sua API
- `VITE_SENTRY_DSN` - DSN do Sentry (se usar)

### 5. Personalizar Branding

#### Título e Meta Tags

Edite `src/App.tsx`:

```tsx
<title>Meu Projeto - Descrição</title>
<meta name="description" content="Descrição do meu projeto" />
```

#### Cores do Tema

Edite `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Suas cores personalizadas
      },
    },
  },
}
```

#### Favicon

Substitua `public/vite.svg` pelo seu favicon.

### 6. Configurar Git

```bash
git add .
git commit -m "feat: initial project setup"
git branch -M main
git remote add origin https://github.com/seu-usuario/meu-novo-projeto.git
git push -u origin main
```

### 7. Configurar Husky

```bash
# Instalar git hooks
pnpm prepare

# Tornar hooks executáveis (Mac/Linux)
chmod +x .husky/*
```

### 8. Rodar Projeto

```bash
# Desenvolvimento
pnpm dev

# Build
pnpm build

# Preview
pnpm preview
```

### 9. Verificar Qualidade

```bash
# Type check
pnpm type-check

# Lint
pnpm lint

# Tests
pnpm test

# E2E tests (requer build rodando)
pnpm test:e2e
```

### 10. Deploy Inicial

#### Vercel

```bash
# Instalar CLI
pnpm add -g vercel

# Deploy
vercel

# Seguir prompts para configurar projeto
```

#### Netlify

1. Conecte seu repositório no dashboard do Netlify
2. Configure build:
   - Build command: `pnpm build`
   - Publish directory: `dist`
   - Node version: `20`

## 🔧 Configurações Opcionais

### Sentry (Error Tracking)

1. Crie projeto em [sentry.io](https://sentry.io)
2. Copie o DSN
3. Adicione no `.env.local`:

```env
VITE_SENTRY_DSN=https://seu-dsn@sentry.io/projeto
VITE_SENTRY_ENVIRONMENT=production
```

### Google Analytics

Adicione no `.env.local`:

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Better Auth (Autenticação)

Veja [BETTER-AUTH-GUIDE.md](./docs/BETTER-AUTH-GUIDE.md) para configuração completa.

## 📝 Próximos Passos

- [ ] Ler [ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- [ ] Ler [FOLDER-STRUCTURE.md](./docs/FOLDER-STRUCTURE.md)
- [ ] Configurar CI/CD (GitHub Actions, GitLab CI)
- [ ] Adicionar testes específicos do projeto
- [ ] Configurar analytics
- [ ] Configurar error tracking

## 🆘 Problemas Comuns

### Husky hooks não executam

```bash
chmod +x .husky/*
pnpm prepare
```

### Erros de tipo TypeScript

```bash
# Limpar cache
rm -rf node_modules
pnpm install
```

### Build falha

```bash
# Verificar type errors
pnpm type-check

# Verificar lint
pnpm lint
```

## 📚 Recursos

- [Documentação Completa](./docs/)
- [Guia de Contribuição](./docs/CONTRIBUTING.md)
- [Changelog](./docs/CHANGELOG.md)

---

**Dica:** Mantenha este arquivo atualizado com as particularidades do seu projeto!
