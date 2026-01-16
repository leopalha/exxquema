# 📡 API Documentation - FLAME Lounge Bar

> **Versão:** 1.0
> **Base URL:** `http://localhost:7000/api`
> **Produção:** `https://api.flamelounge.com.br/api`

---

## 🔐 Autenticação

Todas as rotas protegidas requerem um token JWT no header:

```http
Authorization: Bearer <token>
```

**Como obter token:** Login via `/auth/login` ou `/auth/google`

---

## 📚 Rotas Principais

### 1. **AUTH** - `/auth`

#### `POST /auth/register`
Registro de novo usuário.

**Request:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "Senha123!",
  "phone": "+5521999999999"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com",
    "role": "customer"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### `POST /auth/login`
Login com email/senha.

**Request:**
```json
{
  "email": "joao@email.com",
  "password": "Senha123!"
}
```

**Response:** `200 OK` (mesmo formato do register)

#### `POST /auth/google`
Login com Google OAuth.

**Request:**
```json
{
  "token": "google_id_token_aqui"
}
```

**Response:** `200 OK` (mesmo formato do register)

#### `POST /auth/verify-phone`
Envia código SMS para verificação.

**Request:**
```json
{
  "phone": "+5521999999999"
}
```

**Response:** `200 OK`
```json
{
  "message": "Código enviado via SMS",
  "expiresIn": 300
}
```

#### `POST /auth/verify-code`
Verifica código SMS.

**Request:**
```json
{
  "phone": "+5521999999999",
  "code": "123456"
}
```

**Response:** `200 OK`
```json
{
  "verified": true
}
```

---

### 2. **PRODUCTS** - `/products`

#### `GET /products`
Lista todos os produtos (paginado).

**Query Params:**
- `page=1` (default)
- `limit=20` (default)
- `category=food|drink|hookah`
- `available=true|false`
- `search=termo`

**Response:** `200 OK`
```json
{
  "products": [
    {
      "id": 1,
      "name": "Hambúrguer FLAME",
      "description": "Blend premium 180g",
      "price": 45.00,
      "category": "food",
      "image": "/uploads/burger.jpg",
      "available": true,
      "stock": 25
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

#### `GET /products/:id`
Detalhes de um produto.

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Hambúrguer FLAME",
  "description": "Blend premium 180g com queijo cheddar",
  "price": 45.00,
  "category": "food",
  "subcategory": "burgers",
  "image": "/uploads/burger.jpg",
  "available": true,
  "stock": 25,
  "ingredients": [
    { "name": "Carne", "quantity": 180 },
    { "name": "Queijo Cheddar", "quantity": 50 }
  ],
  "nutritional": {
    "calories": 650,
    "protein": 35,
    "carbs": 45,
    "fat": 28
  }
}
```

#### `POST /products` 🔒 Admin
Criar novo produto.

**Request:**
```json
{
  "name": "Novo Produto",
  "description": "Descrição",
  "price": 30.00,
  "category": "food",
  "subcategory": "burgers",
  "image": "/uploads/novo.jpg",
  "stock": 50
}
```

**Response:** `201 Created`

#### `PUT /products/:id` 🔒 Admin
Atualizar produto.

#### `DELETE /products/:id` 🔒 Admin
Deletar produto.

---

### 3. **ORDERS** - `/orders`

#### `POST /orders`
Criar novo pedido.

**Request:**
```json
{
  "type": "dine_in",
  "table_number": 5,
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "notes": "Sem cebola"
    },
    {
      "product_id": 10,
      "quantity": 1
    }
  ],
  "payment_method": "credit_card",
  "use_cashback": 10.00
}
```

**Response:** `201 Created`
```json
{
  "id": 123,
  "order_number": "FLAME-123",
  "status": "pending",
  "type": "dine_in",
  "table_number": 5,
  "items": [...],
  "subtotal": 135.00,
  "service_fee": 13.50,
  "cashback_used": 10.00,
  "total": 138.50,
  "cashback_earned": 2.77,
  "created_at": "2026-01-16T20:30:00Z"
}
```

#### `GET /orders` 🔒
Listar pedidos do usuário.

**Query Params:**
- `status=pending|preparing|ready|completed|cancelled`
- `page=1`
- `limit=10`

#### `GET /orders/:id` 🔒
Detalhes de um pedido.

#### `PUT /orders/:id/status` 🔒 Staff
Atualizar status do pedido.

**Request:**
```json
{
  "status": "preparing",
  "estimated_time": 20
}
```

#### `POST /orders/:id/cancel` 🔒
Cancelar pedido (apenas se status=pending).

---

### 4. **RESERVATIONS** - `/reservations`

#### `POST /reservations`
Criar reserva.

**Request:**
```json
{
  "date": "2026-01-20",
  "time": "20:00",
  "guests": 4,
  "notes": "Aniversário - preciso de bolo"
}
```

**Response:** `201 Created`
```json
{
  "id": 45,
  "user_id": 1,
  "date": "2026-01-20",
  "time": "20:00",
  "guests": 4,
  "status": "pending",
  "notes": "Aniversário - preciso de bolo",
  "created_at": "2026-01-16T20:30:00Z"
}
```

#### `GET /reservations` 🔒
Listar reservas do usuário.

#### `GET /reservations/:id` 🔒
Detalhes de uma reserva.

#### `PUT /reservations/:id` 🔒
Atualizar reserva (apenas se status=pending).

#### `DELETE /reservations/:id` 🔒
Cancelar reserva.

#### `PUT /reservations/:id/confirm` 🔒 Staff
Confirmar reserva.

#### `PUT /reservations/:id/complete` 🔒 Staff
Marcar como completa (cliente compareceu).

#### `PUT /reservations/:id/no-show` 🔒 Staff
Marcar como no-show (cliente não compareceu).

---

### 5. **HOOKAH** - `/hookah`

#### `GET /hookah/flavors`
Listar sabores disponíveis.

**Response:** `200 OK`
```json
{
  "flavors": [
    {
      "id": 1,
      "name": "Mint",
      "category": "fresh",
      "price": 60.00,
      "available": true
    }
  ]
}
```

#### `POST /hookah/orders`
Pedir narguile.

**Request:**
```json
{
  "table_number": 5,
  "flavors": [1, 5],
  "size": "standard",
  "notes": "Com mais gelo"
}
```

**Response:** `201 Created`

---

### 6. **USERS** - `/users`

#### `GET /users/profile` 🔒
Ver perfil do usuário logado.

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "+5521999999999",
  "phone_verified": true,
  "role": "customer",
  "tier": "gold",
  "cashback_balance": 45.80,
  "total_spent": 3250.00,
  "orders_count": 28,
  "created_at": "2025-06-15T10:00:00Z"
}
```

#### `PUT /users/profile` 🔒
Atualizar perfil.

**Request:**
```json
{
  "name": "João Silva Jr",
  "phone": "+5521988888888",
  "preferences": {
    "notifications": true,
    "marketing": false
  }
}
```

#### `GET /users/cashback` 🔒
Ver histórico de cashback.

**Response:** `200 OK`
```json
{
  "balance": 45.80,
  "tier": "gold",
  "rate": 0.08,
  "history": [
    {
      "id": 1,
      "type": "earned",
      "amount": 2.77,
      "order_id": 123,
      "created_at": "2026-01-16T20:30:00Z"
    }
  ]
}
```

#### `GET /users/orders` 🔒
Histórico de pedidos (alias para `/orders`).

#### `GET /users/reservations` 🔒
Histórico de reservas (alias para `/reservations`).

---

### 7. **NOTIFICATIONS** - `/notifications`

#### `GET /notifications` 🔒
Listar notificações do usuário.

**Response:** `200 OK`
```json
{
  "notifications": [
    {
      "id": 1,
      "type": "order_status",
      "title": "Pedido pronto!",
      "message": "Seu pedido #FLAME-123 está pronto",
      "read": false,
      "created_at": "2026-01-16T20:45:00Z"
    }
  ],
  "unread_count": 3
}
```

#### `PUT /notifications/:id/read` 🔒
Marcar notificação como lida.

#### `POST /notifications/subscribe` 🔒
Registrar dispositivo para push notifications.

**Request:**
```json
{
  "subscription": {
    "endpoint": "https://...",
    "keys": {
      "p256dh": "...",
      "auth": "..."
    }
  }
}
```

---

### 8. **ADMIN** - `/admin`

Todas as rotas requerem `role=admin` ou `role=staff`.

#### `GET /admin/dashboard`
Estatísticas gerais.

**Response:** `200 OK`
```json
{
  "today": {
    "orders": 45,
    "revenue": 3250.00,
    "avg_ticket": 72.22
  },
  "month": {
    "orders": 890,
    "revenue": 68500.00,
    "avg_ticket": 77.00
  }
}
```

#### `GET /admin/orders`
Listar todos os pedidos.

#### `GET /admin/users`
Listar todos os usuários.

#### `GET /admin/inventory`
Ver estoque de ingredientes.

#### `PUT /admin/inventory/:id`
Atualizar estoque.

---

## 🔌 WebSocket Events

Conecte via Socket.IO em `http://localhost:7000`

### Client → Server

```javascript
// Autenticar
socket.emit('authenticate', { token: 'jwt_token' })

// Entrar em sala de pedido
socket.emit('join:order', { orderId: 123 })

// Entrar em sala de mesa
socket.emit('join:table', { tableNumber: 5 })
```

### Server → Client

```javascript
// Status de pedido atualizado
socket.on('order:status', (data) => {
  // { orderId: 123, status: 'preparing', estimatedTime: 20 }
})

// Notificação de pedido pronto
socket.on('order:ready', (data) => {
  // { orderId: 123, orderNumber: 'FLAME-123' }
})

// Nova reserva (staff)
socket.on('reservation:new', (data) => {
  // { id: 45, guests: 4, time: '20:00' }
})

// Alerta de estoque baixo (admin)
socket.on('inventory:low', (data) => {
  // { ingredient: 'Carne', stock: 2, minimum: 10 }
})
```

---

## ⚠️ Códigos de Status

| Código | Descrição |
|--------|-----------|
| `200` | Sucesso |
| `201` | Criado com sucesso |
| `400` | Requisição inválida |
| `401` | Não autenticado |
| `403` | Sem permissão |
| `404` | Não encontrado |
| `409` | Conflito (ex: email já existe) |
| `422` | Validação falhou |
| `429` | Rate limit excedido |
| `500` | Erro interno do servidor |

---

## 📋 Formato de Erros

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Email inválido"
    }
  ]
}
```

---

## 🔒 Rate Limiting

- **Geral:** 100 requests / 15 minutos
- **Auth:** 5 tentativas / 15 minutos
- **SMS:** 3 códigos / 5 minutos

---

## 📝 Notas Importantes

1. **Timestamps:** Sempre em UTC (ISO 8601)
2. **Moeda:** Sempre em BRL (R$), valores em float
3. **Paginação:** Default `page=1, limit=20`
4. **Ordenação:** Default por `created_at DESC`
5. **Filtros:** Case-insensitive search
6. **IDs:** Sempre inteiros auto-increment

---

**Última atualização:** 2026-01-16
**Autor:** MANUS EXECUTOR v7.1

Para exemplos de integração, veja: [`frontend/src/services/api.ts`](../frontend/src/services/api.ts)
