#!/usr/bin/env sh
# Recebe a saída de `gitleaks version` e sai com 0 só para um release 8.20 ou mais novo. Até a
# 8.19, `git --staged` ignora o --staged e varre só o histórico: um segredo novo passaria como
# "tudo limpo". Só um x.y.z inteiro é aceito; texto (build sem versão responde "version is set by
# build process"), sufixo, pré-release ou mais de uma linha saem com 1, nunca são aprovados.
# sort -V compara por versão: 8.20.0 > 8.9.0, o que a ordem de texto erra.
min=8.20.0
version="$(printf '%s' "$1" | sed 's/^v//')"
case "$version" in
  *'
'*) exit 1 ;;
esac
printf '%s' "$version" | grep -Eqx '[0-9]+\.[0-9]+\.[0-9]+' || exit 1
[ "$(printf '%s\n%s\n' "$min" "$version" | sort -V | head -n1)" = "$min" ]
