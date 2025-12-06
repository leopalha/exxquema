# CORREÇÕES A APLICAR

## PROBLEMA 1: Botão Google não aparece na aba SMS

### Arquivos a modificar:
1. frontend/src/pages/login.js
2. frontend/src/pages/register.js

### Solução:
Mover o bloco do botão Google + divider para DENTRO de cada método (SMS e Password).

Isso força o componente GoogleLoginButton a desmontar/montar quando trocar de aba, executando o useEffect novamente.

## PROBLEMA 2: Usuários padrão não existem

### Verificar endpoint de seed:
- GET/POST /api/seed

### Usuários esperados:
- admin@flamelounge.com.br / admin123
- gerente@flamelounge.com.br / gerente123  
- cozinha@flamelounge.com.br / cozinha123
- bar@flamelounge.com.br / bar123

## PROBLEMA 3: CPF

### 3.1: Adicionar campo CPF no registro
- frontend/src/pages/register.js
- Adicionar input CPF opcional
- Usar máscara 000.000.000-00

### 3.2: Corrigir validação CPF
- backend/src/middlewares/validation.middleware.js
- Adicionar validação de dígitos verificadores

