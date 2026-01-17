# 🛡️ CSRF Protection - Guia de Uso

## O que é CSRF?

CSRF (Cross-Site Request Forgery) é um ataque onde um site malicioso induz o navegador a fazer requisições não autorizadas para nosso backend usando as credenciais do usuário (cookies, tokens JWT, etc).

**Exemplo de ataque**:
1. Usuário está logado no FLAME (tem JWT válido)
2. Visita site malicioso
3. Site malicioso faz POST para `https://backend-production.railway.app/api/orders` com dados maliciosos
4. Request inclui JWT automaticamente (cookies)
5. Backend aceita porque JWT é válido ❌

**Como CSRF previne**:
- Adiciona token único e secreto em cada request
- Site malicioso não tem acesso ao token (SameSite cookie)
- Backend valida token antes de processar

---

## Implementação no Backend

### 1. Middleware CSRF

Localizado em: `backend/src/middlewares/csrf.middleware.js`

**Funções disponíveis**:
- `csrfTokenMiddleware` - Gera token CSRF
- `csrfProtectionMiddleware` - Valida token CSRF
- `getCsrfTokenHandler` - Handler para GET /api/csrf-token

### 2. Rota para obter token

```http
GET /api/csrf-token
```

**Response**:
```json
{
  "success": true,
  "data": {
    "csrfToken": "abc123...xyz"
  }
}
```

### 3. Cookie automático

O backend seta automaticamente um cookie:
```
__Host-psifi.x-csrf-token
```

**Opções do cookie**:
- `httpOnly: true` - JavaScript não pode acessar
- `sameSite: 'strict'` - Apenas requests do mesmo domínio
- `secure: true` - Apenas HTTPS (em produção)

---

## Como Usar no Frontend

### Opção 1: Hook customizado (Recomendado)

Crie um hook `useCsrfToken`:

```javascript
// frontend/src/hooks/useCsrfToken.js
import { useState, useEffect } from 'react';
import { api } from '../services/api';

export const useCsrfToken = () => {
  const [csrfToken, setCsrfToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await api.get('/csrf-token');
        setCsrfToken(response.data.data.csrfToken);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchToken();
  }, []);

  return { csrfToken, loading, error };
};
```

**Uso no componente**:

```javascript
import { useCsrfToken } from '../hooks/useCsrfToken';

function CheckoutForm() {
  const { csrfToken, loading } = useCsrfToken();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!csrfToken) return;

    await api.post('/orders', orderData, {
      headers: {
        'x-csrf-token': csrfToken,
      },
    });
  };

  if (loading) return <LoadingSpinner />;

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Opção 2: Interceptor Axios (Automático)

Adicione interceptor no `api.js`:

```javascript
// frontend/src/services/api.js
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // IMPORTANTE: Envia cookies
});

// Cache do token CSRF
let csrfToken = null;

// Interceptor de request
api.interceptors.request.use(
  async (config) => {
    // Apenas para métodos que modificam dados
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(config.method?.toUpperCase())) {
      // Obter token se não tiver
      if (!csrfToken) {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/csrf-token`, {
            withCredentials: true,
          });
          csrfToken = response.data.data.csrfToken;
        } catch (error) {
          console.error('[CSRF] Erro ao obter token:', error);
        }
      }

      // Adicionar token no header
      if (csrfToken) {
        config.headers['x-csrf-token'] = csrfToken;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de response (limpar cache em erro 403)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403 && error.response?.data?.error === 'CSRF_TOKEN_INVALID') {
      // Token expirou, limpar cache e tentar novamente
      csrfToken = null;
    }
    return Promise.reject(error);
  }
);
```

**Vantagem**: Automático, não precisa adicionar em cada request.

### Opção 3: Manual em cada request

```javascript
// 1. Obter token
const response = await api.get('/csrf-token');
const csrfToken = response.data.data.csrfToken;

// 2. Usar em POST/PUT/DELETE
await api.post('/orders', orderData, {
  headers: {
    'x-csrf-token': csrfToken,
  },
});
```

---

## Métodos Protegidos

### Automático (ignorados pelo CSRF)

Estes métodos **NÃO** precisam de token:
- `GET` - Leitura de dados
- `HEAD` - Headers apenas
- `OPTIONS` - CORS preflight

### Requerem Token CSRF

Estes métodos **PRECISAM** de token:
- `POST` - Criar recursos
- `PUT` - Atualizar completo
- `PATCH` - Atualizar parcial
- `DELETE` - Deletar recursos

---

## Testando CSRF

### 1. Request válido (com token)

```bash
# 1. Obter token
curl -c cookies.txt http://localhost:7000/api/csrf-token

# 2. Extrair token do response
TOKEN="abc123...xyz"

# 3. Fazer request com token
curl -b cookies.txt \
  -H "Content-Type: application/json" \
  -H "x-csrf-token: $TOKEN" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -X POST \
  -d '{"items": [...]}' \
  http://localhost:7000/api/orders
```

**Response**: `200 OK`

### 2. Request inválido (sem token)

```bash
curl -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -X POST \
  -d '{"items": [...]}' \
  http://localhost:7000/api/orders
```

**Response**: `403 Forbidden`
```json
{
  "success": false,
  "message": "Token CSRF inválido ou ausente",
  "error": "CSRF_TOKEN_INVALID"
}
```

---

## Configuração de Produção

### Environment Variables

```env
# .env (Production)
CSRF_SECRET=your-very-long-random-secret-min-64-chars-change-this
NODE_ENV=production
```

**IMPORTANTE**:
- `CSRF_SECRET` deve ser diferente de `JWT_SECRET`
- Mínimo 64 caracteres
- Gerado aleatoriamente
- Nunca comitar no git

### Gerar secret seguro

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# OpenSSL
openssl rand -hex 64

# Python
python -c "import secrets; print(secrets.token_hex(64))"
```

---

## Troubleshooting

### Erro: "Token CSRF inválido ou ausente"

**Possíveis causas**:
1. Frontend não está enviando token
   - Verificar header `x-csrf-token`
   - Verificar `withCredentials: true` no axios

2. Cookie não está sendo enviado
   - Verificar `withCredentials: true`
   - Verificar domínio (localhost vs. production)
   - Verificar HTTPS em produção

3. Token expirou
   - Obter novo token com GET /api/csrf-token

4. CORS não configurado
   - Verificar `Access-Control-Allow-Credentials: true`
   - Verificar origem permitida no backend

### Debug

Adicione logs no frontend:

```javascript
api.interceptors.request.use((config) => {
  console.log('[CSRF] Token:', config.headers['x-csrf-token']);
  console.log('[CSRF] Method:', config.method);
  console.log('[CSRF] URL:', config.url);
  return config;
});
```

---

## Segurança Adicional

### Combine com outras proteções

CSRF é apenas uma camada. Combine com:
1. ✅ **JWT Authentication** - Verificar identidade
2. ✅ **CSRF Protection** - Prevenir forged requests
3. ✅ **Rate Limiting** - Prevenir brute force
4. ✅ **Input Validation** - Prevenir injection
5. ✅ **CORS** - Controlar origens permitidas
6. ✅ **Helmet** - Security headers
7. ⏳ **XSS Sanitization** - Prevenir scripts maliciosos

### SameSite Cookie

O cookie CSRF usa `sameSite: 'strict'`:
- Navegador **NÃO** envia cookie em requests cross-site
- Adiciona proteção extra mesmo sem validar token
- Modern browsers suportam

---

## Performance

### Cache do token

Token CSRF pode ser cacheado:
- Válido por toda a sessão
- Apenas gerar 1x no mount do app
- Renovar em caso de 403 CSRF_TOKEN_INVALID

**Exemplo**:

```javascript
// App.js
const [csrfToken, setCsrfToken] = useState(
  localStorage.getItem('csrfToken')
);

useEffect(() => {
  const fetchToken = async () => {
    const response = await api.get('/csrf-token');
    const token = response.data.data.csrfToken;

    setCsrfToken(token);
    localStorage.setItem('csrfToken', token);
  };

  if (!csrfToken) {
    fetchToken();
  }
}, []);
```

---

## Referências

- [OWASP CSRF Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [csrf-csrf Documentation](https://github.com/Psifi-Solutions/csrf-csrf)
- [Double Submit Cookie Pattern](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#double-submit-cookie)

---

**Criado por**: MANUS v7.1
**Data**: 2026-01-17
**Versão**: 1.0
