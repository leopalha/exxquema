# Script para abrir navegador completamente limpo

Write-Host "🧹 ABRINDO NAVEGADOR LIMPO..." -ForegroundColor Green
Write-Host ""

# Detectar navegador padrão
$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

$browserPath = $null
$browserName = ""

if (Test-Path $chromePath) {
    $browserPath = $chromePath
    $browserName = "Chrome"
} elseif (Test-Path $edgePath) {
    $browserPath = $edgePath
    $browserName = "Edge"
}

if ($browserPath) {
    Write-Host "✅ Abrindo $browserName em modo INCOGNITO/PRIVADO..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "URL: http://localhost:3001/cardapio" -ForegroundColor Cyan
    Write-Host ""
    
    # Abrir em modo incógnito
    if ($browserName -eq "Chrome") {
        Start-Process $browserPath -ArgumentList "--incognito","http://localhost:3001/cardapio"
    } else {
        Start-Process $browserPath -ArgumentList "-inprivate","http://localhost:3001/cardapio"
    }
    
    Write-Host "✅ Navegador aberto!" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  IMPORTANTE: O navegador está em modo PRIVADO" -ForegroundColor Yellow
    Write-Host "   Isso garante que NÃO HÁ CACHE ou Service Worker ativo" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📊 Deve aparecer: '62 produtos encontrados'" -ForegroundColor Green
} else {
    Write-Host "❌ Navegador não encontrado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "ABRA MANUALMENTE em modo ANÔNIMO:" -ForegroundColor Yellow
    Write-Host "  http://localhost:3001/cardapio" -ForegroundColor Cyan
}
