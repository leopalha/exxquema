# 🚨 PRÓXIMOS PASSOS URGENTES

**Sessão**: 06/12/2025
**Status**: 1 de 3 problemas resolvidos

---

## ✅ PROBLEMA 2 - RESOLVIDO!

Usuários padrão criados com sucesso via seed:
- admin@flamelounge.com.br / admin123
- gerente@flamelounge.com.br / gerente123
- cozinha@flamelounge.com.br / cozinha123
- bar@flamelounge.com.br / bar123
- atendente@flamelounge.com.br / atendente123
- caixa@flamelounge.com.br / caixa123
- cliente@flamelounge.com.br / cliente123

**Teste agora**: https://flame-lounge.vercel.app/login

---

## ⏳ PROBLEMA 1 - Botão Google (AGUARDANDO)

**Arquivo**: `frontend/src/pages/login.js`

**Correção necessária**: Mover o bloco das linhas 337-355 (divider + Google button) para DENTRO de cada aba.

**Locais**:
1. Dentro do bloco `loginMethod === 'sms'` (após linha 260)
2. Dentro do bloco `loginMethod === 'password'` (após linha 334)

**Mesmo problema**: `frontend/src/pages/register.js`

---

## ⏳ PROBLEMA 3 - CPF (AGUARDANDO)

### 3.1: Adicionar campo CPF no registro

**Arquivo**: `frontend/src/pages/register.js`

**Adicionar após campo "email"** (aproximadamente linha 290):

```javascript
{/* CPF (Opcional) */}
<div className="mb-4">
  <label htmlFor="cpf" className="block text-sm font-medium text-neutral-300 mb-2">
    CPF <span className="text-neutral-500 text-xs">(opcional)</span>
  </label>
  <input
    id="cpf"
    type="text"
    value={cpfValue}
    onChange={handleCPFChange}
    placeholder="000.000.000-00"
    maxLength={14}
    className="block w-full px-3 py-3 border rounded-lg bg-neutral-800 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 border-neutral-600 focus:ring-magenta-500"
  />
  <p className="text-xs text-neutral-500 mt-1">Obrigatório apenas para emissão de nota fiscal</p>
</div>
```

**Adicionar funções de máscara**:

```javascript
const [cpfValue, setCpfValue] = useState('');

const formatCPF = (value) => {
  const numbers = value.replace(/\D/g, '').slice(0, 11);
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9)}`;
};

const handleCPFChange = (e) => {
  const formatted = formatCPF(e.target.value);
  setCpfValue(formatted);
};
```

**Incluir CPF no handleRegister** (linha ~108):

```javascript
const userData = {
  nome: values.nome.trim(),
  email: values.email.trim().toLowerCase(),
  celular: celular,
  password: values.password,
  cpf: cpfValue || undefined  // Adicionar esta linha
};
```

### 3.2: Corrigir validação CPF backend

**Arquivo**: `backend/src/middlewares/validation.middleware.js`

**Adicionar função de validação** (no topo do arquivo):

```javascript
// Validar dígitos verificadores do CPF
function validateCPFDigits(cpf) {
  const cleanCPF = cpf.replace(/\D/g, '');
  
  if (cleanCPF.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false; // Sequências repetidas
  
  // Validar primeiro dígito
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let digit1 = 11 - (sum % 11);
  if (digit1 >= 10) digit1 = 0;
  if (parseInt(cleanCPF.charAt(9)) !== digit1) return false;
  
  // Validar segundo dígito
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  let digit2 = 11 - (sum % 11);
  if (digit2 >= 10) digit2 = 0;
  
  return parseInt(cleanCPF.charAt(10)) === digit2;
}
```

**Atualizar validação do campo cpf** (procurar por `body('cpf')`):

```javascript
body('cpf')
  .optional({ nullable: true, checkFalsy: true })
  .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
  .withMessage('CPF deve estar no formato 000.000.000-00')
  .custom((value) => {
    if (!validateCPFDigits(value)) {
      throw new Error('CPF inválido');
    }
    return true;
  }),
```

---

## 📋 SEQUÊNCIA DE IMPLEMENTAÇÃO RECOMENDADA

1. **Corrigir botão Google** (5 min)
   - login.js
   - register.js

2. **Adicionar CPF no registro** (10 min)
   - Adicionar campo
   - Adicionar máscaras
   - Incluir no userData

3. **Corrigir validação CPF** (5 min)
   - Adicionar função validateCPFDigits
   - Atualizar validação middleware

4. **Deploy** (5 min)
   - Frontend: `cd frontend && vercel --prod`
   - Backend: `cd backend && railway up`

5. **Testar todos os usuários** (15 min)
   - Cada um dos 7 usuários padrão
   - Cliente novo com CPF
   - Cliente novo sem CPF
   - Google OAuth

---

## 🧪 CHECKLIST DE TESTES

### Usuários Padrão
- [ ] admin@flamelounge.com.br / admin123
- [ ] gerente@flamelounge.com.br / gerente123
- [ ] cozinha@flamelounge.com.br / cozinha123
- [ ] bar@flamelounge.com.br / bar123
- [ ] atendente@flamelounge.com.br / atendente123
- [ ] caixa@flamelounge.com.br / caixa123
- [ ] cliente@flamelounge.com.br / cliente123

### Funcionalidades
- [ ] Botão Google aparece na aba SMS
- [ ] Botão Google aparece na aba Email
- [ ] Campo CPF aparece no registro
- [ ] CPF aceita formato válido
- [ ] CPF rejeita formato inválido
- [ ] CPF rejeita dígitos verificadores errados
- [ ] Registro funciona SEM CPF
- [ ] Registro funciona COM CPF válido

