#!/bin/bash

# Stop Hook para Ralph Loop v7.1
# Este hook é chamado após cada resposta do Claude
# Ele decide se deve continuar automaticamente ou parar

set -e

TASKS_FILE="${TASKS_FILE:-docs/tasks.md}"
STATE_FILE=".claude/ralph_state.json"
RALPH_ENABLED="${RALPH_ENABLED:-false}"

# Se Ralph Loop não está habilitado, não fazer nada
if [ "$RALPH_ENABLED" != "true" ]; then
    exit 0
fi

# Verificar se state file existe
if [ ! -f "$STATE_FILE" ]; then
    exit 0
fi

# Função para verificar tasks pendentes
has_pending_tasks() {
    if [ ! -f "$TASKS_FILE" ]; then
        return 1
    fi

    if grep -qE '(TODO|\\[ \\]|IN_PROGRESS|FAILED)' "$TASKS_FILE"; then
        return 0
    else
        return 1
    fi
}

# Ler estado atual
if command -v jq &> /dev/null; then
    STATUS=$(jq -r '.status' "$STATE_FILE")
    CURRENT_ITER=$(jq -r '.current_iteration' "$STATE_FILE")
    MAX_ITER=$(jq -r '.max_iterations' "$STATE_FILE")
else
    # Fallback sem jq
    STATUS=$(grep '"status"' "$STATE_FILE" | cut -d'"' -f4)
    CURRENT_ITER=$(grep '"current_iteration"' "$STATE_FILE" | grep -o '[0-9]*')
    MAX_ITER=$(grep '"max_iterations"' "$STATE_FILE" | grep -o '[0-9]*')
fi

# Verificar condições de parada
if [ "$STATUS" != "running" ]; then
    echo "Ralph Loop não está rodando (status: $STATUS)"
    exit 0
fi

if [ "$CURRENT_ITER" -ge "$MAX_ITER" ]; then
    echo "Ralph Loop atingiu máximo de iterações ($CURRENT_ITER/$MAX_ITER)"
    exit 0
fi

if ! has_pending_tasks; then
    echo "Nenhuma task pendente encontrada. Ralph Loop concluído!"
    exit 0
fi

# CONTINUAR: Injetar próximo prompt
echo "Tasks pendentes encontradas. Continuando Ralph Loop..."
echo ""
echo "MANUS, continue trabalhando na próxima task pendente do docs/tasks.md"
echo "Siga o Agent Loop completo (6 fases) e atualize o arquivo ao concluir."
echo ""

exit 0
