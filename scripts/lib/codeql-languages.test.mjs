import { describe, expect, it } from 'vitest'

import { codeqlLanguages, staleCodeqlLanguages } from './codeql-languages.mjs'

describe('codeqlLanguages', () => {
  it('traduz as linguagens do GitHub para os nomes do CodeQL, sem repetir', () => {
    expect(
      codeqlLanguages({ TypeScript: 9000, JavaScript: 300, Python: 120 }, false)
    ).toEqual(['javascript-typescript', 'python'])
  })

  it('ignora o que o CodeQL não analisa (CSS, HTML, Shell...)', () => {
    expect(codeqlLanguages({ CSS: 500, HTML: 200, Shell: 40 }, false)).toEqual(
      []
    )
  })

  it('inclui "actions" quando existem workflows, mesmo sem código', () => {
    expect(codeqlLanguages({}, true)).toEqual(['actions'])
  })

  it('repositório só com README e imagens: nada a analisar', () => {
    expect(codeqlLanguages({}, false)).toEqual([])
  })
})

describe('staleCodeqlLanguages', () => {
  it('aponta linguagem configurada que saiu do repositório (ex.: workflow removido)', () => {
    expect(staleCodeqlLanguages(['actions'], [])).toEqual(['actions'])
  })

  it('não aponta nada quando a configuração bate com o repositório', () => {
    expect(
      staleCodeqlLanguages(
        ['actions', 'javascript-typescript'],
        ['actions', 'javascript-typescript', 'python']
      )
    ).toEqual([])
  })
})
