$ErrorActionPreference = "Stop"

$projectRoot = Get-Location
$deployDir = "$projectRoot\deploy"
$standaloneDeepPath = "$projectRoot\.next\standalone\Desktop\Iran Church DC\Wordpress\photo-gallery-app"

# 1. Clean previous deploy folder
if (Test-Path $deployDir) {
    long "Removing old deploy folder..."
    Remove-Item -Recurse -Force $deployDir
}
New-Item -ItemType Directory -Force -Path $deployDir | Out-Null

# 2. Copy Standalone Core Files
Write-Host "Copying standalone server files..."
Copy-Item -Recurse -Force "$standaloneDeepPath\*" "$deployDir\"

# 3. Copy Public Folder
Write-Host "Copying public assets..."
Copy-Item -Recurse -Force "$projectRoot\public" "$deployDir\public"

# 4. Copy Static Assets (Critical for CSS/JS)
Write-Host "Copying static assets..."
$staticDest = "$deployDir\.next\static"
New-Item -ItemType Directory -Force -Path $staticDest | Out-Null
Copy-Item -Recurse -Force "$projectRoot\.next\static\*" "$staticDest\"

# 5. Success Message
Write-Host "--------------------------------------------------------"
Write-Host "DEPLOYMENT PREPARATION COMPLETE!" -ForegroundColor Green
Write-Host "--------------------------------------------------------"
Write-Host "1. Go to the folder: $deployDir"
Write-Host "2. Select ALL files inside it."
Write-Host "3. Right-click -> Send to -> Compressed (zipped) folder."
Write-Host "4. Upload this zip file to your cPanel subdomain root."
Write-Host "--------------------------------------------------------"
