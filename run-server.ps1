# Simple HTTP Server for Portfolio
Write-Host "Starting local server..." -ForegroundColor Green
Write-Host ""
Write-Host "Your portfolio is available at: http://localhost:8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

Set-Location $PSScriptRoot

# Try Python first, then fallback to other methods
if (Get-Command python -ErrorAction SilentlyContinue) {
    python -m http.server 8000
} elseif (Get-Command python3 -ErrorAction SilentlyContinue) {
    python3 -m http.server 8000
} else {
    Write-Host "Python not found. Please install Python or use Method 1 (direct file opening)." -ForegroundColor Red
    Write-Host "Alternatively, you can use VS Code's Live Server extension." -ForegroundColor Yellow
    pause
}

