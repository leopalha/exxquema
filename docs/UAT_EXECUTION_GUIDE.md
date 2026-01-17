# 📋 Guia de Execução UAT - FLAME Lounge Bar

**Versão:** 1.0
**Data:** Janeiro 2026
**Responsável:** Equipe de Desenvolvimento FLAME

---

## 📌 Índice

1. [Visão Geral](#visão-geral)
2. [Preparação Pré-UAT](#preparação-pré-uat)
3. [Recrutamento de Testadores](#recrutamento-de-testadores)
4. [Configuração do Ambiente](#configuração-do-ambiente)
5. [Execução dos Testes](#execução-dos-testes)
6. [Coleta de Feedback](#coleta-de-feedback)
7. [Análise de Resultados](#análise-de-resultados)
8. [Critérios Go/No-Go](#critérios-gono-go)
9. [Checklist de Execução](#checklist-de-execução)

---

## 1. Visão Geral

### Objetivo
Validar a experiência do usuário final do sistema FLAME Lounge Bar através de testes reais com usuários beta, identificando problemas de usabilidade, bugs e oportunidades de melhoria antes do lançamento oficial.

### Escopo
- **Aplicação Web:** Frontend Next.js
- **Backend API:** Node.js + Express
- **Plataformas:** Desktop, Tablet, Mobile
- **Browsers:** Chrome, Firefox, Safari

### Duração
- **Preparação:** 3 dias
- **Execução:** 7 dias
- **Análise:** 3 dias
- **Total:** 13 dias

---

## 2. Preparação Pré-UAT

### Checklist Técnico

- [ ] **Ambiente de staging configurado**
  - URL de staging: `https://staging.flameloungebar.com`
  - Backend funcionando corretamente
  - Database com dados realistas (produtos, categorias, mesas)
  - SSL/HTTPS configurado

- [ ] **Sistema de monitoramento ativo**
  - Sentry configurado para capturar erros
  - Google Analytics rastreando eventos
  - Logs do Winston ativos

- [ ] **Dados de teste preparados**
  - 10 usuários beta criados
  - 5 mesas disponíveis (Mesa 1-5)
  - 20+ produtos ativos no cardápio
  - Categorias preenchidas

- [ ] **Comunicação preparada**
  - Email de boas-vindas redigido
  - Instruções de acesso prontas
  - Grupo do WhatsApp criado
  - Templates de formulários prontos

### Ferramentas Necessárias

1. **Google Forms** - Coleta de feedback
2. **WhatsApp/Telegram** - Comunicação com testadores
3. **Sentry** - Monitoramento de erros
4. **Google Analytics** - Análise de comportamento
5. **Notion/Trello** - Gestão de bugs

---

## 3. Recrutamento de Testadores

### Perfil dos Testadores

Recrutar **10 testadores beta** com os seguintes perfis:

#### Perfil 1: Cliente Frequente (3 pessoas)
- Frequenta bares/restaurantes regularmente (2+ vezes/mês)
- Familiarizado com apps de delivery
- Idade: 25-40 anos
- Tech-savvy

#### Perfil 2: Usuário Casual (3 pessoas)
- Frequenta bares ocasionalmente (1x/mês)
- Usa apps básicos (WhatsApp, Instagram)
- Idade: 21-45 anos
- Conhecimento tecnológico médio

#### Perfil 3: Primeira Vez (2 pessoas)
- Pouca experiência com apps de pedido
- Idade: 45-60 anos
- Precisa de instruções claras

#### Perfil 4: Staff/Colaborador (2 pessoas)
- Funcionários do FLAME ou setor de hospitalidade
- Conhece o fluxo de pedidos
- Testará também interface de staff

### Email de Convite

```
Assunto: Convite Especial - Seja Beta Tester do FLAME Lounge Bar 🔥

Olá [Nome],

Você foi selecionado(a) para fazer parte do nosso grupo exclusivo de BETA TESTERS!

🎯 O que você vai fazer?
- Testar nossa nova plataforma de pedidos online
- Dar feedback sobre sua experiência
- Ajudar a moldar o futuro do FLAME

🎁 O que você ganha?
- R$ 50 de crédito para usar no app
- Reconhecimento no lançamento oficial
- Acesso antecipado a novos recursos

📅 Período de Testes: [Data Início] a [Data Fim]
⏱️ Tempo estimado: 2-3 horas ao longo da semana

Quer participar? Responda este email até [Data Limite]!

Abraços,
Equipe FLAME 🔥
```

---

## 4. Configuração do Ambiente

### Setup Inicial

#### Passo 1: Criar Usuários Beta

```bash
# Backend - Script para criar usuários beta
node scripts/create-beta-users.js
```

**Credenciais dos Testadores:**
```
Testador 1: beta1@flame.test / Senha123!
Testador 2: beta2@flame.test / Senha123!
...
Testador 10: beta10@flame.test / Senha123!
```

#### Passo 2: Configurar Ambiente de Staging

**Frontend (.env.staging):**
```env
NEXT_PUBLIC_API_URL=https://staging-api.flameloungebar.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
```

**Backend (.env.staging):**
```env
NODE_ENV=staging
DATABASE_URL=postgresql://user:pass@host:5432/flame_staging
REDIS_URL=redis://staging-redis:6379
SENTRY_DSN=https://xxx@sentry.io/xxx
```

#### Passo 3: Deploy do Staging

```bash
# Frontend
cd frontend
npm run build
vercel --prod --alias staging.flameloungebar.com

# Backend
cd backend
git push staging main
```

#### Passo 4: Validar Ambiente

- [ ] Acessar `https://staging.flameloungebar.com`
- [ ] Fazer login com credencial de teste
- [ ] Verificar se produtos carregam
- [ ] Adicionar item ao carrinho
- [ ] Verificar se checkout abre
- [ ] Verificar logs no Sentry

---

## 5. Execução dos Testes

### Dia 0 - Kickoff (Segunda-feira)

**09:00 - Email de Boas-Vindas**
- Enviar credenciais de acesso
- Link para instruções
- Convidar para grupo do WhatsApp

**Template do Email:**
```
Assunto: Bem-vindo ao Beta Test FLAME! 🔥

Olá [Nome],

Bem-vindo ao time de Beta Testers do FLAME!

🔐 Suas Credenciais:
Email: [email]
Senha: [senha]
Link: https://staging.flameloungebar.com

📝 Como Começar:
1. Acesse o link acima
2. Faça login com suas credenciais
3. Explore o app livremente
4. Anote qualquer problema que encontrar

📱 Grupo do WhatsApp:
[Link do Grupo]

📋 Formulário de Feedback:
[Link Google Forms]

Qualquer dúvida, pode perguntar no grupo!

Bons testes! 🚀
Equipe FLAME
```

### Dias 1-7 - Testes Livres

#### Cenários de Teste Sugeridos

**Cenário 1: Navegação Inicial (15 min)**
- Objetivo: Familiarização com a interface
- Tarefas:
  1. Explorar página inicial
  2. Navegar pelo cardápio
  3. Filtrar por categoria
  4. Buscar um produto específico
  5. Ver detalhes de um produto

**Cenário 2: Pedido Simples (20 min)**
- Objetivo: Fazer um pedido básico
- Tarefas:
  1. Escanear QR Code da mesa (ou selecionar mesa manualmente)
  2. Adicionar 3 produtos ao carrinho
  3. Ajustar quantidade de um item
  4. Remover um item
  5. Finalizar pedido
  6. Confirmar recebimento

**Cenário 3: Pedido com Customização (25 min)**
- Objetivo: Testar opções avançadas
- Tarefas:
  1. Adicionar produto com observação especial
  2. Adicionar narguilé com escolha de sabores
  3. Aplicar cashback (se disponível)
  4. Adicionar gorjeta opcional
  5. Desativar taxa de serviço
  6. Finalizar pedido

**Cenário 4: Reserva (10 min)**
- Objetivo: Fazer uma reserva
- Tarefas:
  1. Acessar página de reservas
  2. Selecionar data e horário
  3. Preencher dados
  4. Confirmar reserva
  5. Ver confirmação

**Cenário 5: Perfil e Cashback (10 min)**
- Objetivo: Gerenciar perfil
- Tarefas:
  1. Editar dados do perfil
  2. Ver saldo de cashback
  3. Ver histórico de pedidos
  4. Ver histórico de reservas

#### Atividades Diárias

**Manhã (09:00-12:00)**
- Verificar mensagens no grupo do WhatsApp
- Responder dúvidas dos testadores
- Monitorar Sentry para erros críticos

**Tarde (14:00-18:00)**
- Analisar eventos no Google Analytics
- Revisar feedbacks no Google Forms
- Priorizar bugs encontrados

**Noite (20:00-22:00)**
- Enviar mensagem de check-in no grupo
- Incentivar testadores a continuar
- Destacar novas funcionalidades a testar

---

## 6. Coleta de Feedback

### Google Forms - Estrutura do Formulário

#### Parte 1: Informações do Testador
1. Nome/Identificação
2. Perfil (Cliente Frequente / Casual / Primeira Vez / Staff)
3. Data do teste

#### Parte 2: Avaliação por Funcionalidade

**Para cada funcionalidade:**
- Escala 1-5: Facilidade de uso
- Escala 1-5: Design/Visual
- Escala 1-5: Performance/Velocidade
- Campo aberto: Comentários

**Funcionalidades:**
1. Navegação Geral
2. Cardápio e Filtros
3. Adicionar ao Carrinho
4. Checkout
5. Reservas
6. Perfil
7. Cashback

#### Parte 3: Problemas Encontrados
- Severidade (Crítico / Alto / Médio / Baixo)
- Descrição do problema
- Passos para reproduzir
- Screenshot (opcional)

#### Parte 4: Sugestões
- O que você mais gostou?
- O que você menos gostou?
- O que falta?
- Sugestões de melhoria

#### Parte 5: NPS (Net Promoter Score)
- "De 0 a 10, o quanto você recomendaria o FLAME para um amigo?"

### Link do Formulário
Criar em: https://forms.google.com

---

## 7. Análise de Resultados

### Métricas Quantitativas

#### Analytics (Google Analytics 4)

**Métricas de Engajamento:**
- Total de sessões
- Tempo médio na plataforma
- Taxa de rejeição
- Páginas por sessão

**Funil de Conversão:**
- Visualizações do cardápio → Add to cart (%)
- Add to cart → Begin checkout (%)
- Begin checkout → Purchase (%)

**Eventos Rastreados:**
- `view_item` - Produtos visualizados
- `add_to_cart` - Itens adicionados
- `begin_checkout` - Início do checkout
- `purchase` - Pedidos finalizados
- `generate_lead` - Reservas criadas

#### Sentry (Erros)

**Tipos de Erro:**
- JavaScript errors
- Network errors
- API errors
- Performance issues

**Priorização:**
- Crítico: Impede uso da funcionalidade
- Alto: Causa frustração significativa
- Médio: Problema menor mas perceptível
- Baixo: Cosm ético ou edge case

### Métricas Qualitativas

#### Categorizar Feedback
1. **Usabilidade**
   - Interface confusa
   - Fluxos não intuitivos
   - Falta de instruções

2. **Performance**
   - Lentidão
   - Travamentos
   - Carregamento demorado

3. **Bugs**
   - Funcionalidade não funciona
   - Comportamento inesperado
   - Dados incorretos

4. **Sugestões**
   - Novas funcionalidades
   - Melhorias de UX
   - Design

#### NPS (Net Promoter Score)

**Cálculo:**
```
NPS = % Promotores (9-10) - % Detratores (0-6)
```

**Interpretação:**
- > 70: Excelente
- 50-70: Muito bom
- 30-50: Bom
- 0-30: Precisa melhorias
- < 0: Crítico

---

## 8. Critérios Go/No-Go

### Critérios de Aprovação (Go)

#### Bugs Críticos
- [ ] **Zero bugs críticos** (impedem uso da funcionalidade principal)

#### Taxa de Sucesso
- [ ] **> 90%** dos testadores conseguiram fazer um pedido completo
- [ ] **> 80%** dos testadores conseguiram fazer uma reserva

#### Performance
- [ ] **< 3 segundos** tempo médio de carregamento da página
- [ ] **< 5 segundos** tempo do checkout até confirmação

#### Satisfação
- [ ] **NPS > 30** (mínimo aceitável)
- [ ] **> 70%** dos testadores avaliam usabilidade como 4 ou 5 (de 5)

#### Erros
- [ ] **< 10 erros JavaScript** por sessão (média)
- [ ] **0 erros 500** (server errors) em APIs críticas

### Critérios de Rejeição (No-Go)

❌ **Bloquear lançamento se:**
- 1+ bug crítico não resolvido
- < 70% taxa de sucesso em pedidos
- NPS < 0
- > 20 erros JavaScript por sessão
- Qualquer erro 500 em APIs críticas

### Plano de Ação No-Go

Se critérios não forem atingidos:

1. **Priorizar correções** (2-3 dias)
2. **Re-testar com subgrupo** (2 dias)
3. **Validar melhorias** (1 dia)
4. **Decisão final** (reunião de equipe)

---

## 9. Checklist de Execução

### Antes do Início

- [ ] Ambiente de staging configurado e testado
- [ ] 10 testadores recrutados e confirmados
- [ ] Credenciais de acesso criadas
- [ ] Google Forms criado
- [ ] Grupo WhatsApp/Telegram criado
- [ ] Sentry e GA4 configurados
- [ ] Email de boas-vindas pronto
- [ ] Instruções de teste documentadas

### Durante os Testes

#### Diariamente
- [ ] Verificar mensagens no grupo (2x/dia)
- [ ] Monitorar Sentry para erros críticos
- [ ] Revisar Analytics
- [ ] Responder feedbacks no Google Forms
- [ ] Atualizar planilha de bugs

#### Semanalmente
- [ ] Reunião de status com equipe
- [ ] Priorizar bugs críticos
- [ ] Comunicar progresso aos testadores

### Após os Testes

- [ ] Agradecer todos os testadores
- [ ] Compilar relatório final
- [ ] Apresentar resultados à equipe
- [ ] Decisão Go/No-Go
- [ ] Liberar créditos prometidos
- [ ] Comunicar próximos passos

---

## 📊 Relatório Final - Template

```markdown
# Relatório UAT - FLAME Lounge Bar

**Período:** [Data Início] a [Data Fim]
**Testadores:** 10 participantes

## Resumo Executivo
[Resumo de 2-3 parágrafos]

## Métricas Quantitativas
- **Sessões:** X
- **Taxa de Conversão:** X%
- **Tempo Médio:** X min
- **Erros Críticos:** X
- **NPS:** X

## Principais Achados
1. [Achado 1]
2. [Achado 2]
3. [Achado 3]

## Bugs Encontrados
| ID | Severidade | Descrição | Status |
|----|-----------|-----------|--------|
| B1 | Crítico   | [Desc]    | Resolvido |
| B2 | Alto      | [Desc]    | Em progresso |

## Recomendações
1. [Recomendação 1]
2. [Recomendação 2]

## Decisão
☑️ **GO** - Sistema aprovado para lançamento
❌ **NO-GO** - Requer correções antes do lançamento

**Justificativa:**
[Explicação da decisão]
```

---

## 📞 Contatos

**Coordenador UAT:** [Nome]
**Email:** [email]
**WhatsApp:** [número]

**Suporte Técnico:** [Nome]
**Email:** [email]
**WhatsApp:** [número]

---

**Última atualização:** Janeiro 2026
**Versão:** 1.0
