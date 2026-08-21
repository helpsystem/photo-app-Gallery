# Invoice Manager Deployment Guide

این راهنما برای دیپلوی سیستم Invoice & Product Manager (Shebaco) به همراه Photo Gallery موجود است.

## تغییرات اعمال شده

### 1. دیتابیس (Supabase)
جداول جدید زیر به دیتابیس اضافه شد:
- `products` - محصولات
- `pricing_tiers` - سطوح قیمتی هر محصول
- `customers` - مشتریان
- `invoices` - فاکتورها
- `invoice_items` - آیتم‌های فاکتور
- `company_info` - اطلاعات شرکت/برند
- `invoice_settings` - تنظیمات سیستم فاکتور

**نحوه اجرا:**
1. وارد Supabase SQL Editor شوید
2. محتوای فایل `supabase-setup.sql` را کپی و اجرا کنید

### 2. API Routes جدید
مسیرهای API زیر اضافه شد:
- `POST/GET/PUT/DELETE /api/invoice/products` - مدیریت محصولات
- `POST/GET/PUT/DELETE /api/invoice/invoices` - مدیریت فاکتورها
- `POST/GET/PUT/DELETE /api/invoice/customers` - مدیریت مشتریان
- `POST/GET /api/invoice/company-info` - اطلاعات شرکت
- `POST/GET /api/invoice/settings` - تنظیمات

### 3. صفحه جدید
- `/invoice` - داشبورد مدیریت فاکتور و محصولات

### 4. Navigation
یک آیتم جدید "Invoice" به منوی شناور اضافه شد.

## دیپلوی روی هاست فعلی (Virtual Machine)

### پیش‌نیازها
- دسترسی SSH به سرور
- Docker و Docker Compose نصب شده
- Supabase تنظیم شده با database جدید

### مراحل دیپلوی

#### 1. آپدیت Database
```bash
# در Supabase SQL Editor محتوای supabase-setup.sql را اجرا کنید
```

#### 2. آماده‌سازی فایل‌ها
```bash
# در ماشین محلی
cd "D:\Windows.old\Users\Sami\Desktop\Iran Church DC\Wordpress\photo-gallery-app"

# ساخت build برای production
npm run build

# فشرده‌سازی پروژه (بدون node_modules و .git)
# فقط فایل‌های ضروری:
```

فایل‌های مورد نیاز برای دیپلوی:
- `.next/` (پس از build)
- `app/`
- `components/`
- `lib/`
- `messages/`
- `public/`
- `package.json`
- `next.config.js`
- `Dockerfile`
- `docker-compose.yml`
- `.env` (با متغیرهای محیطی صحیح)

#### 3. انتقال به سرور

```bash
# استفاده از SCP یا FTP
scp -r ./photo-gallery-app user@your-server-ip:/home/user/apps/

# یا استفاده از Git
git add .
git commit -m "Add Invoice Manager"
git push origin main

# در سرور
cd /home/user/apps/
git pull origin main
```

#### 4. تنظیم متغیرهای محیطی

ایجاد فایل `.env` در سرور:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Cloudinary (برای گالری عکس)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional: Gemini API (برای ویژگی‌های AI در Invoice Manager)
GEMINI_API_KEY=your_gemini_api_key

# App URL
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

#### 5. Build و اجرا با Docker

```bash
# در سرور
cd /home/user/apps/photo-gallery-app

# نصب dependencies
npm install

# Build
npm run build

# اجرا با Docker Compose
docker-compose down
docker-compose build
docker-compose up -d

# بررسی لاگ‌ها
docker-compose logs -f
```

#### 6. تنظیم دامنه و SSL

اگر از Traefik استفاده می‌کنید (همانطور که در docker-compose.yml پیکربندی شده):

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.ram-gallery.rule=Host(`your-domain.com`)"
  - "traefik.http.routers.ram-gallery.entrypoints=websecure"
  - "traefik.http.routers.ram-gallery.tls.certresolver=letsencrypt"
```

اگر از Nginx استفاده می‌کنید:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 7. تست

```bash
# بررسی وضعیت کانتینر
docker ps

# تست API
curl https://your-domain.com/api/invoice/products

# بررسی لاگ‌ها
docker logs ram-gallery
```

## دیپلوی بدون Docker

اگر می‌خواهید بدون Docker اجرا کنید:

```bash
# در سرور
cd /home/user/apps/photo-gallery-app

# نصب dependencies
npm install

# Build
npm run build

# اجرا با PM2
npm install -g pm2
pm2 start npm --name "ram-gallery" -- start
pm2 save
pm2 startup
```

## مانیتورینگ و نگهداری

### بررسی لاگ‌ها
```bash
# Docker
docker logs ram-gallery -f

# PM2
pm2 logs ram-gallery
```

### آپدیت اپلیکیشن
```bash
cd /home/user/apps/photo-gallery-app
git pull origin main
npm install
npm run build
docker-compose restart
# یا
pm2 restart ram-gallery
```

### بکاپ دیتابیس
در Supabase به صورت خودکار بکاپ گرفته می‌شود. می‌توانید از SQL Editor یا CLI استفاده کنید:

```bash
# Export specific tables
supabase db dump --table products,invoices,customers > backup.sql
```

## استفاده از سیستم Invoice Manager

1. وارد `/invoice` شوید
2. ابتدا در Settings اطلاعات شرکت خود را تکمیل کنید
3. محصولات خود را در بخش Products اضافه کنید
4. برای ساخت فاکتور به بخش Invoices بروید
5. فاکتورها را چاپ یا به صورت PDF دانلود کنید

## رفع مشکلات رایج

### خطای 401 (Unauthorized)
- بررسی کنید که Supabase credentials صحیح باشد
- بررسی کنید که RLS policies به درستی تنظیم شده‌اند

### خطای 500 در API
- لاگ‌های سرور را بررسی کنید
- بررسی کنید که جداول دیتابیس ایجاد شده‌اند

### صفحه 404
- بررسی کنید که build به درستی انجام شده است
- `next.config.js` را بررسی کنید

## پشتیبانی

برای مشکلات یا سوالات، لاگ‌ها را بررسی کنید یا به اطلاعات زیر مراجعه کنید:
- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
- Docker Docs: https://docs.docker.com/

---

تاریخ: {{ DATE }}
نسخه: 1.0.0
