# COMANDO PARA CORRIGIR SENHAS DOS USUÁRIOS PADRÃO

## Problema Identificado:

O endpoint `/seed-users` faz hash DUPLO da senha:
1. Linha 27: `bcrypt.hash(userData.password, 10)` 
2. Hook beforeSave (linha 338 do User.js): Faz hash novamente

Resultado: Senha fica com duplo hash e não funciona no login.

## Solução Segura (SEM DELETAR):

Criar endpoint temporário para atualizar apenas a senha, ou usar SQL direto.

### Opção 1: Via código (mais seguro)

Adicionar no `seed-route.js`:

```javascript
// Fix passwords - atualiza senha sem fazer hash manual
router.post('/fix-passwords', async (req, res) => {
  const secretKey = req.headers['x-seed-key'] || req.body.secretKey;
  if (secretKey !== 'FLAME2024SEED') {
    return res.status(403).json({ success: false, message: 'Chave inválida' });
  }

  try {
    const usersToFix = [
      { email: 'admin@flamelounge.com.br', password: 'admin123' },
      { email: 'gerente@flamelounge.com.br', password: 'gerente123' },
      { email: 'cozinha@flamelounge.com.br', password: 'cozinha123' },
      { email: 'bar@flamelounge.com.br', password: 'bar123' },
      { email: 'atendente@flamelounge.com.br', password: 'atendente123' },
      { email: 'caixa@flamelounge.com.br', password: 'caixa123' },
      { email: 'cliente@flamelounge.com.br', password: 'cliente123' }
    ];

    const results = [];
    for (const { email, password } of usersToFix) {
      const user = await User.findOne({ where: { email } });
      if (user) {
        // Atualizar senha diretamente - o hook beforeSave fará o hash
        user.password = password;
        await user.save();
        results.push({ email, updated: true });
      } else {
        results.push({ email, updated: false, reason: 'User not found' });
      }
    }

    res.json({ success: true, message: 'Passwords fixed', data: results });
  } catch (error) {
    console.error('Fix passwords error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});
```

### Opção 2: Corrigir o seed original

No `seed-route.js` linha 27, REMOVER o hash manual:

**ANTES (ERRADO - duplo hash)**:
```javascript
const hashedPassword = await bcrypt.hash(userData.password, 10);
const [user, created] = await User.findOrCreate({
  where: { email: userData.email },
  defaults: {
    ...
    password: hashedPassword,  // ❌ Hash manual
    ...
  }
});
```

**DEPOIS (CORRETO - hook faz o hash)**:
```javascript
const [user, created] = await User.findOrCreate({
  where: { email: userData.email },
  defaults: {
    ...
    password: userData.password,  // ✅ Texto plano - hook fará hash
    ...
  }
});
```

## Ação Recomendada:

1. Adicionar endpoint `/fix-passwords` no seed-route.js
2. Deploy backend
3. Executar: `POST /api/fix-passwords` com header `x-seed-key: FLAME2024SEED`
4. Testar login dos usuários

## IMPORTANTE:

❌ NÃO usar `/reset-users` - ele DELETA todos os usuários
✅ Usar `/fix-passwords` - apenas atualiza senha sem deletar
