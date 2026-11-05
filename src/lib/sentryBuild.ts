/** Variáveis do build que decidem se ele reporta para o Sentry. */
export interface SentryBuildEnv {
  [key: string]: string | undefined
  NODE_ENV?: string
  VERCEL_ENV?: string
  SENTRY_AUTH_TOKEN?: string
  SENTRY_ORG?: string
  SENTRY_PROJECT?: string
  VITE_APP_VERSION?: string
  VERCEL_GIT_COMMIT_SHA?: string
}

export interface SentryBuildConfig {
  org: string
  project: string
  authToken: string
  /** `undefined` deixa o plugin do Sentry detectar a release pelo git. */
  release?: string
}

/**
 * Configuração de release do Sentry para este build, ou `null` quando o build não deve criar
 * release nem enviar source maps.
 */
export function resolveSentryBuild(
  env: SentryBuildEnv
): SentryBuildConfig | null {
  if (env.NODE_ENV !== 'production') return null

  // Todo PR — inclusive os do Dependabot — ganha um build de preview na Vercel que nunca chega
  // em produção; criar release para cada um enche o Sentry de releases e e-mails de deploy.
  if (env.VERCEL_ENV === 'preview') return null

  const {
    SENTRY_AUTH_TOKEN: authToken,
    SENTRY_ORG: org,
    SENTRY_PROJECT: project,
  } = env
  if (!authToken || !org || !project) return null

  // A Vercel não expande `$VAR` dentro do valor de outra variável: VITE_APP_VERSION cadastrada
  // como "$VERCEL_GIT_COMMIT_SHA" virava esse texto literal no nome da release.
  const release =
    env.VITE_APP_VERSION?.trim() || env.VERCEL_GIT_COMMIT_SHA || undefined

  return { org, project, authToken, release }
}
