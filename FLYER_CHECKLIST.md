# ✅ Checklist - راه‌اندازی Flyer Designer

## 📋 مراحل الزامی

### 1. تنظیم Database
- [ ] وارد Supabase Dashboard شوید
- [ ] SQL Editor را باز کنید
- [ ] User ID خود را پیدا کنید:
  ```sql
  SELECT id, email FROM auth.users;
  ```
- [ ] فایل `add-shebaco-products.sql` را باز کنید
- [ ] جایگزین `USER_ID_HERE` با UUID خود
- [ ] اسکریپت را اجرا کنید
- [ ] بررسی کنید محصولات اضافه شده‌اند:
  ```sql
  SELECT * FROM products LIMIT 5;
  ```

### 2. تنظیم Company Info
- [ ] به `http://localhost:3000/invoice` بروید
- [ ] Login کنید
- [ ] Settings → Company Info
- [ ] اطلاعات را پر کنید:
  - [ ] Company Name: Shebaco
  - [ ] Email: Sabaram88@gmail.com
  - [ ] Phone: 301-337-1221
  - [ ] Address: (آدرس شرکت شما)
  - [ ] Logo: آپلود لوگوی Shebaco
- [ ] Save کنید

### 3. تست Flyer Designer
- [ ] به `http://localhost:3000/invoice/flyer` بروید
- [ ] محصولات را ببینید (باید 7 محصول نمایش داده شود)
- [ ] Text Settings را تست کنید
- [ ] Color Scheme را عوض کنید
- [ ] Print Preview را امتحان کنید
- [ ] Download PDF را تست کنید

## 🎨 سفارشی‌سازی (اختیاری)

### محصولات اضافی
- [ ] محصولات خود را اضافه کنید
- [ ] Pricing Tiers را تنظیم کنید
- [ ] جزئیات محصولات را کامل کنید

### طراحی
- [ ] لوگوی خود را آپلود کنید
- [ ] رنگ‌های برند را انتخاب کنید
- [ ] عنوان و زیرعنوان دلخواه

## 🚀 آماده برای Deployment

پس از تست موفق:
- [ ] Build پروژه: `npm run build`
- [ ] اسکریپت deploy را اجرا کنید: `.\deploy-invoice.ps1`
- [ ] فایل ZIP را به سرور آپلود کنید
- [ ] راهنمای [INVOICE_DEPLOYMENT.md](./INVOICE_DEPLOYMENT.md) را دنبال کنید

## 📊 نتیجه نهایی

پس از تکمیل این checklist:
- ✅ فلایر حرفه‌ای مشابه Shebaco
- ✅ قابلیت چاپ و PDF
- ✅ کاملاً سفارشی‌سازی‌پذیر
- ✅ آماده برای Production

---

**Current Status:**
- Server: ✅ Running on http://localhost:3000
- Database: ⏳ Needs setup (add products)
- Company Info: ⏳ Needs setup
- Ready to use: 🎯 Almost there!
