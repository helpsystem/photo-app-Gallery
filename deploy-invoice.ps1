# Deployment Script for Invoice Manager + Photo Gallery
# این اسکریپت فایل‌های پروژه را به سرور منتقل و دیپلوی می‌کند

param(
    [string]$ServerHost = "",
    [string]$ServerUser = "",
    [string]$ServerPath = "/home/user/apps/photo-gallery-app",
    [switch]$BuildOnly,
    [switch]$DeployOnly,
    [switch]$RestartOnly
)

$ErrorActionPreference = "Stop"

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Photo Gallery + Invoice Manager" -ForegroundColor Cyan
Write-Host "Deployment Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# تعریف رنگ‌ها
function Write-Step {
    param([string]$Message)
    Write-Host "[>] $Message" -ForegroundColor Yellow
}

function Write-Success {
    param([string]$Message)
    Write-Host "[✓] $Message" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "[✗] $Message" -ForegroundColor Red
}

# مرحله 1: Build پروژه
if (-not $DeployOnly -and -not $RestartOnly) {
    Write-Step "Building project..."
    
    try {
        # نصب dependencies
        Write-Step "Installing dependencies..."
        npm install
        Write-Success "Dependencies installed"
        
        # Build Next.js
        Write-Step "Building Next.js application..."
        npm run build
        Write-Success "Build completed"
        
        if ($BuildOnly) {
            Write-Success "Build completed successfully!"
            exit 0
        }
    }
    catch {
        Write-Error "Build failed: $_"
        exit 1
    }
}

# مرحله 2: آماده‌سازی فایل‌ها برای انتقال
if (-not $RestartOnly) {
    Write-Step "Preparing files for deployment..."
    
    # ایجاد دایرکتوری موقت
    $tempDir = ".\deploy-temp"
    if (Test-Path $tempDir) {
        Remove-Item $tempDir -Recurse -Force
    }
    New-Item -ItemType Directory -Path $tempDir | Out-Null
    
    # کپی فایل‌های ضروری
    $filesToCopy = @(
        ".next",
        "app",
        "components",
        "lib",
        "messages",
        "public",
        "package.json",
        "package-lock.json",
        "next.config.js",
        "tailwind.config.ts",
        "postcss.config.js",
        "tsconfig.json",
        "i18n.ts",
        "middleware.ts",
        "Dockerfile",
        "docker-compose.yml"
    )
    
    foreach ($item in $filesToCopy) {
        if (Test-Path $item) {
            Write-Step "Copying $item..."
            Copy-Item -Path $item -Destination $tempDir -Recurse -Force
        }
    }
    
    # کپی .env اگر وجود داشته باشد
    if (Test-Path ".env") {
        Copy-Item -Path ".env" -Destination $tempDir -Force
    }
    
    Write-Success "Files prepared"
}

# مرحله 3: انتقال به سرور
if (-not $BuildOnly -and -not $RestartOnly) {
    if ([string]::IsNullOrEmpty($ServerHost) -or [string]::IsNullOrEmpty($ServerUser)) {
        Write-Host ""
        Write-Host "Server details required for deployment:" -ForegroundColor Yellow
        Write-Host "Please provide the following information:" -ForegroundColor Yellow
        Write-Host ""
        
        if ([string]::IsNullOrEmpty($ServerHost)) {
            $ServerHost = Read-Host "Server IP or hostname"
        }
        
        if ([string]::IsNullOrEmpty($ServerUser)) {
            $ServerUser = Read-Host "Server username"
        }
        
        Write-Host ""
    }
    
    Write-Step "Deploying to ${ServerUser}@${ServerHost}:${ServerPath}..."
    
    # استفاده از SCP برای انتقال
    Write-Step "Uploading files via SCP..."
    Write-Host "Please enter your server password when prompted..." -ForegroundColor Cyan
    
    # فشرده‌سازی فایل‌ها
    $archiveName = "photo-gallery-deploy-$(Get-Date -Format 'yyyyMMdd-HHmmss').zip"
    Write-Step "Creating archive: $archiveName"
    Compress-Archive -Path "$tempDir\*" -DestinationPath $archiveName -Force
    Write-Success "Archive created"
    
    # انتقال فایل
    Write-Step "Uploading to server..."
    Write-Host ""
    Write-Host "Manual deployment steps:" -ForegroundColor Yellow
    Write-Host "1. Upload $archiveName to your server" -ForegroundColor White
    Write-Host "2. Connect to your server via SSH:" -ForegroundColor White
    Write-Host "   ssh ${ServerUser}@${ServerHost}" -ForegroundColor Cyan
    Write-Host "3. Extract and deploy:" -ForegroundColor White
    Write-Host "   cd $ServerPath" -ForegroundColor Cyan
    Write-Host "   # Backup current version if needed" -ForegroundColor Cyan
    Write-Host "   # cp -r .next .next.backup" -ForegroundColor Cyan
    Write-Host "   unzip $archiveName" -ForegroundColor Cyan
    Write-Host "   docker-compose down" -ForegroundColor Cyan
    Write-Host "   docker-compose build" -ForegroundColor Cyan
    Write-Host "   docker-compose up -d" -ForegroundColor Cyan
    Write-Host ""
    
    # پاکسازی
    Remove-Item $tempDir -Recurse -Force
    Write-Success "Archive ready for deployment: $archiveName"
}

# مرحله 4: اجرای دستورات remote (اگر SSH config شده باشد)
if ($RestartOnly) {
    Write-Step "Restarting application on server..."
    Write-Host "Please run the following commands on your server:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "cd $ServerPath" -ForegroundColor Cyan
    Write-Host "docker-compose restart" -ForegroundColor Cyan
    Write-Host "# or" -ForegroundColor Cyan
    Write-Host "pm2 restart ram-gallery" -ForegroundColor Cyan
    Write-Host ""
}

Write-Host ""
Write-Success "Script completed!"
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Make sure Supabase database is updated (run supabase-setup.sql)" -ForegroundColor White
Write-Host "2. Upload and extract the archive on your server" -ForegroundColor White
Write-Host "3. Set up environment variables (.env)" -ForegroundColor White
Write-Host "4. Run docker-compose or pm2 to start the application" -ForegroundColor White
Write-Host "5. Test the application at https://your-domain.com/invoice" -ForegroundColor White
Write-Host ""
Write-Host "For detailed instructions, see INVOICE_DEPLOYMENT.md" -ForegroundColor Cyan
Write-Host ""
