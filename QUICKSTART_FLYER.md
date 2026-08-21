# 🚀 Quick Start - Flyer Designer

راهنمای شروع سریع برای استفاده از Invoice Manager & Flyer Designer

## 📝 مراحل اولیه (یکبار)

### 1️⃣ تنظیم Database (Supabase)

```sql
-- در Supabase SQL Editor:

-- الف) اجرای Schema اصلی (اگر هنوز نکردید)
-- فایل: supabase-setup.sql را کامل اجرا کنید

-- ب) افزودن محصولات نمونه Shebaco
-- 1. User ID خود را پیدا کنید:
SELECT id, email FROM auth.users;

-- 2. فایل add-shebaco-products.sql را باز کنید
-- 3. جایگزین 'USER_ID_HERE' با UUID خود
-- 4. اجرا کنید
```

### 2️⃣ تنظیم اطلاعات شرکت

```
1. به http://localhost:3000/invoice بروید
2. ورود به سیستم (Login)
3. Settings → Company Info:
   - Company Name: Shebaco
   - Email: Sabaram88@gmail.com
   - Phone: 301-337-1221
   - Address: (آدرس شرکت)
   - Logo: آپلود لوگو Shebaco
4. ذخیره
```

## 🎨 استفاده از Flyer Designer

### روش 1️⃣: از Dashboard
```
http://localhost:3000/invoice
→ کلیک روی "Flyer Designer" (بالای صفحه)
```

### روش 2️⃣: مستقیم
```
http://localhost:3000/invoice/flyer
```

## ✏️ سفارشی‌سازی فلایر

### Panel سمت چپ:

#### 1. Text Settings
```
Title: Art, Tech & Creative Marketing Solutions
Subtitle: CUSTOM RESIN KEYCHAINS
☑️ Show Logo
```

#### 2. Color Scheme
انتخاب کنید:
- 🔵 Blue-Purple (طراحی اصلی Shebaco) ✅
- 🌊 Cyan-Purple
- 🌿 Green-Blue
- 🔥 Orange-Red

#### 3. Products
محصولاتی که می‌خواهید در فلایر باشند را tick کنید

#### 4. Actions
- **Print Flyer**: چاپ مستقیم
- **Download PDF**: دانلود فایل PDF

## 📊 نتیجه

فلایر شما شامل:
- ✅ لوگوی Shebaco
- ✅ عنوان و زیرعنوان شما
- ✅ جدول محصولات با 3 سطح قیمت
- ✅ اطلاعات تماس
- ✅ طراحی حرفه‌ای با gradient

## 🎯 نکات مهم

### برای چاپ بهینه:
1. Print Flyer را کلیک کنید
2. در تنظیمات چاپ:
   - Paper Size: **A4**
   - Background Graphics: **Enabled** ✅
   - Margins: **None**
3. یا بهتر: **Download PDF** → سپس PDF را چاپ کنید

### برای ارسال دیجیتال:
1. **Download PDF** را کلیک کنید
2. فایل PDF آماده ارسال است:
   - ایمیل به مشتریان
   - اشتراک در شبکه‌های اجتماعی
   - آپلود به وب‌سایت

## 🔄 آپدیت محصولات

وقتی محصولات را تغییر می‌دهید:
1. Dashboard → Products → Edit
2. Flyer Designer را refresh کنید
3. تغییرات خودکار اعمال می‌شود ✅

## 🆘 نیاز به کمک؟

راهنماهای کامل:
- [FLYER_DESIGNER_GUIDE.md](./FLYER_DESIGNER_GUIDE.md) - راهنمای کامل Flyer
- [INVOICE_README.md](./INVOICE_README.md) - راهنمای Invoice Manager
- [INVOICE_DEPLOYMENT.md](./INVOICE_DEPLOYMENT.md) - راهنمای Deployment

## 🎬 از کجا شروع کنم؟

**همین الان:**
1. ✅ Server در حال اجرا است: `http://localhost:3000`
2. ✅ Dependencies نصب شده
3. ✅ فایل‌های Flyer Designer آماده است

**کافیه:**
1. Database را تنظیم کنید (add-shebaco-products.sql)
2. Company Info را پر کنید
3. به `/invoice/flyer` بروید
4. فلایر خود را طراحی کنید! 🎨

---

**⚡ Ready to go!** Development server در حال اجرا است.
