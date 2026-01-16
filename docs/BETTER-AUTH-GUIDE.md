# Better Auth - Guia de Integração

> Autenticação completa e type-safe com controle total

## Por que Better Auth?

### Vantagens
- ✅ **Open source e gratuito** - Sem custos mensais
- ✅ **Controle total** - Toda lógica no seu código
- ✅ **Type-safe** - TypeScript first
- ✅ **Dados próprios** - Usuários no seu banco
- ✅ **Sem vendor lock-in** - Migração fácil
- ✅ **Flexível** - Adapta a qualquer regra de negócio

### Comparação com Auth0

| Feature | Better Auth | Auth0 |
|---------|-------------|-------|
| Custo | Gratuito | $0-$240+/mês |
| Controle | Total | Limitado |
| Customização | Ilimitada | Restrita |
| Vendor Lock-in | Não | Sim |
| Compliance | Você gerencia | Gerenciado |
| Setup | 30 min | 10 min |
| Escalabilidade | Você gerencia | Automática |

**Use Better Auth quando:**
- Quer controle total sobre auth
- Precisa de regras customizadas
- Quer economizar custos
- Dados sensíveis devem ficar no seu servidor

**Use Auth0 quando:**
- Cliente exige compliance específico
- Precisa de Enterprise SSO (SAML, LDAP)
- Projeto enorme (100k+ usuários) desde início
- Cliente prefere serviço gerenciado

---

## Arquitetura Proposta

### Stack Completa

```
┌─────────────────────────────────────┐
│  Frontend (Vite + React + TS)       │
│  - Better Auth React SDK            │
│  - TanStack Query (cache)           │
└─────────────┬───────────────────────┘
              │ HTTP (fetch/axios)
              ↓
┌─────────────────────────────────────┐
│  Backend (Hono + Better Auth)       │
│  - API Routes                       │
│  - Auth middleware                  │
│  - Session management               │
└─────────────┬───────────────────────┘
              │ SQL
              ↓
┌─────────────────────────────────────┐
│  Database (PostgreSQL/SQLite)       │
│  - Users table                      │
│  - Sessions table                   │
│  - Accounts table (OAuth)           │
└─────────────────────────────────────┘
```

### Por que Hono?

**Hono é ideal para freelancer:**
- 🚀 Extremamente rápido (mais que Express)
- 📦 Bundle minúsculo (~15kb)
- 🎯 TypeScript first com RPC type-safe
- 🔌 Middlewares simples e poderosos
- 💰 Serverless friendly (Vercel, Cloudflare, AWS)
- 🧩 Integração fácil com Better Auth
- 🌐 Edge runtime support

---

## Instalação

### 1. Dependências do Backend

```bash
# Criar projeto backend separado (recomendado)
mkdir api && cd api
pnpm init

# Better Auth + Hono
pnpm add better-auth hono

# ORM (escolha um)
pnpm add drizzle-orm postgres # PostgreSQL
# OU
pnpm add drizzle-orm better-sqlite3 # SQLite

# Dev dependencies
pnpm add -D drizzle-kit tsx @types/node
```

### 2. Dependências do Frontend

```bash
# No projeto Vite + React
pnpm add better-auth @tanstack/react-query

# Axios ou fetch (opcional, mas recomendado)
pnpm add axios
```

---

## Configuração Backend

### Estrutura do Projeto Backend

```
api/
├── src/
│   ├── index.ts              # Entry point Hono
│   ├── auth.ts               # Better Auth config
│   ├── db/
│   │   ├── schema.ts         # Database schema
│   │   └── index.ts          # DB connection
│   ├── routes/
│   │   ├── auth.ts           # Auth routes
│   │   └── users.ts          # User routes
│   └── middleware/
│       └── auth.ts           # Auth middleware
├── drizzle.config.ts
├── package.json
└── tsconfig.json
```

### 1. Database Schema

```typescript
// src/db/schema.ts
import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  emailVerified: boolean('email_verified').default(false),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
})

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  expiresAt: timestamp('expires_at'),
})
```

### 2. Better Auth Config

```typescript
// src/auth.ts
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from './db'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg', // ou 'sqlite'
  }),
  
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 dias
    updateAge: 60 * 60 * 24, // Atualizar a cada 24h
  },
  
  advanced: {
    cookiePrefix: 'myapp',
    generateId: () => crypto.randomUUID(),
  },
})
```

### 3. Hono Server

```typescript
// src/index.ts
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { auth } from './auth'

const app = new Hono()

// Middlewares
app.use('*', logger())
app.use(
  '*',
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
)

// Better Auth routes
app.all('/api/auth/*', (c) => {
  return auth.handler(c.req.raw)
})

// Protected route example
app.get('/api/user', async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })

  if (!session) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  return c.json({ user: session.user })
})

export default app

// Para desenvolvimento local
if (import.meta.env?.DEV) {
  const port = 3001
  console.log(`🚀 Server running at http://localhost:${port}`)
  
  // @ts-ignore
  export default {
    port,
    fetch: app.fetch,
  }
}
```

### 4. Auth Middleware

```typescript
// src/middleware/auth.ts
import { Context, Next } from 'hono'
import { auth } from '../auth'

export async function requireAuth(c: Context, next: Next) {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })

  if (!session) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  // Adiciona user no contexto
  c.set('user', session.user)
  c.set('session', session.session)

  await next()
}

// Uso:
// app.get('/api/profile', requireAuth, async (c) => {
//   const user = c.get('user')
//   return c.json({ user })
// })
```

---

## Configuração Frontend

### Estrutura do Projeto Frontend

```
src/
├── features/
│   └── auth/
│       ├── components/
│       │   ├── LoginForm.tsx
│       │   ├── RegisterForm.tsx
│       │   └── SocialLogin.tsx
│       ├── hooks/
│       │   ├── useAuth.ts
│       │   └── useSession.ts
│       ├── services/
│       │   └── authClient.ts
│       └── types/
│           └── auth.types.ts
└── lib/
    ├── auth.ts              # Better Auth client
    └── queryClient.ts       # React Query client
```

### 1. Better Auth Client

```typescript
// src/lib/auth.ts
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
})

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  useUser,
} = authClient
```

### 2. Auth Provider

```typescript
// src/providers/AuthProvider.tsx
import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

### 3. useAuth Hook

```typescript
// src/features/auth/hooks/useAuth.ts
import { useSession, signIn, signOut, signUp } from '@/lib/auth'
import { useMutation } from '@tanstack/react-query'

export function useAuth() {
  const { data: session, isPending: isLoadingSession } = useSession()

  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string
      password: string
    }) => {
      const { data, error } = await signIn.email({
        email,
        password,
      })

      if (error) throw new Error(error.message)
      return data
    },
  })

  const registerMutation = useMutation({
    mutationFn: async ({
      email,
      password,
      name,
    }: {
      email: string
      password: string
      name: string
    }) => {
      const { data, error } = await signUp.email({
        email,
        password,
        name,
      })

      if (error) throw new Error(error.message)
      return data
    },
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await signOut()
    },
  })

  return {
    user: session?.user ?? null,
    isAuthenticated: !!session?.user,
    isLoading: isLoadingSession,
    
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
  }
}
```

### 4. Login Form

```typescript
// src/features/auth/components/LoginForm.tsx
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Button } from '@/components/ui'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, isLoggingIn } = useAuth()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      await login({ email, password })
      // Redirect ou callback de sucesso
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Senha
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border px-3 py-2"
        />
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
          {error}
        </div>
      )}

      <Button type="submit" disabled={isLoggingIn} className="w-full">
        {isLoggingIn ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  )
}
```

### 5. Social Login

```typescript
// src/features/auth/components/SocialLogin.tsx
import { signIn } from '@/lib/auth'
import { Button } from '@/components/ui'

export function SocialLogin() {
  const handleGoogleLogin = async () => {
    await signIn.social({
      provider: 'google',
      callbackURL: '/dashboard',
    })
  }

  const handleGithubLogin = async () => {
    await signIn.social({
      provider: 'github',
      callbackURL: '/dashboard',
    })
  }

  return (
    <div className="space-y-3">
      <Button
        onClick={handleGoogleLogin}
        variant="secondary"
        className="w-full"
      >
        <img src="/google-icon.svg" className="w-5 h-5 mr-2" />
        Continuar com Google
      </Button>

      <Button
        onClick={handleGithubLogin}
        variant="secondary"
        className="w-full"
      >
        <img src="/github-icon.svg" className="w-5 h-5 mr-2" />
        Continuar com GitHub
      </Button>
    </div>
  )
}
```

### 6. Protected Route

```typescript
// src/components/ProtectedRoute.tsx
import { ReactNode } from 'react'
import { Navigate } from '@tanstack/react-router'
import { useAuth } from '@/features/auth/hooks/useAuth'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <div>Carregando...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return <>{children}</>
}
```

---

## Deploy

### Backend (Vercel)

```json
// vercel.json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "installCommand": "pnpm install",
  "framework": null,
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api"
    }
  ]
}
```

### Variáveis de Ambiente

```bash
# Backend (.env)
DATABASE_URL=postgresql://...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
FRONTEND_URL=https://seusite.com

# Frontend (.env.local)
VITE_API_URL=https://api.seusite.com
```

---

## Features Principais

### ✅ Email/Password
- Registro com verificação de email
- Login com email e senha
- Reset de senha
- Change password

### ✅ Social Login
- Google OAuth
- GitHub OAuth
- Outros providers (configurável)

### ✅ Sessões
- Cookie-based sessions
- Token refresh automático
- Multi-device support
- Session revocation

### ✅ Segurança
- Password hashing (bcrypt)
- CSRF protection
- Rate limiting
- XSS protection

---

## Próximos Passos

1. **Multi-factor Authentication (MFA)**
   - TOTP (Google Authenticator)
   - SMS verification

2. **Role-based Access Control (RBAC)**
   - Roles e permissions
   - Protected routes por role

3. **Email Templates**
   - Welcome email
   - Password reset
   - Email verification

4. **Admin Dashboard**
   - User management
   - Session monitoring
   - Analytics

---

## Recursos

- [Better Auth Docs](https://www.better-auth.com/docs)
- [Hono Docs](https://hono.dev)
- [Drizzle ORM](https://orm.drizzle.team)

---

**Última atualização:** Janeiro 2025
