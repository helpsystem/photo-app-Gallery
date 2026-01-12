# راهنمای راه‌اندازی محلی (Local Setup)

## پیش‌نیازها

- Node.js 18+ نصب شده باشد
- npm یا yarn یا pnpm
- حساب Supabase (رایگان)
- حساب Cloudinary (رایگان)

## مراحل نصب

### 1. نصب وابستگی‌ها

```bash
cd photo-gallery-app
npm install
```

### 2. تنظیم متغیرهای محیطی

فایل `.env.local` را در ریشه پروژه ایجاد کنید:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. راه‌اندازی پایگاه داده

1. به داشبورد Supabase بروید
2. SQL Editor را باز کنید
3. محتوای فایل `supabase-setup.sql` را کپی و اجرا کنید

### 4. اجرای سرور توسعه

```bash
npm run dev
```

### 5. مشاهده سایت

مرورگر را باز کنید و به آدرس زیر بروید:

- **فارسی (پیش‌فرض)**: http://localhost:3000/fa
- **انگلیسی**: http://localhost:3000/en
- **اسپانیایی**: http://localhost:3000/es

یا فقط: http://localhost:3000 (به صورت خودکار به زبان پیش‌فرض هدایت می‌شود)

## تغییر زبان

در نوار ناوبری بالا، روی آیکون Globe کلیک کنید و زبان مورد نظر را انتخاب کنید.

## دسترسی به پنل مدیریت

1. یک کاربر در Supabase Auth ایجاد کنید
2. به `/fa/auth/login` بروید (یا `/en/auth/login` یا `/es/auth/login`)
3. با اطلاعات کاربری خود وارد شوید
4. به پنل مدیریت هدایت می‌شوید

## ساخت برای Production

```bash
npm run build
npm start
```

## مشکلات رایج

### خطای "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### خطای "Environment variables not found"
مطمئن شوید فایل `.env.local` در ریشه پروژه وجود دارد و متغیرها را پر کرده‌اید.

### خطای Database
مطمئن شوید SQL script را در Supabase اجرا کرده‌اید.

## پشتیبانی

اگر مشکلی پیش آمد، بررسی کنید:
1. Console مرورگر برای خطاهای JavaScript
2. Terminal برای خطاهای سرور
3. Supabase Logs
4. Cloudinary Dashboard

---

**موفق باشید! 🚀**