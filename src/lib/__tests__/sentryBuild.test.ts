import { describe, expect, it } from 'vitest'

import { resolveSentryBuild, type SentryBuildEnv } from '../sentryBuild'

const productionBuild: SentryBuildEnv = {
  NODE_ENV: 'production',
  SENTRY_AUTH_TOKEN: 'token',
  SENTRY_ORG: 'org',
  SENTRY_PROJECT: 'project',
}

describe('resolveSentryBuild', () => {
  it('não usa o Sentry fora de build de produção', () => {
    expect(
      resolveSentryBuild({ ...productionBuild, NODE_ENV: 'development' })
    ).toBeNull()
    expect(
      resolveSentryBuild({ ...productionBuild, NODE_ENV: undefined })
    ).toBeNull()
  })

  it('não usa o Sentry em deploy de preview da Vercel', () => {
    expect(
      resolveSentryBuild({
        ...productionBuild,
        VERCEL_ENV: 'preview',
        VERCEL_GIT_COMMIT_SHA: 'abc123',
      })
    ).toBeNull()
  })

  it('reporta em deploy de produção da Vercel com o commit como release', () => {
    expect(
      resolveSentryBuild({
        ...productionBuild,
        VERCEL_ENV: 'production',
        VERCEL_GIT_COMMIT_SHA: 'abc123',
      })
    ).toEqual({
      org: 'org',
      project: 'project',
      authToken: 'token',
      release: 'abc123',
    })
  })

  it.each(['SENTRY_AUTH_TOKEN', 'SENTRY_ORG', 'SENTRY_PROJECT'] as const)(
    'não usa o Sentry quando falta %s',
    key => {
      expect(resolveSentryBuild({ ...productionBuild, [key]: '' })).toBeNull()
    }
  )

  it('prefere VITE_APP_VERSION explícita ao commit', () => {
    expect(
      resolveSentryBuild({
        ...productionBuild,
        VITE_APP_VERSION: '1.4.0',
        VERCEL_GIT_COMMIT_SHA: 'abc123',
      })?.release
    ).toBe('1.4.0')
  })

  it('cai para o commit quando VITE_APP_VERSION está em branco', () => {
    expect(
      resolveSentryBuild({
        ...productionBuild,
        VITE_APP_VERSION: '  ',
        VERCEL_GIT_COMMIT_SHA: 'abc123',
      })?.release
    ).toBe('abc123')
  })

  it('deixa a release indefinida para o plugin detectar pelo git', () => {
    const config = resolveSentryBuild(productionBuild)

    expect(config).not.toBeNull()
    expect(config?.release).toBeUndefined()
  })
})
