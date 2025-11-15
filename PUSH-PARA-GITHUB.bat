@echo off
echo ================================================
echo    ENVIANDO CODIGO PARA GITHUB - @leopalha
echo ================================================
echo.

REM Mudar para o drive D: primeiro
D:

REM Navegar para o diretorio
cd D:\exxquema

echo [1/3] Verificando Git...
git status

echo.
echo [2/3] Configurando remote...
git remote add origin https://github.com/leopalha/exxquema.git 2>nul
git remote -v

echo.
echo [3/3] Renomeando branch e fazendo push...
git branch -M main

echo.
echo ================================================
echo   ATENCAO: Voce vai precisar autenticar!
echo ================================================
echo   Username: leopalha
echo   Password: Use seu Personal Access Token
echo.
echo   Nao tem token? Crie aqui:
echo   https://github.com/settings/tokens/new
echo   Marque: repo
echo ================================================
echo.

git push -u origin main

echo.
if %errorlevel% equ 0 (
    echo ================================================
    echo   SUCESSO! Codigo enviado para GitHub!
    echo ================================================
    echo.
    echo Repositorio: https://github.com/leopalha/exxquema
    echo.
    echo PROXIMO PASSO:
    echo 1. Acesse: https://vercel.com/new
    echo 2. Procure: leopalha/exxquema
    echo 3. Root Directory: frontend
    echo 4. Deploy!
    echo.
) else (
    echo ================================================
    echo   ERRO! Veja as solucoes abaixo:
    echo ================================================
    echo.
    echo PROBLEMA: Repositorio nao existe?
    echo SOLUCAO: Crie em https://github.com/new
    echo          Nome: exxquema
    echo.
    echo PROBLEMA: Erro de autenticacao?
    echo SOLUCAO: Crie Personal Access Token
    echo          https://github.com/settings/tokens/new
    echo.
)

pause
