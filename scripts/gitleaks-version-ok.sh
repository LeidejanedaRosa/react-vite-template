#!/usr/bin/env sh
# Recebe a saída de `gitleaks version` e sai com 0 só para um release 8.20 ou mais novo. Até a
# 8.19, `git --staged` ignora o --staged e varre só o histórico: um segredo novo passaria como
# "tudo limpo". Versão que não é número (build sem versão responde "version is set by build
# process") sai com 1, nunca é aprovada. sort -V compara por versão: 8.20.0 > 8.9.0.
min=8.20.0
version="$(printf '%s' "$1" | sed 's/^v//')"
printf '%s' "$version" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+' || exit 1
[ "$(printf '%s\n%s\n' "$min" "$version" | sort -V | head -n1)" = "$min" ]
