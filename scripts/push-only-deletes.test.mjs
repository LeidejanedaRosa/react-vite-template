import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const SCRIPT = path.resolve('scripts/push-only-deletes.sh')
const ZERO = '0'.repeat(40)
const SHA_A = 'a'.repeat(40)
const SHA_B = 'b'.repeat(40)

const deleteLine = branch => `(delete) ${ZERO} refs/heads/${branch} ${SHA_A}`
const updateLine = branch =>
  `refs/heads/${branch} ${SHA_B} refs/heads/${branch} ${SHA_A}`

function exitCode(lines) {
  const input = lines.length > 0 ? `${lines.join('\n')}\n` : ''
  return spawnSync('/bin/sh', [SCRIPT], { input }).status
}

describe('push-only-deletes.sh', () => {
  it('pula os testes quando o push só apaga uma branch', () => {
    expect(exitCode([deleteLine('feat/x')])).toBe(0)
  })

  it('pula os testes quando todas as refs são remoções', () => {
    expect(
      exitCode([
        deleteLine('feat/x'),
        deleteLine('feat/y'),
        deleteLine('fix/z'),
      ])
    ).toBe(0)
  })

  it('aceita o sha de 64 zeros de repositórios sha256', () => {
    expect(
      exitCode([`(delete) ${'0'.repeat(64)} refs/heads/feat/x ${SHA_A}`])
    ).toBe(0)
  })

  it('roda os testes num push normal', () => {
    expect(exitCode([updateLine('main')])).toBe(1)
  })

  it('roda os testes quando uma remoção vem junto de uma atualização', () => {
    expect(exitCode([deleteLine('feat/x'), updateLine('feat/y')])).toBe(1)
  })

  it('roda os testes numa branch nova, cujo sha de zeros é o remoto', () => {
    expect(
      exitCode([`refs/heads/feat/x ${SHA_B} refs/heads/feat/x ${ZERO}`])
    ).toBe(1)
  })

  it('roda os testes quando a entrada está vazia ou malformada', () => {
    expect(exitCode([])).toBe(1)
    expect(exitCode(['refs/heads/feat/x'])).toBe(1)
  })
})
