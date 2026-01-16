# Guia de Contribuição

> Como contribuir para este projeto mantendo qualidade e consistência

## Bem-vindo!

Obrigado por considerar contribuir para este projeto! Este guia vai te ajudar a entender nosso fluxo de trabalho, padrões de código e boas práticas.

## Índice

- [Código de Conduta](#código-de-conduta)
- [Começando](#começando)
- [Fluxo de Trabalho](#fluxo-de-trabalho)
- [Padrões de Código](#padrões-de-código)
- [Commits e Pull Requests](#commits-e-pull-requests)
- [Testes](#testes)
- [Revisão de Código](#revisão-de-código)
- [Dúvidas](#dúvidas)

---

## Código de Conduta

### Nossos Valores

- **Respeito:** Trate todos com cortesia e profissionalismo
- **Colaboração:** Trabalhe em equipe, compartilhe conhecimento
- **Qualidade:** Priorize código limpo, testado e documentado
- **Aprendizado:** Erros são oportunidades de crescimento

### Comportamento Esperado

✅ Seja respeitoso e construtivo em feedbacks  
✅ Aceite críticas com mente aberta  
✅ Foque no que é melhor para o projeto  
✅ Compartilhe conhecimento e ajude outros  
✅ Documente decisões importantes  

❌ Não tolere linguagem ofensiva ou discriminatória  
❌ Não faça ataques pessoais  
❌ Não publique informações privadas de outros  

---

## Começando

### Pré-requisitos

Certifique-se de ter instalado:
- Node.js 20.x ou superior
- pnpm 9.x ou superior
- Git 2.x ou superior

### Setup Inicial

```bash
# 1. Clone o repositório
git clone <repo-url>
cd <project-name>

# 2. Instale dependências
pnpm install

# 3. Copie o arquivo de ambiente
cp .env.example .env.local

# 4. Rode o projeto
pnpm dev
```

### Estrutura do Projeto

Leia atentamente:
- 📖 [ARCHITECTURE.md](./ARCHITECTURE.md) - Entenda as tecnologias usadas
- 📖 [SETUP-GUIDE.md](./SETUP-GUIDE.md) - Guia de configuração
- 📖 [FOLDER-STRUCTURE.md](./FOLDER-STRUCTURE.md) - Organização de código

---

## Fluxo de Trabalho

### 1. Antes de Começar

- [ ] Crie ou escolha uma issue existente
- [ ] Comente na issue que você vai trabalhar nela
- [ ] Entenda completamente o requisito antes de codificar
- [ ] Tire dúvidas se necessário

### 2. Criar Branch

Use o padrão de nomenclatura:

```bash
# Features novas
git checkout -b feature/nome-descritivo

# Correção de bugs
git checkout -b fix/descricao-do-bug

# Melhorias
git checkout -b improvement/o-que-melhorou

# Documentação
git checkout -b docs/o-que-documentou

# Refatoração
git checkout -b refactor/o-que-refatorou
```

**Exemplos:**
```bash
git checkout -b feature/add-user-authentication
git checkout -b fix/button-alignment-mobile
git checkout -b improvement/optimize-image-loading
git checkout -b docs/add-api-documentation
git checkout -b refactor/extract-form-validation
```

### 3. Desenvolver

```bash
# Rode o servidor de desenvolvimento
pnpm dev

# Em outro terminal, rode testes em watch mode
pnpm test:watch
```

**Enquanto desenvolve:**
- 💾 Faça commits frequentes e atômicos
- 🧪 Escreva testes para novas funcionalidades
- 📝 Atualize documentação se necessário
- 🔍 Use ESLint e Prettier (já rodam automaticamente no pre-commit)

### 4. Antes de Commitar

Execute manualmente para garantir qualidade:

```bash
# Type check
pnpm type-check

# Lint
pnpm lint

# Formatar
pnpm format

# Rodar todos os testes
pnpm test

# Testes E2E (se alterou fluxos críticos)
pnpm test:e2e
```

### 5. Criar Pull Request

- Push sua branch: `git push origin sua-branch`
- Abra PR no GitHub/GitLab
- Preencha o template de PR (veja seção abaixo)
- Marque revisores
- Aguarde feedback

---

## Padrões de Código

### TypeScript

#### Tipagem Forte

```typescript
// ❌ Evite any
function processData(data: any) { }

// ✅ Use tipos específicos
interface UserData {
  id: string
  name: string
  email: string
}
function processData(data: UserData) { }

// ✅ Use generics quando apropriado
function fetchData<T>(url: string): Promise<T> { }
```

#### Tipos vs Interfaces

```typescript
// ✅ Use type para unions, intersections, aliases
type Status = 'pending' | 'approved' | 'rejected'
type Point = { x: number; y: number }

// ✅ Use interface para objetos e classes
interface User {
  id: string
  name: string
}

interface Admin extends User {
  permissions: string[]
}
```

### React

#### Componentes Funcionais

```typescript
// ✅ Use arrow functions para componentes
export const Button = ({ children, onClick }: ButtonProps) => {
  return <button onClick={onClick}>{children}</button>
}

// ✅ Nomeie props interface com "Props"
interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
}
```

#### Hooks

```typescript
// ✅ Coloque hooks no topo do componente
export const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null)
  const { data, isLoading } = useQuery(['user'], fetchUser)
  
  // ... resto do componente
}

// ❌ Não use hooks condicionalmente
if (condition) {
  const [state, setState] = useState() // ERRADO!
}
```

#### Event Handlers

```typescript
// ✅ Use handle* para event handlers
const handleClick = () => { }
const handleSubmit = (e: React.FormEvent) => { }
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { }

// ✅ Use on* para props de eventos
interface ButtonProps {
  onClick?: () => void
  onSubmit?: (data: FormData) => void
}
```

### Imports

#### Ordem de Imports

```typescript
// 1. Imports externos (React, libraries)
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

// 2. Imports internos (aliases)
import { Button } from '@/components/ui'
import { useAuth } from '@/features/auth'
import { formatDate } from '@/utils/format'

// 3. Imports relativos
import { LoginForm } from './LoginForm'
import styles from './styles.module.css'

// 4. Types (se não inline)
import type { User } from '@/types'
```

#### Use Aliases

```typescript
// ❌ Evite imports relativos profundos
import { Button } from '../../../components/ui/Button'

// ✅ Use aliases configurados
import { Button } from '@/components/ui'
import { useAuth } from '@/features/auth'
```

### Nomenclatura

#### Variáveis e Funções

```typescript
// camelCase para variáveis, funções, hooks
const userName = 'John'
const isLoading = false
function fetchUserData() { }
const useCustomHook = () => { }
```

#### Componentes e Types

```typescript
// PascalCase para componentes, interfaces, types
const UserProfile = () => { }
interface UserData { }
type Status = 'active' | 'inactive'
```

#### Constantes

```typescript
// UPPER_SNAKE_CASE para constantes globais
const MAX_RETRY_ATTEMPTS = 3
const API_BASE_URL = 'https://api.example.com'

// camelCase para constantes locais/config objects
const defaultConfig = { timeout: 5000 }
```

#### Booleanos

```typescript
// Use is*, has*, should* para booleanos
const isLoading = false
const hasError = true
const shouldRender = false
const canEdit = true
```

### Tailwind CSS

#### Ordem de Classes

```typescript
// 1. Layout (display, position)
// 2. Box model (width, height, margin, padding)
// 3. Typography
// 4. Visual (background, border, shadow)
// 5. Interactivity (cursor, transition)

<div className="
  flex items-center justify-between
  w-full p-4 mt-2
  text-lg font-semibold
  bg-white border rounded-lg shadow-md
  hover:shadow-lg transition-shadow
">
```

#### Use cn() Helper

```typescript
import { cn } from '@/utils/cn'

// ✅ Para classes condicionais
<button className={cn(
  'px-4 py-2 rounded',
  isActive && 'bg-blue-600 text-white',
  isDisabled && 'opacity-50 cursor-not-allowed'
)}>
```

### Comentários

```typescript
// ✅ Comente o "porquê", não o "o quê"
// Workaround: API retorna null em vez de undefined
const userId = data?.userId ?? 'guest'

// ✅ Use JSDoc para funções públicas
/**
 * Formata valor monetário para BRL
 * @param value - Valor numérico
 * @returns String formatada (ex: "R$ 1.234,56")
 */
export function formatCurrency(value: number): string { }

// ❌ Evite comentários óbvios
// Incrementa contador
counter++
```

---

## Commits e Pull Requests

### Padrão de Commits (Conventional Commits)

Use o formato:

```
tipo(escopo): descrição curta

Descrição longa opcional explicando o contexto,
motivação e impacto da mudança.

Refs: #123
```

#### Tipos de Commit

- **feat:** Nova funcionalidade
- **fix:** Correção de bug
- **docs:** Mudanças na documentação
- **style:** Formatação, ponto e vírgula, etc (não afeta código)
- **refactor:** Refatoração de código (não adiciona feature nem corrige bug)
- **perf:** Melhorias de performance
- **test:** Adiciona ou corrige testes
- **chore:** Mudanças em build, configs, dependências

#### Exemplos

```bash
feat(auth): add login with Google OAuth

Implementa autenticação via Google OAuth 2.0.
Adiciona botão de login social e handler de callback.

Refs: #42

---

fix(cart): correct total calculation with discounts

O cálculo estava aplicando desconto duas vezes.
Agora aplica uma única vez no subtotal.

Refs: #89

---

docs(readme): update installation instructions

Adiciona instruções para pnpm e atualiza
versões de Node.js necessárias.

---

refactor(components): extract form validation logic

Move validação de formulário para hook customizado
para facilitar reutilização e testes.
```

### Template de Pull Request

Ao criar um PR, preencha:

```markdown
## Descrição
<!-- Descreva claramente o que este PR faz -->

## Tipo de Mudança
- [ ] 🐛 Bug fix (correção que resolve issue)
- [ ] ✨ Nova feature (adiciona funcionalidade)
- [ ] 💥 Breaking change (mudança que quebra compatibilidade)
- [ ] 📝 Documentação
- [ ] ♻️ Refatoração
- [ ] ⚡ Performance
- [ ] ✅ Testes

## Issue Relacionada
<!-- Link para issue: Closes #123 -->

## Como Testar
<!-- Passo a passo para revisor testar -->
1. Faça checkout desta branch
2. Execute `pnpm install` e `pnpm dev`
3. Navegue para /pagina-x
4. Teste funcionalidade Y

## Screenshots (se aplicável)
<!-- Adicione prints de antes/depois -->

## Checklist
- [ ] Código segue nossos padrões (lint passa)
- [ ] Testes adicionados/atualizados
- [ ] Documentação atualizada
- [ ] Testado localmente
- [ ] Testado em diferentes navegadores (se UI)
- [ ] Testado acessibilidade (se UI)
- [ ] Sem warnings no console
- [ ] Build de produção funciona
```

---

## Testes

### Cobertura Mínima

- **Componentes UI:** Renderização, props, interações básicas
- **Componentes de Feature:** Lógica de negócio, fluxos
- **Hooks:** Todos os casos de uso
- **Utilitários:** 100% de cobertura
- **Fluxos críticos:** Testes E2E (checkout, cadastro, login)

### Testes Unitários (Vitest)

```typescript
// Button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    
    await userEvent.click(screen.getByText('Click'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click</Button>)
    expect(screen.getByText('Click')).toBeDisabled()
  })
})
```

### Testes E2E (Playwright)

```typescript
// checkout-flow.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Checkout Flow', () => {
  test('completes purchase successfully', async ({ page }) => {
    await page.goto('/products')
    
    // Adiciona produto ao carrinho
    await page.getByRole('button', { name: 'Adicionar ao carrinho' }).first().click()
    
    // Vai para carrinho
    await page.getByRole('link', { name: 'Carrinho' }).click()
    expect(page.url()).toContain('/cart')
    
    // Finaliza compra
    await page.getByRole('button', { name: 'Finalizar compra' }).click()
    
    // Preenche formulário
    await page.getByLabel('Nome').fill('João Silva')
    await page.getByLabel('Email').fill('joao@example.com')
    
    // Confirma
    await page.getByRole('button', { name: 'Confirmar pedido' }).click()
    
    // Valida sucesso
    await expect(page.getByText('Pedido confirmado')).toBeVisible()
  })
})
```

### Quando Escrever Testes

**Sempre escreva testes para:**
- ✅ Lógica de negócio complexa
- ✅ Utilitários e helpers
- ✅ Hooks customizados
- ✅ Fluxos críticos (E2E)
- ✅ Correções de bugs (teste de regressão)

**Pode pular testes para:**
- ⚠️ Componentes muito simples (wrapper de div)
- ⚠️ Protótipos rápidos (mas adicione depois!)

---

## Revisão de Código

### Como Revisor

#### O Que Verificar

**Funcionalidade:**
- [ ] O código faz o que deveria fazer?
- [ ] Edge cases estão cobertos?
- [ ] Não introduz novos bugs?

**Qualidade:**
- [ ] Código é legível e fácil de entender?
- [ ] Segue nossos padrões?
- [ ] Está bem estruturado?
- [ ] Nomes são claros e descritivos?

**Testes:**
- [ ] Testes existem e são significativos?
- [ ] Cobertura adequada?
- [ ] Testes passam?

**Performance:**
- [ ] Não há loops desnecessários?
- [ ] Não há re-renders excessivos?
- [ ] Imagens estão otimizadas?

**Segurança:**
- [ ] Não expõe dados sensíveis?
- [ ] Valida inputs do usuário?
- [ ] Não tem vulnerabilidades óbvias?

**Acessibilidade (se UI):**
- [ ] Navegação por teclado funciona?
- [ ] Contraste adequado?
- [ ] Labels e alt texts presentes?

#### Como Dar Feedback

```markdown
✅ BOM:
"Este componente ficou muito limpo! Uma sugestão: poderíamos extrair 
a lógica de validação para um hook customizado para facilitar 
reutilização. O que você acha?"

❌ RUIM:
"Este código está uma bagunça. Refatore."
```

**Princípios:**
- 🎯 Seja específico e construtivo
- 💡 Sugira alternativas, não apenas critique
- 🤝 Assuma boa intenção do autor
- ❓ Faça perguntas em vez de ordens
- 🎉 Reconheça boas soluções

#### Níveis de Feedback

Use prefixos para clareza:

- **[nitpick]:** Não bloqueante, preferência pessoal
- **[question]:** Pedindo esclarecimento
- **[suggestion]:** Sugestão de melhoria
- **[important]:** Deve ser endereçado antes do merge
- **[blocking]:** Bloqueante, deve ser resolvido

```markdown
[nitpick] Você poderia usar `const` em vez de `let` aqui?

[question] Por que optou por usar useState em vez de useReducer?

[suggestion] Podemos extrair este cálculo para um utility?

[important] Este component está faltando prop types.

[blocking] Esta mudança quebra a funcionalidade de checkout.
```

### Como Autor

**Ao Receber Feedback:**
- 🙏 Agradeça o revisor pelo tempo
- 🤔 Considere sugestões com mente aberta
- 💬 Responda dúvidas e explique decisões
- ✏️ Faça mudanças solicitadas ou discuta alternativas
- ✅ Marque comentários como resolvidos

**Se Discordar:**
```markdown
"Entendo sua preocupação com performance aqui. Pensei nisso, mas 
optei por esta abordagem porque [razão]. Considerando que [contexto], 
acho que o tradeoff vale a pena. O que você acha? Estou aberto a 
outras sugestões!"
```

---

## Dúvidas

### Onde Perguntar

- **Issues:** Bugs, features, discussões técnicas
- **Pull Requests:** Dúvidas sobre código específico
- **Slack/Discord:** Dúvidas rápidas, discussões gerais
- **Documentação:** Consulte primeiro ARCHITECTURE.md e SETUP-GUIDE.md

### Boas Práticas ao Perguntar

✅ **Faça:**
- Pesquise primeiro na documentação e issues existentes
- Forneça contexto completo
- Inclua código, screenshots, logs de erro
- Descreva o que já tentou

❌ **Evite:**
- Perguntas muito genéricas ("Como fazer X?")
- Esperar resposta imediata
- Fazer múltiplas perguntas em uma única mensagem

### Template de Pergunta

```markdown
**Contexto:**
Estou implementando a feature X e preciso fazer Y.

**O que tentei:**
1. Tentei usar biblioteca Z mas deu erro A
2. Li a documentação de B mas não ficou claro

**Erro/Problema:**
[Cole o erro ou descreva o problema]

**Pergunta:**
Qual a melhor forma de fazer Y neste contexto?
```

---

## Recursos Úteis

### Documentação do Projeto
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Stack tecnológica
- [SETUP-GUIDE.md](./SETUP-GUIDE.md) - Setup e configuração
- [FOLDER-STRUCTURE.md](./FOLDER-STRUCTURE.md) - Organização de código

### Ferramentas
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Testing Library](https://testing-library.com)
- [Playwright Docs](https://playwright.dev)

### Padrões
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)

---

## Agradecimentos

Obrigado por contribuir! Cada PR, issue, revisão e discussão torna este projeto melhor. 🚀

**Mantenedores:**
- [Seu Nome] - [@seu-usuario]

---

**Última atualização:** Janeiro 2025
