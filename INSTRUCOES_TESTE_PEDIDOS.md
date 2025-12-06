# 🔍 INSTRUÇÕES PARA TESTE DE PEDIDOS - DEBUG

**Data**: 06/12/2025
**Commit**: ea180a6 - debug logs adicionados ao orderController.js

---

## 🎯 OBJETIVO DO TESTE

Descobrir por que os pedidos não estão chegando no bar quando você (Leonardo) faz uma compra.

---

## ✅ PREPARAÇÃO

### 1. Abrir 3 Abas do Navegador

**Aba 1 - Cliente (você como Leonardo)**
- URL: https://flame-lounge.vercel.app
- Login: `leonardo.palha@gmail.com`
- Senha: (sua senha)

**Aba 2 - Bar**
- URL: https://flame-lounge.vercel.app/login
- Login: `bar@flamelounge.com.br`
- Senha: `bar123`

**Aba 3 - Atendente**
- URL: https://flame-lounge.vercel.app/login
- Login: `atendente@flamelounge.com.br`
- Senha: `atendente123`

---

## 📋 PASSOS DO TESTE

### TESTE 1: Pedido Simples de Bebida (Caipirinha)

1. **Na Aba 1 (Leonardo)**:
   - Ir no cardápio
   - Adicionar **"Caipirinha Clássica"** ao carrinho
   - Finalizar pedido
   - **ANOTAR**: Número do pedido que aparecer

2. **Na Aba 2 (Bar)**:
   - **VERIFICAR**: O pedido apareceu IMEDIATAMENTE?
   - **ANOTAR**:
     - ✅ Sim, apareceu
     - ❌ Não, não apareceu
     - Se apareceu, quanto tempo demorou?

3. **Na Aba 3 (Atendente)**:
   - **VERIFICAR**: O pedido apareceu IMEDIATAMENTE?
   - **ANOTAR**:
     - ✅ Sim, apareceu
     - ❌ Não, não apareceu

---

### TESTE 2: Pedido de Comida (Hambúrguer)

1. **Na Aba 1 (Leonardo)**:
   - Ir no cardápio
   - Adicionar **"Hambúrguer FLAME"** ao carrinho
   - Finalizar pedido
   - **ANOTAR**: Número do pedido

2. **Verificar se aparece no Atendente**

---

## 🔍 VERIFICAR LOGS DO RAILWAY

**IMPORTANTE**: Vou precisar ver os logs do Railway após você fazer o pedido!

### Como verificar:

1. Após fazer o pedido de teste
2. Eu vou rodar: `railway logs --tail`
3. Procurar por essas mensagens de debug:

```
🔔 [NOTIFICAÇÃO] Enviando notificações para pedido #XXXX
📡 [WEBSOCKET] Notificando sobre pedido #XXXX...
✅ [WEBSOCKET] Notificação enviada com sucesso!
```

Se essas mensagens **NÃO aparecerem** = o código de notificação não está executando
Se essas mensagens **APARECEREM** = o código executa, mas há problema no WebSocket

---

## 📝 O QUE ANOTAR

Para cada teste, registre:

1. **Número do pedido**: #____
2. **Apareceu no Bar?**: ✅ Sim / ❌ Não
3. **Apareceu no Atendente?**: ✅ Sim / ❌ Não
4. **Tempo de atraso**: ____ segundos (se houver)
5. **Erros no console do navegador**: Sim / Não
   - Se sim, copiar os erros (F12 → Console)

---

## 🚨 CENÁRIOS POSSÍVEIS

### Cenário A: Pedido NÃO aparece no Bar
- **Causa Provável**: WebSocket não conectado ou notificação não sendo enviada
- **Ação**: Verificar logs do Railway

### Cenário B: Pedido aparece, mas com ATRASO (>5 segundos)
- **Causa Provável**: Problema de rede ou processamento lento
- **Ação**: Verificar tempo de resposta da API

### Cenário C: Pedido aparece IMEDIATAMENTE
- **Resultado**: ✅ TUDO FUNCIONANDO!
- **Ação**: Celebrar! 🎉

---

## 🔧 PRÓXIMOS PASSOS APÓS TESTE

Dependendo do resultado, vou:

1. **Se não aparece no bar**:
   - Investigar WebSocket connection
   - Verificar se `socketService.notifyNewOrder()` está sendo chamado
   - Checar se bar staff está conectado ao WebSocket

2. **Se aparece com atraso**:
   - Otimizar performance
   - Verificar latência de rede

3. **Se funciona perfeitamente**:
   - Remover debug logs
   - Partir para próximo teste (PhoneInput)

---

## ✅ CHECKLIST

Marque conforme testa:

- [ ] Login como Leonardo funcionou
- [ ] Login como Bar funcionou
- [ ] Login como Atendente funcionou
- [ ] Teste 1 (Caipirinha) executado
- [ ] Teste 2 (Hambúrguer) executado
- [ ] Anotei todos os resultados
- [ ] Copiei erros do console (se houver)
- [ ] Pronto para reportar resultados

---

**Boa sorte no teste!** 🚀

Quando terminar, me avise com os resultados anotados e eu vou verificar os logs do Railway para diagnosticar o problema.
