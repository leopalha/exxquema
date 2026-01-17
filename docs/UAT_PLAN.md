# 🧪 User Acceptance Testing (UAT) Plan - FLAME Lounge Bar

> **Objetivo:** Validar a aplicação com usuários reais antes do lançamento oficial
> **Duração:** 1-2 semanas
> **Meta:** Identificar bugs, problemas de UX e oportunidades de melhoria

---

## 📊 RESUMO EXECUTIVO

**O que é UAT?**
User Acceptance Testing é o processo de validação da aplicação com usuários reais para garantir que atende às necessidades e expectativas do público-alvo.

**Por que fazer?**
- ✅ Identificar bugs que só aparecem em uso real
- ✅ Validar fluxos de usuário
- ✅ Descobrir problemas de UX
- ✅ Coletar feedback valioso
- ✅ Aumentar confiança antes do launch

---

## 👥 PERFIL DOS BETA TESTERS

### Total: 10 pessoas

#### Grupo 1: Staff (3 pessoas)
- **Garçom/Garçonete** - Vai usar dashboard de pedidos
- **Gerente** - Vai usar relatórios e admin
- **Cozinha** - Vai receber notificações de pedidos

**Objetivo:** Validar ferramentas internas e dashboard staff

#### Grupo 2: Clientes Frequentes (4 pessoas)
- Clientes que já visitaram o FLAME 3+ vezes
- Conhecem o cardápio
- Têm expectativas claras

**Objetivo:** Validar experiência de pedido e cashback

#### Grupo 3: Novos Usuários (3 pessoas)
- Nunca visitaram ou visitaram 1 vez
- Não conhecem bem o app

**Objetivo:** Validar onboarding e primeira experiência

---

## 📝 PROCESSO DE RECRUTAMENTO

### Como Recrutar

**Staff:**
1. Reunião interna explicando o UAT
2. Convite pessoal
3. Treinamento básico de 15 min

**Clientes Frequentes:**
1. Identificar nas reservas/pedidos recentes
2. Mensagem WhatsApp/Email convidando
3. Oferecer incentivo (R$ 50 em cashback)

**Novos Usuários:**
1. Convite em redes sociais
2. Amigos/familiares da equipe
3. Incentivo (R$ 30 em cashback)

### Critérios de Seleção

✅ **Incluir:**
- Familiaridade com apps (básico)
- Disponibilidade 1-2h
- Disposição para dar feedback honesto
- Diferentes faixas etárias (18-50 anos)
- Uso de diferentes dispositivos (iOS, Android, Desktop)

❌ **Excluir:**
- Pessoas da equipe de desenvolvimento
- Familiares diretos dos desenvolvedores

---

## 🎯 CENÁRIOS DE TESTE

### Cenário 1: Pedido Completo (Cliente)
**Tempo estimado:** 20 minutos

**Passos:**
1. Abrir app pela primeira vez
2. Criar conta (email ou Google)
3. Navegar pelo cardápio
4. Adicionar 3+ produtos ao carrinho
5. Aplicar cashback (se disponível)
6. Finalizar pedido
7. Acompanhar status do pedido

**O que observar:**
- Conseguiu criar conta?
- Achou produtos facilmente?
- Entendeu cashback?
- Processo de pagamento foi claro?
- Notificações funcionaram?

### Cenário 2: Reserva (Cliente)
**Tempo estimado:** 10 minutos

**Passos:**
1. Fazer login
2. Ir para página de reservas
3. Escolher data, hora, número de pessoas
4. Confirmar reserva
5. Verificar confirmação

**O que observar:**
- Calendário é intuitivo?
- Horários disponíveis estão claros?
- Confirmação chegou?

### Cenário 3: Dashboard Staff (Garçom)
**Tempo estimado:** 15 minutos

**Passos:**
1. Login com conta staff
2. Ver pedidos ativos
3. Atualizar status de um pedido
4. Marcar pedido como entregue
5. Ver histórico

**O que observar:**
- Dashboard é fácil de usar?
- Atualizações são rápidas?
- Informações estão claras?

### Cenário 4: Relatórios (Gerente)
**Tempo estimado:** 10 minutos

**Passos:**
1. Login como admin
2. Ver relatórios de vendas
3. Filtrar por período
4. Ver produtos mais vendidos
5. Exportar relatório (se disponível)

**O que observar:**
- Gráficos são claros?
- Dados fazem sentido?
- Filtros funcionam?

### Cenário 5: Uso Mobile em Movimento
**Tempo estimado:** 15 minutos

**Passos:**
1. Fazer pedido no celular enquanto caminha
2. Testar em diferentes conexões (WiFi, 4G)
3. Rotacionar tela (portrait/landscape)
4. Usar com uma mão

**O que observar:**
- App funciona offline?
- Performance em 4G?
- Layout se adapta à rotação?
- Botões são acessíveis?

---

## 📋 FORMULÁRIO DE FEEDBACK

### Google Forms - Perguntas

**Seção 1: Informações Básicas**
- Nome (opcional)
- Idade
- Dispositivo usado (iOS, Android, Desktop)
- Navegador (Chrome, Safari, Firefox, etc.)
- Já visitou o FLAME antes? (Sim/Não)

**Seção 2: Primeira Impressão (1-5 estrelas)**
- O app parece profissional?
- O design é atraente?
- A navegação é intuitiva?
- As cores e fontes são agradáveis?

**Seção 3: Funcionalidades (1-5 estrelas + comentários)**
- Criar conta foi fácil?
- Encontrar produtos no cardápio?
- Adicionar produtos ao carrinho?
- Entender o cashback?
- Fazer um pedido?
- Acompanhar status do pedido?
- Fazer uma reserva?

**Seção 4: Performance**
- O app carrega rápido? (Sim/Não)
- Encontrou alguma tela que demorou muito? (Texto livre)
- O app travou ou deu erro? (Sim/Não + descrição)

**Seção 5: Bugs e Problemas (Texto livre)**
- Descreva qualquer erro ou bug encontrado
- Algo não funcionou como esperado?
- Screenshot (upload opcional)

**Seção 6: Sugestões (Texto livre)**
- O que você mudaria?
- O que está faltando?
- O que você mais gostou?
- O que você menos gostou?

**Seção 7: Net Promoter Score**
- De 0 a 10, qual a chance de você recomendar o app para um amigo?

---

## 📊 MÉTRICAS DE SUCESSO

### Quantitativas

**Meta Mínima:**
- ✅ Taxa de conclusão de pedido: > 80%
- ✅ Taxa de erro: < 5%
- ✅ NPS (Net Promoter Score): > 7
- ✅ Satisfação média: > 4/5 estrelas

**Ideal:**
- 🎯 Taxa de conclusão de pedido: > 90%
- 🎯 Taxa de erro: < 2%
- 🎯 NPS: > 8
- 🎯 Satisfação média: > 4.5/5 estrelas

### Qualitativas

- ✅ Nenhum bug crítico (P0)
- ✅ Máximo 3 bugs altos (P1)
- ✅ Feedback majoritariamente positivo
- ✅ Usuários conseguem completar tarefas sem ajuda

---

## 🗓️ CRONOGRAMA

### Semana 1: Preparação
- **Dia 1-2:** Recrutar beta testers
- **Dia 3:** Criar formulário Google Forms
- **Dia 4:** Treinar staff testers
- **Dia 5:** Enviar links e instruções

### Semana 2: Testes
- **Dia 1-3:** Testes individuais
  - Cada tester recebe link
  - Executa cenários
  - Preenche formulário
- **Dia 4:** Follow-up com testers
- **Dia 5:** Análise de feedback

### Semana 3: Implementação
- **Dia 1-2:** Priorizar bugs e melhorias
- **Dia 3-5:** Implementar correções P0/P1
- **Dia 5:** Re-teste com 2-3 testers

---

## 📧 COMUNICAÇÃO COM TESTERS

### Email de Convite

**Assunto:** Convite para Beta Testing - FLAME Lounge Bar App 🔥

**Corpo:**
```
Olá [Nome],

Você foi selecionado(a) para participar do beta testing do novo app do FLAME Lounge Bar! 🎉

O que você vai fazer?
- Testar o app por 1-2 horas
- Fazer pedidos, reservas e explorar funcionalidades
- Responder um formulário com seu feedback

O que você ganha?
- R$ [valor] em cashback no app
- Ser um dos primeiros a usar
- Influenciar o produto final

Como funcionar?
1. Acesse: [LINK]
2. Siga as instruções
3. Preencha o formulário: [LINK DO FORMS]

Prazo: Até [DATA]

Dúvidas? Responda este email ou WhatsApp: [NUMERO]

Obrigado!
Equipe FLAME 🔥
```

### Instruções para Testers

**Documento (PDF ou Google Doc):**

1. **Acesse o app:** [LINK]
2. **Crie sua conta** (email ou Google)
3. **Complete estes cenários:**
   - [ ] Navegar pelo cardápio
   - [ ] Adicionar 3 produtos ao carrinho
   - [ ] Fazer um pedido completo
   - [ ] Fazer uma reserva
   - [ ] Verificar histórico de pedidos
4. **Explore livremente** por 10-15 minutos
5. **Anote problemas** enquanto usa
6. **Preencha o formulário:** [LINK]

**Dicas:**
- Seja honesto no feedback (queremos melhorar!)
- Anote qualquer confusão ou dificuldade
- Tire screenshots de bugs (se possível)
- Teste em diferentes momentos do dia
- Teste com WiFi e dados móveis

---

## 🐛 GESTÃO DE BUGS

### Ferramenta
Google Sheets ou GitHub Issues

### Template de Bug Report

| Campo | Descrição |
|-------|-----------|
| **ID** | #001, #002, etc |
| **Título** | Descrição curta |
| **Severidade** | P0 (Crítico), P1 (Alto), P2 (Médio), P3 (Baixo) |
| **Descrição** | Detalhes completos |
| **Passos para Reproduzir** | 1. ... 2. ... 3. ... |
| **Resultado Esperado** | O que deveria acontecer |
| **Resultado Atual** | O que está acontecendo |
| **Device** | iPhone 12, Android, Desktop |
| **Browser/OS** | Chrome, Safari, iOS 15, etc |
| **Screenshot** | Link ou anexo |
| **Reportado por** | Nome do tester |
| **Status** | Open, In Progress, Fixed, Wontfix |
| **Assignee** | Quem vai corrigir |

### Priorização

**P0 - Crítico (Fix imediatamente):**
- App crashando
- Não consegue fazer pedido
- Pagamento não funciona
- Perda de dados

**P1 - Alto (Fix antes do launch):**
- Funcionalidade importante quebrada
- UX muito confusa
- Performance muito ruim

**P2 - Médio (Fix se possível):**
- Bugs menores
- Melhorias de UX
- Edge cases

**P3 - Baixo (Backlog):**
- Nice to have
- Sugestões de features
- Melhorias estéticas menores

---

## ✅ CRITÉRIOS PARA APROVAR LAUNCH

### Go/No-Go Checklist

**✅ GO se:**
- [ ] Zero bugs P0
- [ ] < 3 bugs P1
- [ ] Taxa de conclusão de pedido > 80%
- [ ] NPS > 7
- [ ] Satisfação média > 4/5
- [ ] Feedback majoritariamente positivo

**❌ NO-GO se:**
- [ ] Qualquer bug P0 não corrigido
- [ ] > 5 bugs P1
- [ ] Taxa de conclusão < 70%
- [ ] NPS < 6
- [ ] Múltiplos feedbacks negativos sobre mesma feature

---

## 📈 APÓS O UAT

### Análise de Dados
1. Compilar todos os feedbacks
2. Categorizar bugs por severidade
3. Identificar padrões nos problemas
4. Criar relatório executivo

### Apresentação de Resultados
- Slide deck com principais achados
- Lista priorizada de bugs
- Recomendações de melhorias
- Timeline de correções

### Implementação
1. Sprint de correção de bugs (P0/P1)
2. Re-teste com subset de testers
3. Aprovação final para launch

---

## 💰 ORÇAMENTO

**Incentivos para Testers:**
- 3 Staff: R$ 0 (parte do trabalho)
- 4 Clientes Frequentes: R$ 50 cada = R$ 200
- 3 Novos Usuários: R$ 30 cada = R$ 90

**Total:** R$ 290 em cashback

**ROI:** Identificar e corrigir bugs antes do launch evita:
- Perda de clientes
- Reputação negativa
- Custos de correção pós-launch (10x mais caro)

---

## 📞 CONTATOS

**Product Owner:** [Nome]
**Email:** [email]
**WhatsApp:** [numero]

**Suporte Técnico durante UAT:**
- Disponível: [Horários]
- Resposta em: < 2 horas

---

## 📚 RECURSOS

**Links Úteis:**
- App: [URL]
- Formulário de Feedback: [URL]
- Instruções: [URL]
- Report de Bug: [URL]

**Ferramentas:**
- Google Forms (feedback)
- Google Sheets (análise)
- GitHub Issues (bugs)
- Slack/WhatsApp (comunicação)

---

**Última atualização:** 2026-01-17
**Status:** 📋 Pronto para Execução
