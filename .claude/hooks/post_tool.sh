#!/bin/bash

# Post Tool Hook v7.1
# Executado após cada ferramenta usada pelo Claude
# Pode fazer validações e checks automáticos

set -e

TOOL_NAME="$1"
TOOL_RESULT="$2"

# Validações específicas por ferramenta
case "$TOOL_NAME" in
    "Write"|"Edit")
        # Após escrever/editar, poderia rodar type-check
        # (desabilitado por padrão para não travar o fluxo)
        # npm run type-check --if-present 2>/dev/null || true
        ;;

    "Bash")
        # Após comandos bash, verificar se foi git commit
        if echo "$TOOL_RESULT" | grep -q "git commit"; then
            echo "✅ Commit realizado com sucesso"
        fi
        ;;

    *)
        # Outros tools, não fazer nada
        ;;
esac

exit 0
