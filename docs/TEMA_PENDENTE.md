# FLAME - Páginas Pendentes de Tema Dinâmico

## ✅ TODAS AS PÁGINAS FORAM CORRIGIDAS!

### Alta Prioridade (páginas principais):
1. ✅ **checkout.js** - Página de finalização de pedido - CORRIGIDO
2. ✅ **pedidos.js** - Lista de pedidos do usuário - CORRIGIDO
3. ✅ **cashback.js** - Dashboard de cashback - CORRIGIDO
4. ✅ **reservas.js** - Página de reservas - CORRIGIDO

### Média Prioridade (admin):
5. ✅ **admin/reservas.js** - Admin de reservas - CORRIGIDO
6. ✅ **admin/estoque.js** - Gestão de estoque - CORRIGIDO

### Baixa Prioridade (staff):
7. ✅ **staff/caixa.js** - Sistema de caixa - CORRIGIDO
8. ✅ **staff/relatorios.js** - Relatórios - CORRIGIDO

### Outras:
9. ✅ **qr/[mesaId].js** - QR Code de mesa - CORRIGIDO
10. ✅ **perfil.js** - Perfil do usuário - CORRIGIDO

---

## 🔧 O que precisa ser substituído:

### Cores que devem usar variáveis CSS:

| Hardcoded | Substituir por |
|-----------|----------------|
| `from-red-600` | `from-[var(--theme-primary)]` |
| `to-red-500` | `to-[var(--theme-secondary)]` |
| `bg-red-500` | `bg-[var(--theme-primary)]` |
| `text-red-400` | `text-[var(--theme-primary)]` |
| `border-red-500` | `border-[var(--theme-primary)]` |
| `hover:bg-red-600` | `hover:bg-[var(--theme-primary)]` |

### Gradientes de botões:

**Antes:**
```jsx
<button className="bg-gradient-to-r from-red-600 to-red-500">
```

**Depois:**
```jsx
<button className="bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)]">
```

### Links/Textos ativos:

**Antes:**
```jsx
<a className="text-red-400">
```

**Depois:**
```jsx
<a className="text-[var(--theme-primary)]">
```

---

## ✅ Páginas já com tema dinâmico (não mexer):

- index.js (Hero)
- Header.js
- Footer.js
- BottomNav.js
- perfil.js (corrigido no Sprint 8)
- cardapio.js (ProductCard)

---

## 📝 Checklist de Correção:

Para cada página:
- [ ] Substituir gradientes de botões principais
- [ ] Substituir cores de texto em destaque
- [ ] Substituir cores de borda
- [ ] Substituir backgrounds de badges/tags
- [ ] Testar com todos os 6 temas (FLAME, INFERNO, PASSION, NEON, TWILIGHT, AMBER)

---

## 🎨 Temas disponíveis (para testar):

1. **FLAME** (magenta #FF006E + cyan #00D4FF) - Padrão
2. **INFERNO** (vermelho #DC2626 + roxo #9333EA)
3. **PASSION** (vinho #991B1B + pink #EC4899)
4. **NEON** (roxo #7C3AED + verde #10B981)
5. **TWILIGHT** (roxo #6366F1 + lavanda #A78BFA)
6. **AMBER** (dourado #F59E0B + rosa #EC4899)

---

## 🎉 Status Final

**TODAS AS 10 PÁGINAS FORAM CORRIGIDAS COM SUCESSO!**

- ✅ Todas as cores hardcoded `red-` foram substituídas por variáveis CSS dinâmicas
- ✅ Build compilado com sucesso (45 páginas)
- ✅ Sistema de temas dinâmicos 100% funcional
- ✅ Suporte para todos os 6 temas (FLAME, INFERNO, PASSION, NEON, TWILIGHT, AMBER)

### Resumo das Correções:
- **Botões de cancelar/excluir**: `text-red-400` → `text-[var(--theme-primary)]`
- **Backgrounds de erro/alerta**: `bg-red-500/20` → `bg-[var(--theme-primary)]/20`
- **Bordas**: `border-red-500` → `border-[var(--theme-primary)]`
- **Gradientes**: `from-red-600 to-red-500` → `from-[var(--theme-primary)] to-[var(--theme-secondary)]`

---

*Última atualização: 04/12/2024*
*Correções finalizadas: 04/12/2024*
