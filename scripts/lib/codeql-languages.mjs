// Linguagens do GitHub (Linguist, endpoint /languages) que o CodeQL analisa, no nome que o
// default setup espera.
const LINGUIST_TO_CODEQL = {
  JavaScript: 'javascript-typescript',
  TypeScript: 'javascript-typescript',
  Python: 'python',
  Go: 'go',
  Java: 'java-kotlin',
  Kotlin: 'java-kotlin',
  C: 'c-cpp',
  'C++': 'c-cpp',
  'C#': 'csharp',
  Ruby: 'ruby',
  Swift: 'swift',
}

/**
 * Linguagens que o CodeQL deve analisar neste repositório, sem repetição e em ordem.
 * Workflows do GitHub Actions não aparecem em /languages (são YAML), mas o CodeQL os analisa
 * como "actions" — por isso entram à parte.
 */
export function codeqlLanguages(linguistLanguages, hasWorkflows) {
  const languages = new Set(
    Object.keys(linguistLanguages)
      .map(name => LINGUIST_TO_CODEQL[name])
      .filter(Boolean)
  )

  if (hasWorkflows) languages.add('actions')

  return [...languages].sort()
}

/** Linguagens configuradas no CodeQL que não existem mais no repositório. */
export function staleCodeqlLanguages(configured, current) {
  return configured.filter(language => !current.includes(language))
}
