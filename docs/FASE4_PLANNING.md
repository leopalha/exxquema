# FASE 4 - NARGUILE + RESERVAS (EXPANDIDA)

## Objetivo
Expandir e integrar completamente os sistemas de Narguilé e Reservas que estavam mockados, transformando-os em funcionalidades real-time com backend robusto.

## Status Atual
- **Narguilé**: Mockado em `hookahStore.js`, interface em `/narguile`
- **Reservas**: Mockado em `reservationStore.js`, interface em `/reservas`
- **Backend**: Nenhum modelo ou endpoint ainda (apenas frontend)

## Escopo FASE 4

### 4.1 Narguilé - Backend (Semana 7)

#### 4.1.1 Modelos
- [ ] **HookahFlavor.js** - Sabores disponíveis
  - id, name, description, image, category, price, inStock, createdAt

- [ ] **HookahSession.js** - Sessões ativas
  - id, mesaId (FK), flavorId (FK), quantity, startedAt, endedAt
  - duration, price, status (active, paused, ended)
  - coalChanges (array de timestamps), totalTime

#### 4.1.2 Service
- [ ] **hookahService.js** - 8 métodos
  - createSession(mesaId, flavorId, quantity)
  - getActiveSessions()
  - updateCoalChange(sessionId)
  - pauseSession(sessionId)
  - resumeSession(sessionId)
  - endSession(sessionId)
  - calculatePrice(durationMinutes, quantity)
  - getSessionHistory(days)

#### 4.1.3 Controller & Routes
- [ ] **hookahController.js** - 8 endpoints
  - GET /flavors - lista sabores
  - POST /sessions - criar sessão
  - GET /sessions - sessões ativas
  - GET /sessions/:id - detalhes
  - PUT /sessions/:id/coal - registrar troca de carvão
  - PUT /sessions/:id/pause - pausar
  - PUT /sessions/:id/resume - retomar
  - PUT /sessions/:id/end - finalizar

- [ ] **routes/hookah.js** - rotas protegidas

#### 4.1.4 Socket.IO
- [ ] Eventos para bar staff:
  - `hookah:session_started` - nova sessão
  - `hookah:coal_change_alert` - alerta 15min
  - `hookah:session_ended` - sessão finalizada
  - `hookah:time_updated` - atualização de tempo

### 4.2 Narguilé - Frontend (Semana 7)

#### 4.2.1 Store
- [ ] **hookahStore.js** - Expandir (Zustand)
  - state: flavors, sessions, sessionTimers, selectedFlavor
  - actions: fetchFlavors(), startSession(), fetchSessions(), updateCoalChange(), endSession(), tickTimer()

#### 4.2.2 Componentes
- [ ] **HookahFlavorCard.js** - Card para seleção
  - Nome, descrição, preço, imagem, status estoque

- [ ] **HookahSessionCard.js** - Card em tempo real
  - Mesa, sabor, timer, botões (coal, pause, end)
  - Animação de pulse quando próximo de trocar carvão

- [ ] **HookahSessionModal.js** - Modal inicial
  - Seletor de mesa
  - Grid de flavors
  - Confirmação de quantidade/duração

#### 4.2.3 Página
- [ ] **Expandir /narguile**
  - Seção 1: Selecionador de nova sessão
  - Seção 2: Sessões ativas com timers
  - Seção 3: Histórico do dia

- [ ] **Integrar com /staff/bar**
  - Aba "Narguilés" com sessões ativas
  - Alertas sonoros para troca de carvão
  - Controles para staff

### 4.3 Reservas - Expansão Backend (Semana 8)

#### 4.3.1 Modelos
- [ ] Expandir **Reservation.js** com:
  - Campos adicionais: guestNotes, specialRequests, confirmationCode
  - Métodos: isConfirmed(), isPast(), isUpcoming()
  - Relacionamento com User (cliente)

#### 4.3.2 Service
- [ ] **reservationService.js** - 8 métodos
  - createReservation()
  - getReservations(filters)
  - confirmReservation(id)
  - cancelReservation(id)
  - updateReservation(id, data)
  - getAvailableSlots(date)
  - sendReminder(id) - enviar SMS/email (mock)
  - markNoShow(id)

#### 4.3.3 Controller & Routes
- [ ] **reservationController.js** - 8 endpoints
  - POST /reservations - criar
  - GET /reservations - listar (cliente vê suas)
  - GET /admin/reservations - listar (admin vê todas)
  - PUT /reservations/:id - editar
  - PUT /reservations/:id/confirm - confirmar
  - PUT /reservations/:id/cancel - cancelar
  - GET /availability - slots disponíveis
  - POST /reservations/:id/remind - enviar lembrete

- [ ] **routes/reservations.js** - rotas públicas + admin

#### 4.3.4 Jobs (node-cron)
- [ ] **reminders.job.js** - rodar a cada hora
  - Buscar reservas com 2h antes
  - Enviar SMS/email de lembrete

- [ ] **noshow.job.js** - rodar a cada 30min
  - Buscar reservas 15min passadas sem confirmar
  - Marcar como no-show automaticamente

### 4.4 Reservas - Frontend (Semana 8)

#### 4.4.1 Store (Expandido)
- [ ] **reservationStore.js** - Atualizar (Zustand)
  - state: reservations, slots, selectedDate, selectedTime, selectedPartySize
  - actions: fetchReservations(), fetchSlots(), createReservation(), confirmReservation(), cancelReservation()

#### 4.4.2 Componentes (Novos)
- [ ] **ReservationCalendar.js** - Calendário interativo
  - Mês/ano navegável
  - Highlight de datas com slots disponíveis
  - Seleção de data

- [ ] **ReservationTimeSlots.js** - Seletor de horários
  - Grid de slots (13:00-22:00, a cada 30min)
  - Cores: verde (disponível), amarelo (poucas), vermelho (cheio)

- [ ] **ReservationForm.js** - Formulário completo
  - Dados do cliente (prefilled se logado)
  - Selecionar data/hora/pessoas
  - Notas especiais
  - Botão confirmar

#### 4.4.3 Páginas (Refatoradas)
- [ ] **/reservas** - Refatorar
  - Seção 1: Nova reserva (calendar + form)
  - Seção 2: Minhas reservas (lista com ações)
  - Seção 3: Confirmação com código

- [ ] **/admin/reservas** - Nova página admin
  - Calendário com visão por dia
  - Lista de todas reservas
  - Filtros: data, status, tamanho grupo
  - Ações: confirmar, cancelar, marcar no-show

### 4.5 Integração Real-time (Semana 8)

#### 4.5.1 Socket.IO para Narguilé
- [ ] Listeners no /staff/bar:
  - `hookah:session_started` → fetchSessions()
  - `hookah:coal_change_alert` → playUrgent() + toast
  - `hookah:session_ended` → fetchSessions()

#### 4.5.2 Socket.IO para Reservas
- [ ] Listeners no /admin:
  - `reservation:created` → fetchReservations()
  - `reservation:confirmed` → toast success
  - `reservation:cancelled` → atualizar lista

#### 4.5.3 WebSocket Updates
- [ ] Timers de narguile em tempo real
- [ ] Disponibilidade de slots atualizando dinamicamente
- [ ] Notificações de no-show automáticas

## Arquitetura Proposta

### Backend Structure
```
backend/src/
├── models/
│   ├── HookahFlavor.js
│   ├── HookahSession.js
│   └── (Reservation.js já existe)
├── services/
│   ├── hookahService.js
│   └── reservationService.js
├── controllers/
│   ├── hookahController.js
│   └── reservationController.js
├── routes/
│   ├── hookah.js
│   └── reservations.js
└── jobs/
    ├── reminders.job.js
    └── noshow.job.js
```

### Frontend Structure
```
frontend/src/
├── stores/
│   ├── hookahStore.js (expandir)
│   └── reservationStore.js (expandir)
├── components/
│   ├── HookahFlavorCard.js
│   ├── HookahSessionCard.js
│   ├── HookahSessionModal.js
│   ├── ReservationCalendar.js
│   ├── ReservationTimeSlots.js
│   └── ReservationForm.js
└── pages/
    ├── narguile.js (refatorar)
    ├── reservas.js (refatorar)
    └── admin/reservas.js (novo)
```

## Timeline Estimada

| Fase | Task | Dias |
|------|------|------|
| 4.1 | Backend Narguilé | 2 |
| 4.2 | Frontend Narguilé | 1.5 |
| 4.3 | Backend Reservas | 1.5 |
| 4.4 | Frontend Reservas | 2 |
| 4.5 | Real-time Integration | 1 |

**Total: ~8 dias de desenvolvimento**

## Prioridade das Tasks

### Crítico (Fazer Primeiro)
1. HookahSession + HookahFlavor models
2. hookahService.js e hookahController.js
3. hookahStore.js expandido
4. HookahSessionCard.js integrado com /staff/bar

### Importante (Depois)
5. ReservationService expandido
6. ReservationCalendar + ReservationForm
7. /admin/reservas page
8. Socket.IO real-time

### Nice-to-have
9. Jobs de reminder automáticas (node-cron)
10. SMS/Email de confirmação
11. Analytics de ocupação

## Métricas de Sucesso

✅ Narguilé:
- [ ] Criar sessão funciona
- [ ] Timer conta tempo em tempo real
- [ ] Alerta de 15min toca automaticamente
- [ ] Finalizar calcula preço corretamente
- [ ] Relatório de consumo (houve X sessões, Y hora total, Z faturamento)

✅ Reservas:
- [ ] Criar reserva com slots disponíveis
- [ ] Confirmar reserva funciona
- [ ] Cancelar com motivo registrado
- [ ] Admin vê todas as reservas
- [ ] Calendário mostra visualmente slots cheios/vazios

✅ Integração:
- [ ] Real-time funciona em todos painéis
- [ ] Build compila sem erros
- [ ] Zero warnings
- [ ] Performance OK (< 3s page load)

---

## Próximo Passo
Iniciar com **4.1 Backend Narguilé** - criar modelos e service.
