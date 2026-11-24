export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // O título do PR vira a mensagem do merge commit e o GitHub corta títulos de commit em 72.
    'header-max-length': [2, 'always', 72],
  },
}
