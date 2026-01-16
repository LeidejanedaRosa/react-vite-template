# Estrutura de Pastas do Projeto

> Arquitetura feature-based escalável e pragmática

## Visão Geral

Este projeto usa uma arquitetura **feature-based** que organiza código por funcionalidade, não por tipo de arquivo. Isso facilita encontrar código relacionado e escalar de landing pages simples até aplicações complexas.

## Estrutura Completa

```
project-root/
├── public/                          # Arquivos estáticos servidos diretamente
│   ├── favicon.ico
│   ├── robots.txt
│   ├── sitemap.xml
│   └── images/                      # Imagens que não precisam ser processadas
│       └── og-image.jpg
│
├── src/
│   ├── main.tsx                     # Entry point da aplicação
│   ├── App.tsx                      # Componente raiz
│   ├── index.css                    # Estilos globais + Tailwind
│   │
│   ├── components/                  # Componentes compartilhados/reutilizáveis
│   │   ├── ui/                      # Componentes de UI primitivos
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.test.tsx
│   │   │   │   └── index.ts         # Barrel export
│   │   │   ├── Input/
│   │   │   ├── Card/
│   │   │   ├── Modal/
│   │   │   └── index.ts             # Exporta todos os componentes UI
│   │   │
│   │   ├── forms/                   # Componentes relacionados a formulários
│   │   │   ├── FormField/
│   │   │   ├── FormError/
│   │   │   └── index.ts
│   │   │
│   │   └── layout/                  # Componentes de layout
│   │       ├── Header/
│   │       ├── Footer/
│   │       ├── Sidebar/
│   │       ├── Container/
│   │       └── index.ts
│   │
│   ├── features/                    # Features/módulos do aplicativo
│   │   ├── auth/                    # Feature de autenticação
│   │   │   ├── components/          # Componentes específicos desta feature
│   │   │   │   ├── LoginForm/
│   │   │   │   ├── RegisterForm/
│   │   │   │   └── index.ts
│   │   │   ├── hooks/               # Hooks específicos
│   │   │   │   ├── useAuth.ts
│   │   │   │   └── useLogin.ts
│   │   │   ├── services/            # Chamadas de API
│   │   │   │   └── authService.ts
│   │   │   ├── types/               # Types específicos
│   │   │   │   └── auth.types.ts
│   │   │   ├── utils/               # Utilitários específicos
│   │   │   │   └── validatePassword.ts
│   │   │   └── index.ts             # Exporta API pública da feature
│   │   │
│   │   ├── products/                # Feature de produtos (e-commerce)
│   │   │   ├── components/
│   │   │   │   ├── ProductCard/
│   │   │   │   ├── ProductList/
│   │   │   │   ├── ProductFilters/
│   │   │   │   └── index.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useProducts.ts
│   │   │   │   └── useProductFilters.ts
│   │   │   ├── services/
│   │   │   │   └── productsService.ts
│   │   │   ├── types/
│   │   │   │   └── product.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── cart/                    # Feature de carrinho
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── index.ts
│   │   │
│   │   └── checkout/                # Feature de checkout
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── services/
│   │       └── index.ts
│   │
│   ├── pages/                       # Pages/Routes (quando usar TanStack Router)
│   │   ├── HomePage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── ProductsPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   ├── CartPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   └── NotFoundPage.tsx
│   │
│   ├── routes/                      # Configuração de rotas (TanStack Router)
│   │   ├── index.tsx
│   │   └── router.tsx
│   │
│   ├── hooks/                       # Hooks compartilhados/globais
│   │   ├── useLocalStorage.ts
│   │   ├── useMediaQuery.ts
│   │   ├── useDebounce.ts
│   │   ├── useOnClickOutside.ts
│   │   └── index.ts
│   │
│   ├── services/                    # Serviços compartilhados/API clients
│   │   ├── api/
│   │   │   ├── client.ts            # Axios/Fetch configurado
│   │   │   └── endpoints.ts         # URLs dos endpoints
│   │   └── analytics/
│   │       └── analytics.ts
│   │
│   ├── lib/                         # Configurações de bibliotecas externas
│   │   ├── sentry.ts                # Setup do Sentry
│   │   ├── tanstack-query.ts        # Setup do React Query
│   │   └── tanstack-router.ts       # Setup do Router
│   │
│   ├── utils/                       # Funções utilitárias compartilhadas
│   │   ├── format/
│   │   │   ├── currency.ts
│   │   │   ├── date.ts
│   │   │   └── index.ts
│   │   ├── validation/
│   │   │   ├── email.ts
│   │   │   ├── phone.ts
│   │   │   └── index.ts
│   │   ├── cn.ts                    # classnames utility (tailwind-merge)
│   │   └── index.ts
│   │
│   ├── types/                       # Types globais/compartilhados
│   │   ├── global.d.ts
│   │   ├── api.types.ts
│   │   └── common.types.ts
│   │
│   ├── constants/                   # Constantes da aplicação
│   │   ├── routes.ts
│   │   ├── config.ts
│   │   └── index.ts
│   │
│   ├── assets/                      # Assets processados pelo Vite
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   └── styles/                      # Estilos adicionais (se necessário)
│       └── animations.css
│
├── tests/                           # Testes E2E (Playwright)
│   ├── e2e/
│   │   ├── homepage.spec.ts
│   │   ├── checkout-flow.spec.ts
│   │   └── accessibility.spec.ts
│   ├── fixtures/
│   └── playwright.config.ts
│
├── .husky/                          # Git hooks
│   ├── pre-commit
│   └── pre-push
│
├── .vscode/                         # Configurações do VSCode
│   ├── settings.json
│   └── extensions.json
│
├── docs/                            # Documentação
│   ├── ARCHITECTURE.md
│   ├── SETUP-GUIDE.md
│   └── API.md
│
├── .env.example                     # Exemplo de variáveis de ambiente
├── .env.local                       # Variáveis locais (não commitado)
├── .eslintrc.cjs
├── .prettierrc
├── .gitignore
├── index.html
├── package.json
├── pnpm-lock.yaml
├── playwright.config.ts
├── postcss.config.js
├── README.md
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── vitest.config.ts
```

---

## Convenções de Nomenclatura

### Arquivos e Pastas

- **Componentes:** `PascalCase` (ex: `Button.tsx`, `ProductCard.tsx`)
- **Utilitários/Hooks:** `camelCase` (ex: `useAuth.ts`, `formatCurrency.ts`)
- **Tipos:** `camelCase.types.ts` (ex: `product.types.ts`)
- **Testes:** `ComponentName.test.tsx` ou `functionName.test.ts`
- **Páginas:** `PageName.tsx` (ex: `HomePage.tsx`)

### Pastas

- **Features:** `lowercase` (ex: `auth/`, `products/`)
- **Componentes:** `PascalCase` (ex: `Button/`, `ProductCard/`)

---

## Padrões de Organização

### 1. Componentes UI (Primitivos)

Componentes básicos e reutilizáveis em qualquer contexto.

**Localização:** `src/components/ui/`

**Exemplos:**
- Button, Input, Checkbox, Select
- Card, Badge, Avatar
- Modal, Dialog, Drawer
- Tooltip, Popover, Dropdown

**Estrutura:**
```
components/ui/Button/
├── Button.tsx           # Componente
├── Button.test.tsx      # Testes
└── index.ts             # Export { Button }
```

### 2. Componentes de Layout

Componentes estruturais que definem o layout.

**Localização:** `src/components/layout/`

**Exemplos:**
- Header, Footer, Sidebar
- Container, Grid, Stack
- Navigation, Breadcrumbs

### 3. Features (Módulos)

Código relacionado a uma funcionalidade específica.

**Localização:** `src/features/{feature-name}/`

**Quando criar uma feature:**
- ✅ Funcionalidade tem múltiplos componentes relacionados
- ✅ Tem lógica de negócio específica
- ✅ Tem suas próprias chamadas de API
- ✅ Pode crescer em complexidade

**Exemplo: Feature de Auth**
```
features/auth/
├── components/          # Componentes específicos de auth
│   ├── LoginForm/
│   ├── RegisterForm/
│   └── PasswordReset/
├── hooks/              # useAuth, useLogin, useRegister
├── services/           # authService.ts (API calls)
├── types/              # User, AuthState, etc
├── utils/              # validatePassword, etc
└── index.ts            # Exporta API pública
```

**API Pública da Feature:**
```typescript
// features/auth/index.ts
export { LoginForm, RegisterForm } from './components'
export { useAuth, useLogin } from './hooks'
export { authService } from './services'
export type { User, AuthState } from './types'
```

**Como usar:**
```typescript
// Em outro arquivo
import { LoginForm, useAuth } from '@/features/auth'
```

### 4. Páginas

Páginas são composições de componentes e features.

**Localização:** `src/pages/`

**Características:**
- Orquestram múltiplas features
- Mínima lógica de negócio (delegam para hooks/services)
- Focadas em layout e composição

**Exemplo:**
```typescript
// pages/ProductsPage.tsx
import { ProductList, ProductFilters } from '@/features/products'
import { Container } from '@/components/layout'

export default function ProductsPage() {
  return (
    <Container>
      <ProductFilters />
      <ProductList />
    </Container>
  )
}
```

### 5. Hooks Compartilhados

Hooks reutilizáveis que não pertencem a uma feature específica.

**Localização:** `src/hooks/`

**Exemplos:**
- `useLocalStorage` - Sincroniza estado com localStorage
- `useMediaQuery` - Detecta breakpoints
- `useDebounce` - Debounce de valores
- `useOnClickOutside` - Detecta cliques fora de elemento

### 6. Serviços

Lógica de comunicação com APIs e integrações externas.

**Localização:** `src/services/` (globais) ou `src/features/{feature}/services/` (específicos)

**Exemplo:**
```typescript
// services/api/client.ts
import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
})

// services/api/endpoints.ts
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id: string) => `/products/${id}`,
  },
}
```

### 7. Utilitários

Funções puras e reutilizáveis.

**Localização:** `src/utils/`

**Organização por categoria:**
```
utils/
├── format/
│   ├── currency.ts      # formatCurrency()
│   ├── date.ts          # formatDate()
│   └── index.ts
├── validation/
│   ├── email.ts         # isValidEmail()
│   ├── phone.ts         # isValidPhone()
│   └── index.ts
└── cn.ts                # classnames helper
```

---

## Quando Usar Cada Abordagem

### Landing Page Simples
```
src/
├── components/ui/       # Botões, Cards, etc
├── components/layout/   # Header, Footer
├── pages/              # HomePage, AboutPage
└── assets/             # Imagens, ícones
```

### E-commerce Médio
```
src/
├── components/         # UI + Layout
├── features/
│   ├── products/
│   ├── cart/
│   └── checkout/
├── pages/
└── hooks/              # Hooks compartilhados
```

### Aplicação Complexa
```
src/
├── components/         # UI + Layout
├── features/           # Múltiplas features
│   ├── auth/
│   ├── products/
│   ├── cart/
│   ├── checkout/
│   ├── admin/
│   └── analytics/
├── pages/
├── hooks/
├── services/
├── lib/                # Configs de bibliotecas
└── utils/
```

---

## Boas Práticas

### 1. Barrel Exports (index.ts)

Use `index.ts` para criar uma API limpa de cada módulo:

```typescript
// components/ui/index.ts
export { Button } from './Button'
export { Input } from './Input'
export { Card } from './Card'

// Uso
import { Button, Input, Card } from '@/components/ui'
```

### 2. Colocação (Colocation)

Mantenha arquivos relacionados próximos:

```
ProductCard/
├── ProductCard.tsx
├── ProductCard.test.tsx
├── ProductCard.stories.tsx  (se usar Storybook)
├── useProductCard.ts        (hook específico)
└── index.ts
```

### 3. Evite `shared/` ou `common/`

Em vez de pastas genéricas, seja específico:
- ❌ `shared/components/`
- ✅ `components/ui/` ou `components/layout/`

### 4. Feature Flags

Para features em desenvolvimento:

```typescript
// constants/features.ts
export const FEATURES = {
  NEW_CHECKOUT: import.meta.env.VITE_FEATURE_NEW_CHECKOUT === 'true',
  WISHLIST: import.meta.env.VITE_FEATURE_WISHLIST === 'true',
}

// Uso
if (FEATURES.NEW_CHECKOUT) {
  return <NewCheckout />
}
```

### 5. Imports Absolutos com Aliases

Use aliases configurados em `tsconfig.json`:

```typescript
// ❌ Imports relativos
import { Button } from '../../../components/ui/Button'

// ✅ Imports absolutos
import { Button } from '@/components/ui'
import { useAuth } from '@/features/auth'
import { formatCurrency } from '@/utils/format'
```

---

## Escalabilidade

### De Landing Page para E-commerce

**Passo 1:** Comece simples
```
src/
├── components/
├── pages/
└── assets/
```

**Passo 2:** Adicione features conforme necessário
```
src/
├── components/
├── features/
│   └── products/    # Primeira feature
├── pages/
└── hooks/
```

**Passo 3:** Expanda features
```
src/
├── components/
├── features/
│   ├── products/
│   ├── cart/
│   └── checkout/
├── pages/
├── hooks/
└── services/
```

---

## Exemplos Práticos

### Exemplo 1: Componente UI (Button)

```typescript
// components/ui/Button/Button.tsx
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/utils/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'font-medium rounded transition-colors',
          {
            'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
            'bg-gray-200 text-gray-900 hover:bg-gray-300': variant === 'secondary',
            'bg-transparent hover:bg-gray-100': variant === 'ghost',
          },
          {
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-base': size === 'md',
            'px-6 py-3 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    )
  }
)
```

### Exemplo 2: Feature Component (LoginForm)

```typescript
// features/auth/components/LoginForm/LoginForm.tsx
import { useState } from 'react'
import { Button } from '@/components/ui'
import { useLogin } from '../../hooks/useLogin'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, isLoading, error } = useLogin()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login({ email, password })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form fields */}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Entrando...' : 'Entrar'}
      </Button>
      {error && <p className="text-red-600">{error}</p>}
    </form>
  )
}
```

### Exemplo 3: Página Composta

```typescript
// pages/ProductsPage.tsx
import { Container } from '@/components/layout'
import { ProductList, ProductFilters } from '@/features/products'
import { useProducts } from '@/features/products'

export default function ProductsPage() {
  const { products, isLoading, filters, setFilters } = useProducts()

  return (
    <Container>
      <h1>Nossos Produtos</h1>
      
      <div className="grid grid-cols-4 gap-6">
        <aside>
          <ProductFilters filters={filters} onChange={setFilters} />
        </aside>
        
        <main className="col-span-3">
          <ProductList products={products} isLoading={isLoading} />
        </main>
      </div>
    </Container>
  )
}
```

---

## Migração de Atomic Design

Se você já tem projeto em Atomic Design:

```bash
# De Atomic
components/atoms/Button
components/molecules/FormField
components/organisms/LoginForm

# Para Feature-Based
components/ui/Button           # atoms viram ui/
components/forms/FormField     # molecules viram categorias lógicas
features/auth/LoginForm        # organisms viram features
```

---

## Recursos

- [Feature-Sliced Design](https://feature-sliced.design/)
- [Bulletproof React](https://github.com/alan2207/bulletproof-react)
- [Project Structure - Kent C. Dodds](https://kentcdodds.com/blog/colocation)

---

**Última atualização:** Janeiro 2025
