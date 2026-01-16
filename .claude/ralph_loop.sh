#!/bin/bash

# Ralph Loop Script v7.1 - Flame Lounge
# Sistema de execução autônoma MANUS
#
# Uso: bash .claude/ralph_loop.sh "task description" [max_iterations]
# Exemplo: bash .claude/ralph_loop.sh "Complete todas as tasks TODO" 50

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
TASKS_FILE="${TASKS_FILE:-docs/tasks.md}"
STATE_FILE=".claude/ralph_state.json"
MAX_ITERATIONS="${2:-50}"
TASK_DESCRIPTION="${1:-Complete todas as tasks pendentes}"

# Funções auxiliares
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Inicializar estado
init_state() {
    cat > "$STATE_FILE" <<EOF
{
  "start_time": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "task_description": "$TASK_DESCRIPTION",
  "max_iterations": $MAX_ITERATIONS,
  "current_iteration": 0,
  "status": "running",
  "tasks_completed": [],
  "tasks_failed": [],
  "last_update": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
    log_info "Estado inicializado: $STATE_FILE"
}

# Verificar se há tasks pendentes
has_pending_tasks() {
    if [ ! -f "$TASKS_FILE" ]; then
        log_warning "Arquivo $TASKS_FILE não encontrado"
        return 1
    fi

    # Procurar por tasks pendentes (TODO, [ ], IN_PROGRESS, FAILED)
    if grep -qE '(TODO|\\[ \\]|IN_PROGRESS|FAILED)' "$TASKS_FILE"; then
        return 0
    else
        return 1
    fi
}

# Contar tasks pendentes
count_pending_tasks() {
    if [ ! -f "$TASKS_FILE" ]; then
        echo "0"
        return
    fi

    grep -cE '(TODO|\\[ \\]|IN_PROGRESS|FAILED)' "$TASKS_FILE" || echo "0"
}

# Atualizar estado
update_state() {
    local iteration=$1
    local status=$2

    if [ -f "$STATE_FILE" ]; then
        # Usar jq se disponível, senão usar sed
        if command -v jq &> /dev/null; then
            jq ".current_iteration = $iteration | .status = \"$status\" | .last_update = \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"" "$STATE_FILE" > "${STATE_FILE}.tmp"
            mv "${STATE_FILE}.tmp" "$STATE_FILE"
        else
            # Fallback simples com sed
            sed -i "s/\"current_iteration\": [0-9]*/\"current_iteration\": $iteration/" "$STATE_FILE"
            sed -i "s/\"status\": \"[^\"]*\"/\"status\": \"$status\"/" "$STATE_FILE"
        fi
    fi
}

# Finalizar com relatório
finalize() {
    local status=$1
    local reason=$2

    log_info "Finalizando Ralph Loop..."

    update_state "$CURRENT_ITERATION" "$status"

    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║           RALPH LOOP - RELATÓRIO FINAL                    ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    echo "Status: $status"
    echo "Razão: $reason"
    echo "Iterações executadas: $CURRENT_ITERATION / $MAX_ITERATIONS"
    echo "Tasks pendentes: $(count_pending_tasks)"
    echo "Tempo total: $(($(date +%s) - START_TIME))s"
    echo ""

    if [ "$status" = "completed" ]; then
        log_success "✅ Ralph Loop concluído com sucesso!"
    elif [ "$status" = "stopped" ]; then
        log_warning "⚠️  Ralph Loop interrompido"
    else
        log_error "❌ Ralph Loop falhou"
    fi

    echo ""
    echo "Estado salvo em: $STATE_FILE"
    echo "Tasks file: $TASKS_FILE"
    echo ""
}

# Main loop
main() {
    log_info "╔════════════════════════════════════════════════════════════╗"
    log_info "║      MANUS v7.1 - RALPH LOOP AUTÔNOMO                     ║"
    log_info "║      Flame Lounge Bar & Restaurant                        ║"
    log_info "╚════════════════════════════════════════════════════════════╝"
    echo ""

    log_info "Task: $TASK_DESCRIPTION"
    log_info "Max Iterations: $MAX_ITERATIONS"
    log_info "Tasks File: $TASKS_FILE"
    echo ""

    # Inicializar
    START_TIME=$(date +%s)
    init_state

    # Verificar se tasks.md existe
    if [ ! -f "$TASKS_FILE" ]; then
        log_error "Arquivo $TASKS_FILE não encontrado!"
        finalize "failed" "Tasks file não encontrado"
        exit 1
    fi

    CURRENT_ITERATION=0

    # Loop principal
    while [ $CURRENT_ITERATION -lt $MAX_ITERATIONS ]; do
        CURRENT_ITERATION=$((CURRENT_ITERATION + 1))

        echo ""
        log_info "════════════════════════════════════════════════════════════"
        log_info "Iteração $CURRENT_ITERATION de $MAX_ITERATIONS"
        log_info "════════════════════════════════════════════════════════════"
        echo ""

        # Verificar se há tasks pendentes
        if ! has_pending_tasks; then
            log_success "Todas as tasks foram concluídas!"
            finalize "completed" "Todas as tasks concluídas"
            exit 0
        fi

        PENDING_COUNT=$(count_pending_tasks)
        log_info "Tasks pendentes: $PENDING_COUNT"

        # Atualizar estado
        update_state "$CURRENT_ITERATION" "running"

        # IMPORTANTE: Aqui o Claude Code tomaria controle
        # Este script é executado PELO Claude Code via hooks
        # O hook stop.sh injeta o próximo prompt automaticamente

        log_info "Aguardando próxima iteração do Agent Loop..."

        # Pequeno delay para evitar loops muito rápidos
        sleep 2
    done

    # Se chegou aqui, atingiu max iterations
    log_warning "Limite máximo de iterações atingido: $MAX_ITERATIONS"
    finalize "stopped" "Limite máximo de iterações atingido"
    exit 0
}

# Verificar argumentos
if [ -z "$1" ]; then
    log_error "Uso: $0 \"task description\" [max_iterations]"
    log_info "Exemplo: $0 \"Complete todas as tasks TODO\" 50"
    exit 1
fi

# Executar
main "$@"
