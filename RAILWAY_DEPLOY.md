# Quran Daily Tweet - Railway Deployment Guide

## 🚀 خطوات النشر على Railway

### 1. إنشاء حساب على Railway

اذهب إلى [railway.app](https://railway.app/) وسجل الدخول بحساب GitHub

### 2. تثبيت Railway CLI (اختياري)

```bash
npm install -g @railway/cli
```

### 3. رفع المشروع على GitHub (مهم)

```bash
# في مجلد المشروع
git init
git add .
git commit -m "Initial commit"

# أنشئ مستودع على GitHub ثم:
git remote add origin https://github.com/username/quran-daily-tweet.git
git push -u origin main
```

### 4. نشر من Railway Dashboard

1. اذهب إلى [railway.app/new](https://railway.app/new)
2. اختر **Deploy from GitHub repo**
3. اختر المستودع `quran-daily-tweet`
4. أضف المتغيرات البيئية:
   - `X_API_KEY`
   - `X_API_SECRET`
   - `X_ACCESS_TOKEN`
   - `X_ACCESS_TOKEN_SECRET`
   - `CRON_SCHEDULE` = `0 9,21 * * *`
   - `TIMEZONE` = `Asia/Muscat`
   - `ENABLE_POSTING` = `true`
   - `LOG_LEVEL` = `info`

5. اضغط **Deploy**

### 5. أو النشر من CLI

```bash
# تسجيل الدخول
railway login

# ربط المشروع
railway link

# إضافة المتغيرات
railway variables set X_API_KEY=your_key_here
railway variables set X_API_SECRET=your_secret_here
railway variables set X_ACCESS_TOKEN=your_token_here
railway variables set X_ACCESS_TOKEN_SECRET=your_token_secret_here

# النشر
railway up
```

## 📊 مراقبة الخدمة

- عرض السجلات: `railway logs`
- فتح Dashboard: `railway open`

## 💰 التكلفة

- **$5 مجاني** شهرياً
- بعدها: حوالي $1-2 شهرياً للاستخدام البسيط

## ⚠️ ملاحظات مهمة

1. **لا تنسى إضافة المتغيرات البيئية** في Railway Dashboard
2. المنطقة الزمنية ستكون صحيحة بسبب `Asia/Muscat`
3. الخدمة تعمل 24/7 تلقائياً
4. إعادة التشغيل التلقائي عند الأخطاء

## 🔄 تحديث المشروع

```bash
git add .
git commit -m "Update"
git push
# Railway سيقوم بالنشر تلقائياً
```
