#!/usr/bin/env sh
# Lê as linhas que o Git manda ao pre-push (<ref local> <sha local> <ref remota> <sha remoto>)
# e sai com 0 só quando todas são remoções: sha local feito só de zeros. Sha remoto de zeros é
# o contrário (branch nova), e entrada vazia também sai com 1, para a suíte rodar na dúvida.
found=1
while read -r _local_ref local_sha _remote_ref _remote_sha; do
  case "$local_sha" in
    '' | *[!0]*) exit 1 ;;
  esac
  found=0
done
exit "$found"
