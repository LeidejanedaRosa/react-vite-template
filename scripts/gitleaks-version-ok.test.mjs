import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const SCRIPT = path.resolve('scripts/gitleaks-version-ok.sh')

const accepts = version => spawnSync('/bin/sh', [SCRIPT, version]).status === 0

describe('gitleaks-version-ok.sh', () => {
  it.each(['8.20.0', '8.30.1', '9.0.0', 'v8.30.1'])(
    'aceita o release %s',
    version => {
      expect(accepts(version)).toBe(true)
    }
  )

  it.each(['8.19.3', '8.19.0'])(
    'recusa a %s, em que o --staged varre só o histórico',
    version => {
      expect(accepts(version)).toBe(false)
    }
  )

  it('compara por versão, não por texto: 8.9.0 é mais antiga que 8.20.0', () => {
    expect(accepts('8.9.0')).toBe(false)
  })

  it.each(['8.20.0garbage', '8.21.0-rc1', '8.20.0\nextra'])(
    'recusa versão com sobra depois do número (%j)',
    version => {
      expect(accepts(version)).toBe(false)
    }
  )

  it.each(['version is set by build process', '', 'dev'])(
    'recusa versão que não é número (%j)',
    version => {
      expect(accepts(version)).toBe(false)
    }
  )
})
