# Decisões de Projeto

Registro de decisões de tooling, configuração e arquitetura com contexto, alternativas rejeitadas e raciocínio. Atualizar sempre que uma decisão relevante for tomada.

---

## 2026-11-24 — ESLint 10 adiado

**Contexto**: o ESLint 9 deixou de ter suporte (sem correções novas) e o ESLint 10 está
disponível. Na tentativa de atualizar (`eslint` 10.15 e `@eslint/js` 10), o lint parou no primeiro
arquivo:

```
TypeError: Error while loading rule 'react/display-name': contextOrFilename.getFilename is not a function
```

O ESLint 10 removeu as APIs antigas do `context` (`getFilename`, `getScope`...), e o
`eslint-plugin-react` 7.37.5 ainda as usa. Nem a versão `next` dele declara suporte ao 10. O
`eslint-plugin-jsx-a11y` 6.10.2 também não declara, mas funciona: com o `eslint-plugin-react`
desligado, ele acusou um `<img>` sem `alt` e um `onClick` numa `div` (prova inversa), e o projeto
inteiro passou no lint.

**Decisão**: continuar no ESLint 9 até o `eslint-plugin-react` suportar o 10.

**Alternativas rejeitadas**:

- **Trocar pelo `@eslint-react/eslint-plugin`**, que suporta o ESLint 10. É uma migração de verdade
  (mapear regras, tratar achados novos no código), não uma atualização de versão. Fica como
  caminho, caso o `eslint-plugin-react` continue parado.
- **ESLint 10 sem as regras `react/`**: perde regras como `jsx-key` e `no-unescaped-entities` sem
  substituto. Troca uma lacuna por outra.

**Raciocínio**: o ESLint é ferramenta de desenvolvimento: lê só o próprio código, não recebe dado
de usuário e não vai para produção. Sem suporte quer dizer sem correção nova, mas o risco prático
é baixo, ao contrário de uma dependência que vai para o navegador.

**Quando rever**: quando o `eslint-plugin-react` publicar versão com `eslint ^10` no
`peerDependencies` (`npm view eslint-plugin-react peerDependencies.eslint`). O PR mensal do
Dependabot para o ESLint 10 e a revisão trimestral (`/revisar-padroes`) são os lembretes.
