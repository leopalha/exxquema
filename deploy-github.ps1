# Script de Deploy para GitHub - EXXQUEMA
# Usuário: @leopalha

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   EXXQUEMA - Deploy para GitHub e Vercel      " -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Navegar para o diretório do projeto
Set-Location "D:\exxquema"

Write-Host "[1/4] Verificando status do Git..." -ForegroundColor Yellow
git status --short

Write-Host ""
Write-Host "[2/4] Adicionando remote do GitHub..." -ForegroundColor Yellow
git remote add origin https://github.com/leopalha/exxquema.git 2>$null

Write-Host ""
Write-Host "[3/4] Renomeando branch para 'main'..." -ForegroundColor Yellow
git branch -M main

Write-Host ""
Write-Host "[4/4] Fazendo push para GitHub..." -ForegroundColor Yellow
Write-Host "⚠️  ATENÇÃO: Você precisará autenticar!" -ForegroundColor Red
Write-Host "   Username: leopalha" -ForegroundColor White
Write-Host "   Password: Use seu Personal Access Token" -ForegroundColor White
Write-Host ""
Write-Host "   Não tem token? Crie aqui:" -ForegroundColor White
Write-Host "   https://github.com/settings/tokens/new" -ForegroundColor Cyan
Write-Host ""

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Green
    Write-Host "   ✅ CÓDIGO ENVIADO COM SUCESSO!" -ForegroundColor Green
    Write-Host "================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "📍 Seu repositório:" -ForegroundColor White
    Write-Host "   https://github.com/leopalha/exxquema" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🚀 PRÓXIMO PASSO:" -ForegroundColor Yellow
    Write-Host "   1. Acesse: https://vercel.com/new" -ForegroundColor White
    Write-Host "   2. Procure por: leopalha/exxquema" -ForegroundColor White
    Write-Host "   3. Clique em 'Import'" -ForegroundColor White
    Write-Host "   4. Root Directory: frontend" -ForegroundColor White
    Write-Host "   5. Clique em 'Deploy'" -ForegroundColor White
    Write-Host ""
    Write-Host "🌐 Seu site ficará em:" -ForegroundColor Yellow
    Write-Host "   https://exxquema.vercel.app" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Red
    Write-Host "   ❌ ERRO NO PUSH" -ForegroundColor Red
    Write-Host "================================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 SOLUÇÕES:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Repositório não existe?" -ForegroundColor White
    Write-Host "   Crie em: https://github.com/new" -ForegroundColor Cyan
    Write-Host "   Nome: exxquema" -ForegroundColor White
    Write-Host ""
    Write-Host "2. Erro de autenticação?" -ForegroundColor White
    Write-Host "   Crie um Personal Access Token:" -ForegroundColor White
    Write-Host "   https://github.com/settings/tokens/new" -ForegroundColor Cyan
    Write-Host "   Marque: repo" -ForegroundColor White
    Write-Host "   Use o token como senha" -ForegroundColor White
    Write-Host ""
}

Write-Host "Pressione qualquer tecla para continuar..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
