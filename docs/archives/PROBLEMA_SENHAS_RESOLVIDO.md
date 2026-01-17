# ✅ PROBLEMA DE SENHAS RESOLVIDO!

**Data**: 06/12/2025 09:41 BRT

## Problema Identificado:

Os usuários padrão foram criados com **duplo hash de senha**:
1. Endpoint `/seed-users` fazia hash manual (linha 27)
2. Hook `beforeSave` do modelo User fazia hash novamente
3. Resultado: Senha com duplo hash não funcionava no login

## Solução Aplicada:

### 1. Correção do `/seed-users` (seed-route.js linha 27)

**ANTES (ERRADO)**:
```javascript
const hashedPassword = await bcrypt.hash(userData.password, 10);
password: hashedPassword  // ❌ Duplo hash
```

**DEPOIS (CORRETO)**:
```javascript
password: userData.password  // ✅ Hook fará o hash
```

### 2. Criação do endpoint `/fix-passwords`

Atualiza APENAS as senhas dos usuários de teste, sem deletar:

```javascript
POST /api/fix-passwords
Header: x-seed-key: FLAME2024SEED
```

## Resultado:

✅ Todos os 7 usuários atualizados com sucesso:
- admin@flamelounge.com.br ✅
- gerente@flamelounge.com.br ✅
- cozinha@flamelounge.com.br ✅
- bar@flamelounge.com.br ✅
- atendente@flamelounge.com.br ✅
- caixa@flamelounge.com.br ✅
- cliente@flamelounge.com.br ✅

✅ Login do admin testado e funcionando!

## Credenciais de Teste:

| Email | Senha | Role |
|-------|-------|------|
| admin@flamelounge.com.br | admin123 | admin |
| gerente@flamelounge.com.br | gerente123 | gerente |
| cozinha@flamelounge.com.br | cozinha123 | cozinha |
| bar@flamelounge.com.br | bar123 | bar |
| atendente@flamelounge.com.br | atendente123 | atendente |
| caixa@flamelounge.com.br | caixa123 | caixa |
| cliente@flamelounge.com.br | cliente123 | cliente |

## Próximos Passos:

1. ✅ Senhas corrigidas
2. ⏳ Testar login de todos os usuários em https://flame-lounge.vercel.app/login
3. ⏳ Corrigir botão Google (PROBLEMA 1)
4. ⏳ Adicionar CPF no registro (PROBLEMA 3)

