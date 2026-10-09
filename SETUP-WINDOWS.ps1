# Testimonial SaaS - Windows setup helper
# Run from PowerShell in the repository root.

$ErrorActionPreference = "Stop"

Write-Host "Checking required tools..." -ForegroundColor Cyan

$commands = @("git", "php", "composer", "node", "npm")
foreach ($cmd in $commands) {
    if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) {
        Write-Error "$cmd was not found in PATH."
    }
}

Write-Host ""
Write-Host "Versions:" -ForegroundColor Cyan
git --version
php -v | Select-Object -First 1
composer --version
node --version
npm --version

Write-Host ""
Write-Host "Repository files:" -ForegroundColor Cyan
Write-Host "CONTEXT.md"
Write-Host "AGENTS.md"
Write-Host ".github/copilot-instructions.md"
Write-Host ".github/agents/"
Write-Host ".github/prompts/"
Write-Host "docs/"

Write-Host ""
Write-Host "Next:" -ForegroundColor Yellow
Write-Host "1. Open this folder in Antigravity."
Write-Host "2. Start with the Discovery Agent."
Write-Host "3. After discovery succeeds, use the Bootstrap Agent."
Write-Host "4. Commit each completed phase separately."
