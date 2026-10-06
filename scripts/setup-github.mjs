#!/usr/bin/env node
// Aplica o padrão de configuração do GitHub a um repositório: proteção de branch, merge só por
// merge commit, Dependabot, secret scanning e CodeQL.
// Idempotente: rodar de novo apenas atualiza o que já existe.
// Requer o GitHub CLI (`gh`) autenticado com um token de escopo `repo`.
import { execFileSync } from 'node:child_process'
import { parseArgs } from 'node:util'

const RULESET_NAME = 'Proteger branches de integração'

const HELP = `
Uso:
  node scripts/setup-github.mjs <dono/repositório> [opções]

Opções:
  --branch <nome>   Branch extra a proteger, além da branch padrão. Pode repetir.
  --check <nome>    Verificação exigida antes do merge. Pode repetir.
                    É o texto de "name:" de cada job do CI, mais "Vercel" se houver deploy.
  --dry-run         Mostra o que seria feito, sem alterar nada.
  -h, --help        Mostra esta ajuda.

Exemplo:
  node scripts/setup-github.mjs LeidejanedaRosa/meu-projeto \\
    --branch feat/landing \\
    --check "Lint, tipos, testes e build" --check "Vercel"
`

const { values: options, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    branch: { type: 'string', multiple: true, default: [] },
    check: { type: 'string', multiple: true, default: [] },
    'dry-run': { type: 'boolean', default: false },
    help: { type: 'boolean', short: 'h', default: false },
  },
})

const [repo] = positionals

if (options.help || !repo) {
  console.log(HELP)
  process.exit(options.help ? 0 : 1)
}

if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) {
  console.error(
    `Repositório inválido: "${repo}". Use o formato dono/repositório.`
  )
  process.exit(1)
}

const dryRun = options['dry-run']

function gh(method, path, body) {
  if (dryRun && method !== 'GET') {
    console.log(
      `    [dry-run] ${method} ${path}${body ? ` ${JSON.stringify(body)}` : ''}`
    )
    return null
  }

  const args = ['api', '-X', method, `repos/${repo}/${path}`.replace(/\/$/, '')]
  const output = execFileSync('gh', body ? [...args, '--input', '-'] : args, {
    input: body ? JSON.stringify(body) : undefined,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
  })

  return output.trim() ? JSON.parse(output) : null
}

function describeError(error) {
  const raw =
    `${error.stdout ?? ''}${error.stderr ?? ''}`.trim() || error.message

  try {
    return JSON.parse(raw.split('\n')[0]).message
  } catch {
    return raw.split('\n')[0]
  }
}

// Recusas que significam "este recurso não existe para este repositório" (ex.: secret
// scanning e CodeQL em repositório privado sem Advanced Security). Qualquer outro erro,
// como conflito ou serviço indisponível, é falha de verdade.
const NOT_APPLICABLE_STATUS = [403, 422]
const NOT_APPLICABLE_MESSAGE =
  /advanced security|not available|not supported|not enabled|no supported languages/i

function isNotApplicable(error) {
  const status = Number(/\(HTTP (\d{3})\)/.exec(`${error.stderr ?? ''}`)?.[1])

  return (
    NOT_APPLICABLE_STATUS.includes(status) &&
    NOT_APPLICABLE_MESSAGE.test(describeError(error))
  )
}

const failures = []

function step(label, action, { required = false } = {}) {
  try {
    action()
    console.log(`  ✓ ${label}`)
  } catch (error) {
    const skipped = !required && isNotApplicable(error)

    console.log(`  ${skipped ? '–' : '✗'} ${label}: ${describeError(error)}`)
    if (!skipped) failures.push(label)
  }
}

function buildRuleset() {
  const rules = [
    { type: 'deletion' },
    { type: 'non_fast_forward' },
    {
      type: 'pull_request',
      parameters: {
        required_approving_review_count: 0,
        dismiss_stale_reviews_on_push: false,
        require_code_owner_review: false,
        require_last_push_approval: false,
        required_review_thread_resolution: false,
        allowed_merge_methods: ['merge'],
      },
    },
  ]

  if (options.check.length > 0) {
    rules.push({
      type: 'required_status_checks',
      parameters: {
        strict_required_status_checks_policy: false,
        required_status_checks: options.check.map(context => ({ context })),
      },
    })
  }

  return {
    name: RULESET_NAME,
    target: 'branch',
    enforcement: 'active',
    conditions: {
      ref_name: {
        include: [
          '~DEFAULT_BRANCH',
          ...options.branch.map(name => `refs/heads/${name}`),
        ],
        exclude: [],
      },
    },
    rules,
  }
}

function upsertRuleset() {
  const existing = gh(
    'GET',
    'rulesets?includes_parents=false&targets=branch'
  ).find(ruleset => ruleset.name === RULESET_NAME)

  if (existing) {
    gh('PUT', `rulesets/${existing.id}`, buildRuleset())
  } else {
    gh('POST', 'rulesets', buildRuleset())
  }
}

console.log(`\nConfigurando ${repo}${dryRun ? ' (dry-run)' : ''}\n`)

step('Repositório encontrado', () => gh('GET', ''), { required: true })

if (failures.length === 0) {
  step(
    'Merge só por merge commit; branch apagada após o merge',
    () =>
      gh('PATCH', '', {
        allow_merge_commit: true,
        allow_squash_merge: false,
        allow_rebase_merge: false,
        delete_branch_on_merge: true,
      }),
    { required: true }
  )

  step(
    `Proteção da branch padrão${options.branch.length ? ` e de ${options.branch.join(', ')}` : ''}`,
    upsertRuleset,
    { required: true }
  )

  step('Dependabot: alertas de vulnerabilidade', () =>
    gh('PUT', 'vulnerability-alerts')
  )
  step('Dependabot: PRs de correção de segurança', () =>
    gh('PUT', 'automated-security-fixes')
  )

  // Os dois abaixo só existem de graça em repositório público; em privado o GitHub recusa.
  step('Secret scanning com bloqueio no push', () =>
    gh('PATCH', '', {
      security_and_analysis: {
        secret_scanning: { status: 'enabled' },
        secret_scanning_push_protection: { status: 'enabled' },
      },
    })
  )
  step('CodeQL (configuração padrão)', () =>
    gh('PATCH', 'code-scanning/default-setup', { state: 'configured' })
  )
}

if (options.check.length === 0) {
  console.log(
    '\n  Aviso: nenhum --check informado; o merge não exige CI verde neste repositório.'
  )
}

if (failures.length > 0) {
  console.error(`\nFalhou: ${failures.join('; ')}\n`)
  process.exit(1)
}

console.log(
  '\nPronto. Itens marcados com "–" não se aplicam a este repositório.\n'
)
