#!/bin/bash
set -e

echo "🔍 Iniciando validações pré-deploy..."

echo "🔷 Verificando tipos TypeScript..."
pnpm run type-check

echo "📝 Verificando lint..."
pnpm run lint

echo "🧪 Rodando testes unitários com cobertura..."
pnpm run test:coverage

echo "🏗️ Verificando build de produção..."
pnpm run build

echo "✅ Todas as validações passaram! Pronto para deploy."
