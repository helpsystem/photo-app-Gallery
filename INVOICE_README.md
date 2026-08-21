# 📊 Invoice & Product Manager (Shebaco)

سیستم مدیریت فاکتور و محصول برای کسب‌وکارهای کوچک و متوسط.

## ✨ ویژگی‌ها

### 📦 مدیریت محصولات
- ایجاد و مدیریت محصولات با دسته‌بندی
- سطوح قیمتی چندگانه (Pricing Tiers) برای هر محصول
- قیمت‌گذاری بر اساس تعداد سفارش (Bulk pricing)
- جزئیات کامل محصول

### 🧾 مدیریت فاکتور
- ساخت فاکتور حرفه‌ای
- شماره‌گذاری خودکار فاکتورها
- محاسبه خودکار قیمت بر اساس تعداد
- تخفیف (ثابت یا درصدی)
- محاسبه خودکار مالیات
- وضعیت‌های مختلف: پیش‌نویس، ارسال شده، پرداخت شده، لغو شده

### 👥 مدیریت مشتریان
- ذخیره اطلاعات مشتریان
- تاریخچه فاکتورهای هر مشتری
- اطلاعات تماس کامل

### 🎨 سفارشی‌سازی
- تنظیم اطلاعات شرکت/برند
- آپلود لوگو
- تنظیم رنگ اصلی (Accent Color)
- انتخاب فونت
- انتخاب اندازه کاغذ (A4 یا Letter)
- تنظیم نرخ مالیات

### 🖨️ چاپ و خروجی
- چاپ مستقیم فاکتور
- دانلود PDF فاکتور
- طراحی مدرن با Glassmorphism UI
- پشتیبانی از RTL (فارسی) و LTR (انگلیسی)

### 🎨 Flyer Designer
- طراحی فلایر حرفه‌ای برای محصولات
- نمایش خودکار جدول قیمت‌های سطح‌بندی
- 4 طرح رنگی (Blue-Purple, Cyan-Purple, Green-Blue, Orange-Red)
- سفارشی‌سازی کامل (عنوان، لوگو، رنگ‌ها)
- انتخاب محصولات برای نمایش
- چاپ و دانلود PDF با کیفیت بالا
- قالب مشابه طراحی Shebaco

## 🚀 نحوه استفاده

### دسترسی به سیستم
1. وارد پنل مدیریت شوید
2. از منوی شناور (Floating Navigation) گزینه "Invoice" را انتخاب کنید
3. یا مستقیماً به آدرس `/invoice` بروید

### راه‌اندازی اولیه

#### 1. تنظیم اطلاعات شرکت
```
Settings → Company Info
- نام شرکت
- آدرس
- ایمیل
- تلفن
- لوگو (اختیاری)
```

#### 2. ایجاد محصول اول
```
Products → Create Product
- نام محصول
- دسته‌بندی
- جزئیات (اختیاری)
- سطوح قیمتی:
  * نام سطح (مثال: خرده‌فروشی، عمده 50+، عمده 500+)
  * حداقل تعداد
  * قیمت واحد
```

#### 3. ساخت فاکتور
```
Invoices → Create Invoice
- انتخاب/ایجاد مشتری
- افزودن محصولات به سبد خرید
- تعداد هر محصول (قیمت به صورت خودکار محاسبه می‌شود)
- تخفیف (اختیاری)
- یادداشت (اختیاری)
- ذخیره یا چاپ
```

#### 4. طراحی فلایر (Flyer Designer)
```
Dashboard → Flyer Designer
یا مستقیماً: /invoice/flyer

- Text Settings:
  * عنوان فلایر
  * زیرعنوان
  * نمایش/مخفی کردن لوگو
  
- Color Scheme:
  * انتخاب از 4 طرح رنگی
  
- Product Selection:
  * انتخاب محصولات برای نمایش
  * نمایش خودکار pricing tiers
  
- Actions:
  * Print Flyer (چاپ)
  * Download PDF (دانلود)
```

## 🗄️ ساختار دیتابیس

### جداول اصلی
- `products` - محصولات
- `pricing_tiers` - سطوح قیمتی
- `customers` - مشتریان
- `invoices` - فاکتورها
- `invoice_items` - آیتم‌های فاکتور
- `company_info` - اطلاعات شرکت
- `invoice_settings` - تنظیمات

برای جزئیات کامل به فایل `supabase-setup.sql` مراجعه کنید.

## 🔌 API Endpoints

### Products
```
GET    /api/invoice/products      - لیست محصولات
POST   /api/invoice/products      - ایجاد محصول
PUT    /api/invoice/products      - به‌روزرسانی محصول
DELETE /api/invoice/products?id=  - حذف محصول
```

### Invoices
```
GET    /api/invoice/invoices      - لیست فاکتورها
POST   /api/invoice/invoices      - ایجاد فاکتور
PUT    /api/invoice/invoices      - به‌روزرسانی فاکتور
DELETE /api/invoice/invoices?id=  - حذف فاکتور
```

### Customers
```
GET    /api/invoice/customers     - لیست مشتریان
POST   /api/invoice/customers     - ایجاد مشتری
PUT    /api/invoice/customers     - به‌روزرسانی مشتری
DELETE /api/invoice/customers?id= - حذف مشتری
```

### Settings
```
GET    /api/invoice/company-info  - دریافت اطلاعات شرکت
POST   /api/invoice/company-info  - ذخیره اطلاعات شرکت
GET    /api/invoice/settings      - دریافت تنظیمات
POST   /api/invoice/settings      - ذخیره تنظیمات
```

## 🎨 UI/UX

### طراحی
- **Theme**: Dark mode با Glassmorphism
- **رنگ‌های اصلی**: Cyan-Purple gradient
- **فونت**: Inter, Roboto, Jost (با پشتیبانی فارسی)
- **Responsive**: موبایل، تبلت، دسکتاپ

### تجربه کاربری
- واسط ساده و بصری
- محاسبات خودکار
- پیش‌نمایش زنده فاکتور
- انیمیشن‌های روان

## 🔒 امنیت

- **Authentication**: Supabase Auth
- **Authorization**: Row Level Security (RLS)
- **Access Control**: هر کاربر فقط به داده‌های خود دسترسی دارد
- **API Security**: بررسی اعتبار در همه APIها

## 📱 Multi-language Support

سیستم از چند زبان پشتیبانی می‌کند:
- 🇺🇸 English
- 🇮🇷 فارسی (Farsi/Persian)
- 🇪🇸 Español (آماده برای اضافه شدن)

برای افزودن زبان جدید، فایل مربوطه را در پوشه `messages/` اضافه کنید.

## 🛠️ توسعه

### تکنولوژی‌های استفاده شده
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Deployment**: Docker

### ساختار فایل‌ها
```
├── app/
│   ├── api/invoice/          # API Routes
│   └── [locale]/invoice/     # صفحات Invoice Manager
│       ├── page.tsx          # Dashboard اصلی
│       └── flyer/            # Flyer Designer
│           └── page.tsx
├── components/               # کامپوننت‌های React
├── lib/
│   └── invoice-types.ts      # TypeScript Types
├── messages/                 # فایل‌های ترجمه
├── supabase-setup.sql        # Database Schema
└── supabase-sample-products.sql  # محصولات نمونه Shebaco
```

### اجرای محلی
```bash
# نصب dependencies
npm install

# تنظیم متغیرهای محیطی
cp .env.example .env
# ویرایش .env و تنظیم Supabase credentials

# اجرای development server
npm run dev

# باز کردن در مرورگر
http://localhost:3000/invoice
```
Flyer Designer](./FLYER_DESIGNER_GUIDE.md)
- [راهنمای استفاده از Supabase](./supabase-setup.sql)
- [محصولات نمونه Shebaco](./supabase-sample-products
## 📚 مستندات بیشتر

- [راهنمای دیپلوی کامل](./INVOICE_DEPLOYMENT.md)
- [راهنمای استفاده از Supabase](./supabase-setup.sql)
- [Next.js Documentation](https://nextjs.org/docs)

## 🤝 مشارکت

برای افزودن ویژگی‌های جدید یا گزارش مشکلات:
1. Fork کنید
2. یک branch جدید ایجاد کنید
3. تغییرات را commit کنید
4. Pull Request ارسال کنید

## 📄 License

این پروژه تحت لایسنس MIT است.

## 🎯 Roadmap
x] ✅ Flyer Designer - طراحی فلایر تبلیغاتی
- [ ] AI-powered product descriptions (با Gemini API)
- [ ] Advanced Flyer Templates - قالب‌های پیشرفته‌تر
- [ ] Multi-page Flyers - فلایرهای چند صفحه‌ای
- [ ] Product Images in Flyers - تصاویر محصولات در فلایر
- [ ] AI-powered product descriptions (با Gemini API)
- [ ] Flyer Designer - طراحی فلایر تبلیغاتی
- [ ] Shipping Label Generator - تولید برچسب ارسال
- [ ] Email Integration - ارسال خودکار فاکتور
- [ ] Payment Gateway - پرداخت آنلاین
- [ ] Multi-currency Support - پشتیبانی از چند ارز
- [ ] Recurring Invoices - فاکتورهای دوره‌ای
- [ ] Reports & Analytics - گزارش‌گیری و تحلیل

---

**نسخه**: 1.0.0  
**تاریخ**: فوریه 2026  
**توسعه‌دهنده**: Shebaco / RamFamilyDesigns
